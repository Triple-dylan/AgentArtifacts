import crypto from "node:crypto";

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

export class PostgresStore {
  constructor(pool) {
    this.pool = pool;
    this.mode = "postgres";
  }

  async addLead(payload) {
    const query = `
      INSERT INTO lead_captures (
        email, source, product_id, funnel_variant, role_tag, domain_tag, stack_tag, market_interest_tag
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, email, source, product_id, funnel_variant, role_tag, domain_tag, stack_tag, market_interest_tag, created_at
    `;

    const values = [
      payload.email,
      payload.source,
      payload.product_id,
      payload.funnel_variant,
      payload.role_tag,
      payload.domain_tag,
      payload.stack_tag,
      payload.market_interest_tag,
    ];

    const { rows } = await this.pool.query(query, values);
    return rows[0];
  }

  async addDisclosureAcceptance(payload) {
    const query = `
      INSERT INTO disclosure_acceptances (
        disclosure_version, product_id, context, session_id, order_id, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id, disclosure_version, product_id, context, session_id, order_id, user_id, accepted_at
    `;

    const values = [
      payload.disclosure_version,
      payload.product_id,
      payload.context,
      payload.session_id,
      payload.order_id,
      payload.user_id,
    ];

    const { rows } = await this.pool.query(query, values);
    return rows[0];
  }

  async hasDisclosureAck(productId, disclosureVersion, userContext = {}) {
    const clauses = ["product_id = $1", "disclosure_version = $2"];
    const values = [productId, disclosureVersion];

    const identifiers = [];
    if (userContext.user_id) {
      values.push(userContext.user_id);
      identifiers.push(`user_id = $${values.length}`);
    }

    if (userContext.order_id) {
      values.push(userContext.order_id);
      identifiers.push(`order_id = $${values.length}`);
    }

    if (userContext.session_id) {
      values.push(userContext.session_id);
      identifiers.push(`session_id = $${values.length}`);
    }

    if (identifiers.length === 0) return false;

    clauses.push(`(${identifiers.join(" OR ")})`);

    const query = `SELECT 1 FROM disclosure_acceptances WHERE ${clauses.join(" AND ")} LIMIT 1`;
    const { rowCount } = await this.pool.query(query, values);
    return rowCount > 0;
  }

  async createOrder(payload) {
    const orderId = makeId("ord");
    const client = await this.pool.connect();
    const status = payload.status || "paid";

    try {
      await client.query("BEGIN");

      await client.query(
        `
          INSERT INTO orders (id, external_checkout_id, user_id, email, subtotal_usd, discount_usd, total_usd, currency, status)
          VALUES ($1,$2,$3,$4,$5,$6,$7,'USD',$8)
        `,
        [
          orderId,
          payload.external_checkout_id || null,
          payload.user_id,
          payload.email,
          payload.subtotal_usd,
          payload.discount_usd,
          payload.total_usd,
          status,
        ]
      );

      for (const item of payload.items || []) {
        await client.query(
          `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price_usd, line_total_usd)
            VALUES ($1,$2,$3,$4,$5)
          `,
          [
            orderId,
            item.product_id,
            item.quantity,
            item.unit_price_usd,
            item.quantity * item.unit_price_usd,
          ]
        );

        if (status === "paid") {
          await client.query(
            `
              INSERT INTO entitlements (order_id, product_id, user_id, email, session_id, license_seats, updates_feed_active, status)
              VALUES ($1,$2,$3,$4,$5,$6,false,'active')
            `,
            [
              orderId,
              item.product_id,
              payload.user_id,
              payload.email,
              payload.session_id,
              payload.license_seats || null,
            ]
          );
        }
      }

      await client.query("COMMIT");

      return {
        id: orderId,
        email: payload.email,
        user_id: payload.user_id,
        subtotal_usd: payload.subtotal_usd,
        discount_usd: payload.discount_usd,
        total_usd: payload.total_usd,
        status,
        external_checkout_id: payload.external_checkout_id || null,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async hasEntitlement({ product_id, user_id, order_id, email, session_id }) {
    const clauses = ["product_id = $1", "status = 'active'"];
    const values = [product_id];
    const keys = [];

    if (order_id) {
      values.push(order_id);
      keys.push(`order_id = $${values.length}`);
    }

    if (user_id) {
      values.push(user_id);
      keys.push(`user_id = $${values.length}`);
    }

    if (email) {
      values.push(email);
      keys.push(`email = $${values.length}`);
    }

    if (session_id) {
      values.push(session_id);
      keys.push(`session_id = $${values.length}`);
    }

    if (keys.length === 0) return false;

    clauses.push(`(${keys.join(" OR ")})`);

    const query = `SELECT 1 FROM entitlements WHERE ${clauses.join(" AND ")} LIMIT 1`;
    const { rowCount } = await this.pool.query(query, values);
    return rowCount > 0;
  }

  async markOrderPaid({ order_id, external_checkout_id }) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `
          UPDATE orders
          SET status = 'paid',
              external_checkout_id = COALESCE($2, external_checkout_id)
          WHERE id = $1
          RETURNING id, user_id, email
        `,
        [order_id, external_checkout_id || null]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return null;
      }

      const order = rows[0];
      const itemsRes = await client.query(
        `SELECT product_id FROM order_items WHERE order_id = $1`,
        [order_id]
      );

      for (const item of itemsRes.rows) {
        const existsRes = await client.query(
          `
            SELECT 1
            FROM entitlements
            WHERE order_id = $1 AND product_id = $2 AND status = 'active'
            LIMIT 1
          `,
          [order_id, item.product_id]
        );

        if (existsRes.rowCount > 0) continue;

        await client.query(
          `
            INSERT INTO entitlements (order_id, product_id, user_id, email, updates_feed_active, status)
            VALUES ($1,$2,$3,$4,false,'active')
          `,
          [order_id, item.product_id, order.user_id, order.email]
        );
      }

      await client.query("COMMIT");
      return { id: order_id, status: "paid" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
  }
}
