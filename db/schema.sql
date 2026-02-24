-- Agent Assets Store relational model (Postgres)

CREATE TYPE product_type AS ENUM ('prompt', 'skill', 'agent', 'utility', 'doc', 'bundle');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE support_level AS ENUM ('community', 'email', 'priority');
CREATE TYPE billing_type AS ENUM ('one_time', 'subscription');
CREATE TYPE execution_mode AS ENUM ('none', 'research', 'paper', 'live', 'mixed');
CREATE TYPE market_type AS ENUM ('none', 'prediction', 'crypto_perps', 'hybrid');
CREATE TYPE risk_level AS ENUM ('low', 'med', 'high');
CREATE TYPE intent_type AS ENUM ('TOFU', 'MOFU', 'BOFU');

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT NOT NULL,
  category product_type NOT NULL,
  subcategory TEXT NOT NULL,
  tags_keywords TEXT NOT NULL,
  format TEXT NOT NULL,
  file_count INT NOT NULL DEFAULT 0,
  included_files TEXT NOT NULL,
  size_estimate TEXT NOT NULL,
  current_version TEXT NOT NULL,
  release_date DATE NOT NULL,
  compatibility TEXT NOT NULL,
  dependencies TEXT NOT NULL,
  license_type TEXT NOT NULL,
  seats TEXT NOT NULL,
  redistribution_policy TEXT NOT NULL,
  status product_status NOT NULL DEFAULT 'draft',
  support_level support_level NOT NULL,
  support_docs_link TEXT,
  demo_link TEXT,
  sample_available BOOLEAN NOT NULL DEFAULT FALSE,
  sample_link TEXT,
  primary_keyword TEXT,
  secondary_keywords TEXT,
  intent intent_type,
  lead_magnet BOOLEAN NOT NULL DEFAULT FALSE,
  email_capture_required BOOLEAN NOT NULL DEFAULT FALSE,
  landing_page_type TEXT NOT NULL,
  execution_mode execution_mode NOT NULL DEFAULT 'none',
  market_type market_type NOT NULL DEFAULT 'none',
  risk_level risk_level NOT NULL DEFAULT 'low',
  disclosure_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_versions (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changelog TEXT,
  changelog_url TEXT,
  released_at TIMESTAMPTZ NOT NULL,
  UNIQUE(product_id, version)
);

CREATE TABLE product_files (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  bytes BIGINT NOT NULL,
  checksum TEXT,
  UNIQUE(product_id, version, file_path)
);

CREATE TABLE prices (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_usd NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  cost_basis NUMERIC(10,2),
  discount_eligibility TEXT NOT NULL,
  billing_type billing_type NOT NULL DEFAULT 'one_time',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE licenses (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  license_type TEXT NOT NULL,
  seats TEXT NOT NULL,
  redistribution_policy TEXT NOT NULL,
  commercial_use BOOLEAN NOT NULL DEFAULT TRUE,
  support_level support_level NOT NULL,
  sla_text TEXT
);

CREATE TABLE bundles (
  id TEXT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  bundle_name TEXT NOT NULL,
  bundle_slug TEXT UNIQUE NOT NULL,
  bundle_version TEXT NOT NULL,
  savings_percent NUMERIC(5,2),
  notes TEXT
);

CREATE TABLE bundle_items (
  id BIGSERIAL PRIMARY KEY,
  bundle_id TEXT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1,
  role TEXT NOT NULL,
  notes TEXT,
  UNIQUE(bundle_id, product_id)
);

CREATE TABLE compatibility_targets (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target TEXT NOT NULL,
  UNIQUE(product_id, target)
);

CREATE TABLE dependency_links (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  dependency_name TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(product_id, dependency_name)
);

CREATE TABLE execution_capabilities (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  execution_mode execution_mode NOT NULL,
  market_type market_type NOT NULL,
  live_enabled_default BOOLEAN NOT NULL DEFAULT FALSE,
  paper_supported BOOLEAN NOT NULL DEFAULT FALSE,
  connector_types TEXT NOT NULL,
  UNIQUE(product_id)
);

CREATE TABLE trading_profiles (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  market_type market_type NOT NULL,
  risk_level risk_level NOT NULL,
  trade_action_schema_ref TEXT,
  market_data_schema_ref TEXT,
  UNIQUE(product_id)
);

CREATE TABLE risk_policies (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  max_position_size TEXT NOT NULL,
  max_exposure_pct NUMERIC(5,2) NOT NULL,
  stop_rules TEXT NOT NULL,
  circuit_breaker_rules TEXT NOT NULL,
  kill_switch_required BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(product_id)
);

CREATE TABLE connector_compatibility (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  connector_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  min_api_version TEXT,
  status TEXT NOT NULL DEFAULT 'supported',
  UNIQUE(product_id, connector_type, provider_name)
);

CREATE TABLE disclosure_versions (
  version TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  applies_to TEXT NOT NULL,
  effective_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE disclosure_acceptances (
  id BIGSERIAL PRIMARY KEY,
  disclosure_version TEXT NOT NULL REFERENCES disclosure_versions(version),
  product_id TEXT REFERENCES products(id),
  context TEXT NOT NULL,
  session_id TEXT,
  order_id TEXT,
  user_id TEXT,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  external_checkout_id TEXT UNIQUE,
  user_id TEXT,
  email TEXT,
  subtotal_usd NUMERIC(10,2) NOT NULL,
  discount_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_usd NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price_usd NUMERIC(10,2) NOT NULL,
  line_total_usd NUMERIC(10,2) NOT NULL
);

CREATE TABLE entitlements (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  user_id TEXT,
  session_id TEXT,
  email TEXT,
  license_seats TEXT,
  updates_feed_active BOOLEAN NOT NULL DEFAULT FALSE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE download_tokens (
  id BIGSERIAL PRIMARY KEY,
  entitlement_id BIGINT NOT NULL REFERENCES entitlements(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  token TEXT UNIQUE NOT NULL,
  signed_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_captures (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  product_id TEXT REFERENCES products(id),
  funnel_variant TEXT NOT NULL,
  role_tag TEXT,
  domain_tag TEXT,
  stack_tag TEXT,
  market_interest_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE email_sequences (
  id BIGSERIAL PRIMARY KEY,
  sequence_name TEXT NOT NULL,
  funnel_variant TEXT NOT NULL,
  day_offset INT NOT NULL,
  topic TEXT NOT NULL,
  audience_filter TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE upsell_rules (
  id TEXT PRIMARY KEY,
  trigger_event TEXT NOT NULL,
  trigger_filter TEXT NOT NULL,
  recommendation_type TEXT NOT NULL,
  recommendation_target TEXT NOT NULL,
  priority INT NOT NULL,
  suppression_condition TEXT,
  window_hours INT,
  notes TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE funnel_events (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT,
  user_id TEXT,
  event_name TEXT NOT NULL,
  funnel_variant TEXT NOT NULL,
  product_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE strategy_templates (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  schema_ref TEXT,
  notes TEXT
);

CREATE TABLE market_events_taxonomy (
  id BIGSERIAL PRIMARY KEY,
  event_family TEXT NOT NULL,
  event_type TEXT NOT NULL,
  source TEXT,
  volatility_profile TEXT,
  notes TEXT,
  UNIQUE(event_family, event_type)
);
