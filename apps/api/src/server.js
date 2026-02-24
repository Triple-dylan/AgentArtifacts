import http from "node:http";
import crypto from "node:crypto";
import { URL } from "node:url";
import { loadDataStore } from "./lib/data-store.js";
import { sendJson, readJsonBody, readRawBody, parseQuery } from "./lib/http.js";
import { filterCatalog, filterTrading } from "./lib/catalog.js";
import { toRegistryItem, toRegistryIndex } from "./lib/registry.js";
import { createStorage } from "./lib/storage/index.js";
import { evaluateUpsells } from "./lib/upsell.js";
import {
  isStripeEnabled,
  createStripeCheckoutSession,
  verifyStripeWebhookSignature,
} from "./lib/stripe.js";

const store = loadDataStore();
const runtime = await createStorage();

function disclosureVersionForProduct(product) {
  if (!product?.disclosure_required) return null;
  if (product.execution_mode === "paper") return "DISC-1.0.0-PAPER";
  if (product.execution_mode === "research") return "DISC-1.0.0-RESEARCH";
  return "DISC-1.0.0";
}

function getProductOr404(res, id) {
  const product = store.productsById.get(id);
  if (!product) {
    sendJson(res, 404, { error: `Product not found: ${id}` });
    return null;
  }
  return product;
}

function parsePath(pathname) {
  const registryProduct = pathname.match(/^\/registry\/products\/([^/]+)\.json$/);
  if (registryProduct) return { route: "registry-product", id: registryProduct[1] };

  const riskProfile = pathname.match(/^\/registry\/products\/([^/]+)\/risk-profile$/);
  if (riskProfile) return { route: "risk-profile", id: riskProfile[1] };

  return { route: pathname };
}

function buildSignedUrl(productId) {
  const token = crypto.randomBytes(12).toString("hex");
  return {
    token,
    signed_url: `https://cdn.agentassets.io/download/${productId}?token=${token}`,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}

function extractContextFromBody(body, product) {
  return {
    trigger_event: body.trigger_event || "",
    product_id: body.product_id || "",
    category: product?.category,
    market_type: product?.market_type,
    execution_mode: product?.execution_mode,
    lead_magnet: product?.lead_magnet || false,
    cart_total_usd: body.cart_total_usd || 0,
    cart_items: body.cart_items || [],
    already_discounted: body.already_discounted || false,
    redeemed_before: body.redeemed_before || false,
    owned_products: body.owned_products || [],
  };
}

function appBaseUrl(req) {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  const host = req.headers.host || "app.agentassets.io";
  const proto = String(req.headers["x-forwarded-proto"] || "https");
  return `${proto}://${host}`;
}

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const urlObj = new URL(req.url || "/", `http://${req.headers.host}`);
  const parsed = parsePath(urlObj.pathname);

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    res.end();
    return;
  }

  res.setHeader("access-control-allow-origin", "*");

  if (method === "GET" && parsed.route === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "agent-assets-api",
      storage: runtime.mode,
      products: store.products.length,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (method === "GET" && parsed.route === "/catalog") {
    const query = parseQuery(urlObj);
    const products = filterCatalog(store.products, query);
    sendJson(res, 200, { total: products.length, items: products });
    return;
  }

  if (method === "GET" && parsed.route === "/catalog/trading") {
    const query = parseQuery(urlObj);
    const products = filterTrading(store.products, query);
    sendJson(res, 200, { total: products.length, items: products });
    return;
  }

  if (method === "GET" && parsed.route === "/registry/index.json") {
    const query = parseQuery(urlObj);
    const page = Number(query.page || 1);
    const pageSize = Number(query.page_size || 50);
    const index = toRegistryIndex(store.products, store.bundles, page, pageSize);
    sendJson(res, 200, index);
    return;
  }

  if (method === "GET" && parsed.route === "registry-product") {
    const product = getProductOr404(res, parsed.id);
    if (!product) return;

    sendJson(res, 200, toRegistryItem(product, store.bundles));
    return;
  }

  if (method === "GET" && parsed.route === "risk-profile") {
    const product = getProductOr404(res, parsed.id);
    if (!product) return;

    if (product.market_type === "none") {
      sendJson(res, 404, { error: "Risk profile only exists for trading products." });
      return;
    }

    const registryItem = toRegistryItem(product, store.bundles);
    sendJson(res, 200, {
      id: product.id,
      execution_mode: product.execution_mode,
      market_type: product.market_type,
      risk_level: product.risk_level,
      risk_profile: registryItem.risk_profile,
      disclosure_required: product.disclosure_required,
      disclosure_profile: registryItem.disclosure_profile || null,
    });
    return;
  }

  if (method === "POST" && parsed.route === "/leads/capture") {
    const body = await readJsonBody(req);
    if (!body || !body.email || !body.source) {
      sendJson(res, 400, { error: "email and source are required" });
      return;
    }

    const lead = await runtime.addLead({
      email: body.email,
      source: body.source,
      product_id: body.product_id || null,
      funnel_variant: body.funnel_variant || "free_library",
      role_tag: body.role_tag || null,
      domain_tag: body.domain_tag || null,
      stack_tag: body.stack_tag || null,
      market_interest_tag: body.market_interest_tag || null,
    });

    sendJson(res, 201, { lead });
    return;
  }

  if (method === "POST" && parsed.route === "/checkout/session") {
    const body = await readJsonBody(req);
    if (!body || !Array.isArray(body.items) || body.items.length === 0 || !body.email) {
      sendJson(res, 400, { error: "items[] and email are required" });
      return;
    }

    const items = [];
    let subtotal = 0;

    for (const item of body.items) {
      const product = store.productsById.get(item.product_id);
      if (!product) {
        sendJson(res, 404, { error: `Unknown product_id: ${item.product_id}` });
        return;
      }

      if (product.status === "archived") {
        sendJson(res, 409, { error: `Product archived: ${item.product_id}` });
        return;
      }

      const quantity = Number(item.quantity || 1);
      const unitPrice = product.price_usd || 0;
      subtotal += quantity * unitPrice;
      items.push({
        product_id: product.id,
        quantity,
        unit_price_usd: unitPrice,
        name: product.name,
        short_desc: product.short_desc,
        category: product.category,
      });
    }

    const discountUsd = Number(body.discount_usd || 0);
    const totalUsd = subtotal - discountUsd;
    const stripeEnabled = isStripeEnabled();
    const status = stripeEnabled ? "pending" : "paid";

    const order = await runtime.createOrder({
      email: body.email,
      user_id: body.user_id || null,
      session_id: body.session_id || null,
      subtotal_usd: subtotal,
      discount_usd: discountUsd,
      total_usd: totalUsd,
      items,
      status,
    });

    const base = appBaseUrl(req);
    const successUrl =
      body.success_url || `${base}/success?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = body.cancel_url || `${base}/checkout?canceled=1&order_id=${order.id}`;

    if (!stripeEnabled) {
      sendJson(res, 200, {
        checkout_session_id: `cs_test_${order.id}`,
        checkout_url: `https://checkout.agentassets.io/session/${order.id}`,
        order_id: order.id,
        total_usd: order.total_usd,
        currency: "USD",
        mode: "stub",
      });
      return;
    }

    try {
      const stripeSession = await createStripeCheckoutSession({
        lineItems: items,
        email: body.email,
        orderId: order.id,
        successUrl,
        cancelUrl,
        metadata: {
          product_ids: items.map((i) => i.product_id).join(","),
        },
      });

      sendJson(res, 200, {
        checkout_session_id: stripeSession.id,
        checkout_url: stripeSession.url,
        order_id: order.id,
        total_usd: order.total_usd,
        currency: "USD",
        mode: "stripe",
      });
    } catch (error) {
      sendJson(res, error.status || 502, {
        error: "Failed to create Stripe Checkout session",
        detail: error.message,
        code: error.code || "stripe_error",
      });
    }
    return;
  }

  if (method === "POST" && parsed.route === "/webhooks/stripe") {
    const raw = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    const valid = verifyStripeWebhookSignature(raw, signature);
    if (!valid) {
      sendJson(res, 400, { error: "Invalid Stripe webhook signature" });
      return;
    }

    let event = {};
    try {
      event = raw ? JSON.parse(raw) : {};
    } catch {
      sendJson(res, 400, { error: "Invalid JSON payload" });
      return;
    }

    const type = event?.type || "unknown";
    const object = event?.data?.object || {};

    if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
      const orderId = object?.metadata?.order_id || object?.client_reference_id || null;
      if (orderId) {
        await runtime.markOrderPaid({
          order_id: orderId,
          external_checkout_id: object?.id || null,
        });
      }
    }

    sendJson(res, 200, {
      received: true,
      type,
      processed: true,
    });
    return;
  }

  if (method === "POST" && parsed.route === "/disclosures/acknowledge") {
    const body = await readJsonBody(req);
    if (!body || !body.disclosure_version || !body.context || !body.product_id) {
      sendJson(res, 400, { error: "disclosure_version, context, and product_id are required" });
      return;
    }

    const product = getProductOr404(res, body.product_id);
    if (!product) return;

    if (!product.disclosure_required) {
      sendJson(res, 409, { error: "Disclosure acknowledgement not required for this product" });
      return;
    }

    const ack = await runtime.addDisclosureAcceptance({
      disclosure_version: body.disclosure_version,
      context: body.context,
      product_id: body.product_id,
      session_id: body.session_id || null,
      order_id: body.order_id || null,
      user_id: body.user_id || null,
    });

    sendJson(res, 201, { acknowledgement: ack });
    return;
  }

  if (method === "POST" && parsed.route === "/paper-trade/simulate") {
    const body = await readJsonBody(req);
    if (!body || !body.product_id) {
      sendJson(res, 400, { error: "product_id is required" });
      return;
    }

    const product = getProductOr404(res, body.product_id);
    if (!product) return;

    if (!["paper", "live", "research", "mixed"].includes(product.execution_mode)) {
      sendJson(res, 409, { error: "Simulation not supported for this product" });
      return;
    }

    const trades = Number(body.trade_count || 20);
    const winRate = Number(body.win_rate || 0.54);
    const avgWin = Number(body.avg_win || 1.3);
    const avgLoss = Number(body.avg_loss || -1.0);
    const expectancy = winRate * avgWin + (1 - winRate) * avgLoss;
    const estimatedPnl = Number((expectancy * trades).toFixed(4));

    sendJson(res, 200, {
      product_id: product.id,
      execution_mode: product.execution_mode,
      trades,
      assumptions: { win_rate: winRate, avg_win: avgWin, avg_loss: avgLoss },
      expectancy_per_trade: Number(expectancy.toFixed(4)),
      estimated_pnl_units: estimatedPnl,
      disclaimer: "Simulation output is hypothetical and not investment advice.",
    });
    return;
  }

  if (method === "POST" && parsed.route === "/execution/validate-config") {
    const body = await readJsonBody(req);
    if (!body || !body.product_id || !body.config) {
      sendJson(res, 400, { error: "product_id and config are required" });
      return;
    }

    const product = getProductOr404(res, body.product_id);
    if (!product) return;

    if (product.execution_mode !== "live") {
      sendJson(res, 409, { error: "Config preflight is only required for live execution products." });
      return;
    }

    const requiredFields = ["connector", "symbol", "max_position_size", "kill_switch_enabled"];
    const missing = requiredFields.filter((key) => !(key in body.config));

    if (missing.length > 0) {
      sendJson(res, 422, { valid: false, missing_fields: missing });
      return;
    }

    if (body.config.kill_switch_enabled !== true) {
      sendJson(res, 422, {
        valid: false,
        error: "kill_switch_enabled must be true for live execution configs",
      });
      return;
    }

    sendJson(res, 200, {
      valid: true,
      product_id: product.id,
      checks: {
        disclosure_required: product.disclosure_required,
        risk_level: product.risk_level,
        connector: body.config.connector,
      },
    });
    return;
  }

  if (method === "POST" && parsed.route === "/downloads/signed-url") {
    const body = await readJsonBody(req);
    if (!body || !body.product_id) {
      sendJson(res, 400, { error: "product_id is required" });
      return;
    }

    const product = getProductOr404(res, body.product_id);
    if (!product) return;

    const entitled = await runtime.hasEntitlement({
      product_id: body.product_id,
      order_id: body.order_id,
      user_id: body.user_id,
      email: body.email,
      session_id: body.session_id,
    });

    if (!entitled) {
      sendJson(res, 403, { error: "No active entitlement for this product" });
      return;
    }

    if (product.disclosure_required) {
      const version = disclosureVersionForProduct(product);
      const acked = await runtime.hasDisclosureAck(product.id, version, {
        order_id: body.order_id,
        user_id: body.user_id,
        session_id: body.session_id,
      });

      if (!acked) {
        sendJson(res, 403, {
          error: "Disclosure acknowledgement required before download",
          disclosure_version: version,
        });
        return;
      }
    }

    sendJson(res, 200, {
      product_id: product.id,
      ...buildSignedUrl(product.id),
    });
    return;
  }

  if (method === "POST" && parsed.route === "/upsell/evaluate") {
    const body = await readJsonBody(req);
    if (!body || !body.trigger_event) {
      sendJson(res, 400, { error: "trigger_event is required" });
      return;
    }

    const product = body.product_id ? store.productsById.get(body.product_id) : null;
    const context = extractContextFromBody(body, product);
    const recommendations = evaluateUpsells(store.upsellRules, context, store.productsById);

    sendJson(res, 200, {
      trigger_event: body.trigger_event,
      context,
      recommendations,
    });
    return;
  }

  sendJson(res, 404, { error: `No route for ${method} ${urlObj.pathname}` });
});

const port = Number(process.env.PORT || 8787);
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`agent-assets-api listening on :${port}`);
});

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Shutting down API...`);
  server.close(async () => {
    try {
      await runtime.close();
      process.exit(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
