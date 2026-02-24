import crypto from "node:crypto";

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

export class RuntimeState {
  constructor() {
    this.mode = "memory";
    this.leads = [];
    this.disclosureAcceptances = [];
    this.orders = [];
    this.entitlements = [];
  }

  ensureEntitlement(order, item) {
    const exists = this.entitlements.some(
      (e) => e.order_id === order.id && e.product_id === item.product_id && e.status === "active"
    );
    if (exists) return;

    this.entitlements.push({
      id: makeId("ent"),
      order_id: order.id,
      product_id: item.product_id,
      user_id: order.user_id || null,
      session_id: order.session_id || null,
      email: order.email,
      status: "active",
      starts_at: new Date().toISOString(),
    });
  }

  async addLead(payload) {
    const row = {
      id: makeId("lead"),
      created_at: new Date().toISOString(),
      ...payload,
    };
    this.leads.push(row);
    return row;
  }

  async addDisclosureAcceptance(payload) {
    const row = {
      id: makeId("ack"),
      accepted_at: new Date().toISOString(),
      ...payload,
    };
    this.disclosureAcceptances.push(row);
    return row;
  }

  async hasDisclosureAck(productId, disclosureVersion, userContext = {}) {
    return this.disclosureAcceptances.some((ack) => {
      if (ack.product_id !== productId) return false;
      if (ack.disclosure_version !== disclosureVersion) return false;
      if (userContext.user_id && ack.user_id === userContext.user_id) return true;
      if (userContext.order_id && ack.order_id === userContext.order_id) return true;
      if (userContext.session_id && ack.session_id === userContext.session_id) return true;
      return false;
    });
  }

  async createOrder(payload) {
    const order = {
      id: makeId("ord"),
      created_at: new Date().toISOString(),
      status: payload.status || "paid",
      ...payload,
    };
    this.orders.push(order);

    if (order.status === "paid") {
      for (const item of payload.items || []) {
        this.ensureEntitlement(order, item);
      }
    }

    return order;
  }

  async markOrderPaid({ order_id, external_checkout_id }) {
    const order = this.orders.find((o) => o.id === order_id);
    if (!order) return null;

    order.status = "paid";
    if (external_checkout_id) {
      order.external_checkout_id = external_checkout_id;
    }

    for (const item of order.items || []) {
      this.ensureEntitlement(order, item);
    }

    return order;
  }

  async hasEntitlement({ product_id, user_id, order_id, email, session_id }) {
    return this.entitlements.some((e) => {
      if (e.product_id !== product_id) return false;
      if (e.status !== "active") return false;
      if (order_id && e.order_id === order_id) return true;
      if (user_id && e.user_id === user_id) return true;
      if (email && e.email === email) return true;
      if (session_id && e.session_id === session_id) return true;
      return false;
    });
  }

  async close() {
    // No-op for memory mode.
  }
}
