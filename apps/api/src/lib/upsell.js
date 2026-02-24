function parseOwnsAny(condition) {
  const match = /^owns_any\((.*)\)$/.exec(condition || "");
  if (!match) return [];
  return match[1]
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseContainsMixed(condition) {
  return String(condition || "").startsWith("contains_mixed");
}

function hasMixedCart(items = [], productsById) {
  let hasTrading = false;
  let hasNonTrading = false;

  for (const id of items) {
    const p = productsById.get(id);
    if (!p) continue;
    if (p.market_type !== "none") hasTrading = true;
    if (p.market_type === "none") hasNonTrading = true;
  }

  return hasTrading && hasNonTrading;
}

function matchesFilter(rule, ctx, productsById) {
  const filter = rule.trigger_filter || "";
  if (!filter || filter === "none") return true;

  if (filter.includes("lead_magnet=true") && !ctx.lead_magnet) return false;
  if (filter.includes("category=prompt") && ctx.category !== "prompt") return false;
  if (filter.includes("market_type=prediction") && ctx.market_type !== "prediction") return false;
  if (filter.includes("market_type!=none") && ctx.market_type === "none") return false;
  if (filter.includes("category=skill") && ctx.category !== "skill") return false;
  if (filter.includes("market_type=hybrid") && ctx.market_type !== "hybrid") return false;
  if (filter.includes("execution_mode=live") && ctx.execution_mode !== "live") return false;

  if (filter.includes("product_id=")) {
    const expected = filter.split("product_id=")[1].split(/[ )]/)[0].trim();
    if (ctx.product_id !== expected) return false;
  }

  if (filter.includes("cart_total_usd>=300") && Number(ctx.cart_total_usd || 0) < 300) {
    return false;
  }

  if (parseContainsMixed(filter) && !hasMixedCart(ctx.cart_items || [], productsById)) {
    return false;
  }

  return true;
}

function isSuppressed(rule, ctx) {
  const suppression = rule.suppression_condition || "";
  if (!suppression || suppression === "none") return false;

  if (suppression.includes("already_discounted=true") && ctx.already_discounted) {
    return true;
  }

  if (suppression.startsWith("owns_any")) {
    const blocked = parseOwnsAny(suppression);
    const owned = new Set(ctx.owned_products || []);
    return blocked.some((id) => owned.has(id));
  }

  if (suppression.includes("redeemed_before=true") && ctx.redeemed_before) {
    return true;
  }

  return false;
}

export function evaluateUpsells(rules, ctx, productsById) {
  const matched = [];

  for (const rule of rules) {
    if (rule.trigger_event !== ctx.trigger_event) continue;
    if (!matchesFilter(rule, ctx, productsById)) continue;
    if (isSuppressed(rule, ctx)) continue;

    matched.push({
      rule_id: rule.rule_id,
      recommendation_type: rule.recommendation_type,
      target_id: rule.recommendation_target,
      priority: rule.priority,
      window_hours: rule.window_hours,
      notes: rule.notes,
    });
  }

  return matched.sort((a, b) => b.priority - a.priority);
}
