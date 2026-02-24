import crypto from "node:crypto";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function toFormBody(payload, prefix = "") {
  const pairs = [];

  for (const [key, value] of Object.entries(payload || {})) {
    if (value === undefined || value === null) continue;

    const formKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === "object" && item !== null) {
          pairs.push(...toFormBody(item, `${formKey}[${idx}]`));
        } else {
          pairs.push(`${encodeURIComponent(`${formKey}[${idx}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
      continue;
    }

    if (typeof value === "object") {
      pairs.push(...toFormBody(value, formKey));
      continue;
    }

    pairs.push(`${encodeURIComponent(formKey)}=${encodeURIComponent(String(value))}`);
  }

  return pairs;
}

async function stripeRequest(secretKey, method, path, payload = {}) {
  const url = `${STRIPE_API_BASE}${path}`;
  const formBody = toFormBody(payload).join("&");

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: method === "GET" ? undefined : formBody,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message || `Stripe request failed (${response.status})`;
    const code = body?.error?.code || "stripe_error";
    const error = new Error(message);
    error.code = code;
    error.status = response.status;
    throw error;
  }

  return body;
}

export function isStripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createStripeCheckoutSession({ lineItems, email, orderId, successUrl, cancelUrl, metadata }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  const payload = {
    mode: "payment",
    customer_email: email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: orderId,
    metadata: {
      order_id: orderId,
      ...metadata,
    },
    line_items: lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(item.unit_price_usd || 0) * 100),
        product_data: {
          name: item.name,
          description: item.short_desc || undefined,
          metadata: {
            product_id: item.product_id,
            category: item.category,
          },
        },
      },
    })),
  };

  return stripeRequest(secretKey, "POST", "/checkout/sessions", payload);
}

function parseStripeSignature(header) {
  const out = {};
  for (const part of String(header || "").split(",")) {
    const [k, ...rest] = part.split("=");
    if (!k || rest.length === 0) continue;
    out[k.trim()] = rest.join("=").trim();
  }
  return out;
}

export function verifyStripeWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return true;

  const parsed = parseStripeSignature(signatureHeader);
  const timestamp = parsed.t;
  const signature = parsed.v1;
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload, "utf8").digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
