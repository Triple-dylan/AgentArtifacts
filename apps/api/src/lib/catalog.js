export function filterCatalog(products, query) {
  return products.filter((p) => {
    if (query.type && p.category !== query.type) return false;
    if (query.vertical) {
      const v = query.vertical.toLowerCase();
      const hay = `${p.subcategory} ${p.tags_keywords.join(" ")} ${p.name}`.toLowerCase();
      if (!hay.includes(v)) return false;
    }
    if (query.compatibility && !p.compatibility.includes(query.compatibility)) return false;

    const min = query.price_min ? Number(query.price_min) : null;
    const max = query.price_max ? Number(query.price_max) : null;
    const price = p.price_usd ?? 0;

    if (min != null && !Number.isNaN(min) && price < min) return false;
    if (max != null && !Number.isNaN(max) && price > max) return false;

    return true;
  });
}

export function filterTrading(products, query) {
  return products.filter((p) => {
    if (p.market_type === "none") return false;
    if (query.execution_mode && p.execution_mode !== query.execution_mode) return false;
    if (query.market_type && p.market_type !== query.market_type) return false;

    if (query.connector) {
      if (!["api", "websocket", "webhook"].includes(query.connector)) return false;
      if (query.connector !== "api" && p.execution_mode === "none") return false;
    }

    return true;
  });
}
