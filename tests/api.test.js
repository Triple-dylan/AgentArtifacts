const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");

const PORT = 8788;
const BASE = `http://127.0.0.1:${PORT}`;

let proc;

async function waitForHealth() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch(`${BASE}/health`);
      if (res.ok) return;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("API failed to start");
}

test.before(async () => {
  proc = spawn("node", ["apps/api/src/server.js"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });
  await waitForHealth();
});

test.after(() => {
  if (proc) proc.kill("SIGTERM");
});

test("GET /catalog returns products", async () => {
  const res = await fetch(`${BASE}/catalog`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.total, 50);
});

test("GET /catalog/trading filters trading assets", async () => {
  const res = await fetch(`${BASE}/catalog/trading?execution_mode=live`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.total >= 1);
  assert.ok(body.items.every((i) => i.execution_mode === "live"));
});

test("GET /registry/index.json paginates", async () => {
  const res = await fetch(`${BASE}/registry/index.json?page=1&page_size=10`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.pagination.page_size, 10);
  assert.equal(body.items.length, 10);
});

test("POST /checkout/session and /downloads/signed-url with disclosure ack", async () => {
  const checkoutRes = await fetch(`${BASE}/checkout/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      session_id: "sess_1",
      items: [{ product_id: "AA-AGT-TRD-LIVECOORD-PRO-030", quantity: 1 }],
    }),
  });

  assert.equal(checkoutRes.status, 200);
  const checkout = await checkoutRes.json();

  const blockedRes = await fetch(`${BASE}/downloads/signed-url`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      product_id: "AA-AGT-TRD-LIVECOORD-PRO-030",
      order_id: checkout.order_id,
      email: "user@example.com",
      session_id: "sess_1",
    }),
  });

  assert.equal(blockedRes.status, 403);

  const ackRes = await fetch(`${BASE}/disclosures/acknowledge`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      disclosure_version: "DISC-1.0.0",
      context: "checkout",
      product_id: "AA-AGT-TRD-LIVECOORD-PRO-030",
      order_id: checkout.order_id,
      session_id: "sess_1",
    }),
  });

  assert.equal(ackRes.status, 201);

  const okRes = await fetch(`${BASE}/downloads/signed-url`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      product_id: "AA-AGT-TRD-LIVECOORD-PRO-030",
      order_id: checkout.order_id,
      email: "user@example.com",
      session_id: "sess_1",
    }),
  });

  assert.equal(okRes.status, 200);
  const okBody = await okRes.json();
  assert.match(okBody.signed_url, /https:\/\/cdn\.agentassets\.io\/download\//);
});

test("POST /upsell/evaluate returns ranked recommendations", async () => {
  const res = await fetch(`${BASE}/upsell/evaluate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      trigger_event: "download",
      product_id: "AA-PRM-TRD-MARKETTHESIS-PRO-009",
      owned_products: [],
    }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.recommendations));
  assert.ok(body.recommendations.length >= 1);
});
