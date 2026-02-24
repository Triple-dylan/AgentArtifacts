function inferFiles(product) {
  if (product.category === "bundle") return [];
  const approxSize = parseFloat(String(product.size_estimate).replace(/[^0-9.]/g, "")) || 1;
  const bytes = Math.round(approxSize * 1024 * 1024);
  const names = product.included_files.length ? product.included_files : ["README.md"];
  const per = Math.max(256, Math.round(bytes / names.length));

  return names.map((name) => ({
    path: name,
    type: name.endsWith(".json") ? "json" : name.endsWith(".yaml") ? "yaml" : "markdown",
    bytes: per,
  }));
}

function supportSla(level) {
  if (level === "priority") return "1 business day";
  if (level === "email") return "2 business days";
  return "best effort";
}

function parseSeatValue(seats) {
  const n = Number(seats);
  if (!Number.isNaN(n) && n > 0) return n;
  return seats || "custom";
}

function registryType(category) {
  if (category === "utility") return "utility";
  if (category === "doc") return "doc";
  return category;
}

function defaultDownloadUrl(product) {
  return `https://api.agentassets.io/downloads/${product.id}`;
}

function defaultSampleUrl(product) {
  if (product.sample_available && product.sample_link) return product.sample_link;
  return `https://api.agentassets.io/samples/${product.id}`;
}

function buildRiskProfile(product) {
  if (product.market_type === "none") return undefined;
  if (product.risk_level === "low") {
    return {
      max_position_size: "5% NAV",
      max_exposure_pct: 30,
      stop_rules: ["optional_soft_stop"],
      circuit_breaker_rules: ["api_error_pause"],
    };
  }

  if (product.risk_level === "med") {
    return {
      max_position_size: "3% NAV",
      max_exposure_pct: 20,
      stop_rules: ["soft_stop_required", "session_loss_monitor"],
      circuit_breaker_rules: ["volatility_pause", "api_error_pause"],
    };
  }

  return {
    max_position_size: "2% NAV",
    max_exposure_pct: 15,
    stop_rules: ["hard_stop_required", "daily_loss_limit_required"],
    circuit_breaker_rules: ["volatility_pause", "venue_disconnect_pause", "api_error_pause"],
  };
}

function buildDisclosureProfile(product) {
  if (!product.disclosure_required) return undefined;

  return {
    disclosure_version: product.execution_mode === "paper" ? "DISC-1.0.0-PAPER" : "DISC-1.0.0",
    ack_required: true,
    display_context: ["product_page", "checkout", "download"],
  };
}

export function toRegistryItem(product, bundleMap) {
  const type = registryType(product.category);
  const files = inferFiles(product);
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  const item = {
    registry_schema_version: "1.1.0",
    id: product.id,
    type,
    name: product.name,
    description: product.short_desc,
    version: product.version,
    format: product.format,
    files,
    size_bytes: totalBytes,
    compatibility: product.compatibility,
    dependencies: product.dependencies,
    required_secrets: product.dependencies.map((dep) => `${dep.toUpperCase()}_KEY`),
    license: {
      type: product.license_type,
      seats: parseSeatValue(product.seats),
      redistribution_policy: product.redistribution_policy,
      commercial_use: product.license_type !== "personal",
    },
    price_usd: product.price_usd ?? 0,
    currency: "USD",
    billing_type: product.category === "bundle" ? "one_time" : "one_time",
    availability: product.status,
    created_at: product.release_date_iso || "2026-02-22T00:00:00Z",
    updated_at: product.last_updated || "2026-02-22T00:00:00Z",
    urls: {
      product_page: `https://agentassets.io/products/${product.slug}`,
      docs: product.support_docs_link || `https://agentassets.io/docs/${product.slug}`,
      download_endpoint: defaultDownloadUrl(product),
      sample_endpoint: defaultSampleUrl(product),
      changelog: `https://agentassets.io${product.changelog}`,
    },
    tags: product.tags_keywords,
    keywords: [product.primary_keyword, ...product.secondary_keywords].filter(Boolean),
    support: {
      level: product.support_level,
      contact: "support@agentassets.io",
      sla: supportSla(product.support_level),
    },
    execution_mode: product.execution_mode || "none",
    market_type: product.market_type || "none",
    connector_type: product.market_type === "none" ? [] : ["api"],
    risk_level: product.risk_level || "low",
    disclosure_required: product.disclosure_required,
  };

  if (type === "skill" || type === "agent") {
    item.input_schema = `https://agentassets.io/schemas/${product.slug}-input-v1`;
    item.output_schema = `https://agentassets.io/schemas/${product.slug}-output-v1`;
  }

  if (type === "bundle") {
    const bundle = bundleMap.get(product.id);
    item.bundle_contents = (bundle?.items || []).map((bi) => ({
      product_id: bi.component_product_id,
      quantity: bi.quantity,
      notes: bi.notes,
    }));
  }

  if (product.market_type !== "none") {
    item.market_data_schema = "https://agentassets.io/schemas/market-data-v1";
    item.trade_action_schema = "https://agentassets.io/schemas/trade-action-v1";
    item.risk_profile = buildRiskProfile(product);
  }

  if (product.disclosure_required) {
    item.disclosure_profile = buildDisclosureProfile(product);
  }

  return item;
}

export function toRegistryIndex(products, bundleMap, page = 1, pageSize = 50) {
  const start = (page - 1) * pageSize;
  const slice = products.slice(start, start + pageSize);
  const totalPages = Math.ceil(products.length / pageSize) || 1;

  return {
    registry_schema_version: "1.1.0",
    generated_at: new Date().toISOString(),
    pagination: {
      page,
      page_size: pageSize,
      total_items: products.length,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    },
    filters: {
      types: ["prompt", "skill", "agent", "utility", "doc", "bundle"],
      availability: ["draft", "active", "archived"],
      execution_mode: ["none", "research", "paper", "live", "mixed"],
      market_type: ["none", "prediction", "crypto_perps", "hybrid"],
    },
    items: slice.map((product) => ({
      id: product.id,
      type: registryType(product.category),
      name: product.name,
      version: product.version,
      price_usd: product.price_usd ?? 0,
      availability: product.status,
      execution_mode: product.execution_mode,
      market_type: product.market_type,
      product_page: `https://agentassets.io/products/${product.slug}`,
      tags: product.tags_keywords,
    })),
  };
}
