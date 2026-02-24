-- Runtime access pattern indexes and compatibility updates.

ALTER TABLE entitlements
  ADD COLUMN IF NOT EXISTS session_id TEXT;

CREATE INDEX IF NOT EXISTS idx_entitlements_product_status ON entitlements (product_id, status);
CREATE INDEX IF NOT EXISTS idx_entitlements_order_id ON entitlements (order_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON entitlements (user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements (email);
CREATE INDEX IF NOT EXISTS idx_entitlements_session_id ON entitlements (session_id);

CREATE INDEX IF NOT EXISTS idx_disclosure_acceptances_lookup
  ON disclosure_acceptances (product_id, disclosure_version, order_id, user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_lead_captures_email_source ON lead_captures (email, source);
