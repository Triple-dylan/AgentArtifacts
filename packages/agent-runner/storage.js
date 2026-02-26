/**
 * Agent runs and reports storage.
 * Writes to agent_runs and agent_reports tables.
 */

import pg from "pg";

let pool = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/**
 * @param {string} agentId - e.g. 'marketing', 'seo-blog', 'product-review', 'executive'
 * @param {object} opts
 * @param {string} opts.summary - Short summary of what the agent did
 * @param {object} [opts.outputs] - Structured outputs (tweets_posted, etc.)
 * @param {string} [opts.status] - 'success' | 'partial' | 'failed'
 * @param {string} [opts.error] - Error message if failed
 * @returns {Promise<{id: number, agent_id: string} | null>}
 */
export async function recordRun(agentId, opts = {}) {
  const db = getPool();
  if (!db) {
    return { id: null, agent_id: agentId };
  }

  const { summary = "", outputs = null, status = "success", error = null } = opts;
  const outputsJson = outputs ? JSON.stringify(outputs) : null;

  const { rows } = await db.query(
    `INSERT INTO agent_runs (agent_id, completed_at, status, summary, outputs, error)
     VALUES ($1, NOW(), $2, $3, $4::jsonb, $5)
     RETURNING id, agent_id`,
    [agentId, status, summary, outputsJson, error]
  );
  return rows[0];
}

/**
 * Start a run (for long-running agents that want to track start/end separately).
 * @returns {Promise<{id: number}> | null>}
 */
export async function startRun(agentId) {
  const db = getPool();
  if (!db) return null;

  const { rows } = await db.query(
    `INSERT INTO agent_runs (agent_id, status) VALUES ($1, 'running') RETURNING id`,
    [agentId]
  );
  return rows[0];
}

/**
 * Complete a run started with startRun.
 */
export async function completeRun(runId, opts = {}) {
  const db = getPool();
  if (!db) return;

  const { summary = "", outputs = null, status = "success", error = null } = opts;
  const outputsJson = outputs ? JSON.stringify(outputs) : null;

  await db.query(
    `UPDATE agent_runs SET completed_at = NOW(), status = $2, summary = $3, outputs = $4::jsonb, error = $5 WHERE id = $1`,
    [runId, status, summary, outputsJson, error]
  );
}

/**
 * Save a report (markdown content).
 * @param {string} agentId
 * @param {string} reportType - e.g. 'executive_weekly', 'blog_post', 'newsletter'
 * @param {string} content - Markdown or HTML
 */
export async function saveReport(agentId, reportType, content) {
  const db = getPool();
  if (!db) return null;

  const { rows } = await db.query(
    `INSERT INTO agent_reports (agent_id, report_type, content) VALUES ($1, $2, $3) RETURNING id`,
    [agentId, reportType, content]
  );
  return rows[0];
}

/**
 * Get recent runs for a time window (for Executive agent).
 * @param {number} [days=7]
 * @param {string[]} [agentIds] - Filter by agent IDs
 */
export async function getRecentRuns(days = 7, agentIds = null) {
  const db = getPool();
  if (!db) return [];

  let query = `SELECT id, agent_id, started_at, completed_at, status, summary, outputs, error 
               FROM agent_runs 
               WHERE started_at >= NOW() - INTERVAL '1 day' * $1`;
  const values = [days];

  if (agentIds && agentIds.length > 0) {
    query += ` AND agent_id = ANY($2)`;
    values.push(agentIds);
  }

  query += ` ORDER BY started_at DESC`;

  const { rows } = await db.query(query, values);
  return rows;
}

/**
 * Get recent reports.
 * @param {string} [agentId] - Optional filter
 * @param {number} [limit=20]
 */
export async function getRecentReports(agentId = null, limit = 20) {
  const db = getPool();
  if (!db) return [];

  let query = `SELECT id, agent_id, report_type, content, created_at FROM agent_reports WHERE 1=1`;
  const values = [];

  if (agentId) {
    values.push(agentId);
    query += ` AND agent_id = $${values.length}`;
  }

  values.push(limit);
  query += ` ORDER BY created_at DESC LIMIT $${values.length}`;

  const { rows } = await db.query(query, values);
  return rows;
}

/**
 * Save a blog post (for SEO/Blog agent).
 */
export async function saveBlogPost(post) {
  const db = getPool();
  if (!db) return null;

  const { slug, title, excerpt, content, meta_title, meta_description, primary_keyword } = post;
  const { rows } = await db.query(
    `INSERT INTO blog_posts (slug, title, excerpt, content, meta_title, meta_description, primary_keyword)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       excerpt = EXCLUDED.excerpt,
       content = EXCLUDED.content,
       meta_title = EXCLUDED.meta_title,
       meta_description = EXCLUDED.meta_description,
       primary_keyword = EXCLUDED.primary_keyword
     RETURNING id, slug, title, published_at`,
    [slug, title, excerpt ?? "", content, meta_title ?? title, meta_description ?? excerpt ?? "", primary_keyword ?? ""]
  );
  return rows[0];
}

/**
 * Get blog post by slug.
 */
export async function getBlogPost(slug) {
  const db = getPool();
  if (!db) return null;

  const { rows } = await db.query(
    `SELECT id, slug, title, excerpt, content, meta_title, meta_description, primary_keyword, published_at, created_at
     FROM blog_posts WHERE slug = $1`,
    [slug]
  );
  return rows[0] ?? null;
}

/**
 * List blog posts (newest first).
 */
export async function listBlogPosts(limit = 50) {
  const db = getPool();
  if (!db) return [];

  const { rows } = await db.query(
    `SELECT id, slug, title, excerpt, meta_title, meta_description, published_at
     FROM blog_posts ORDER BY published_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function closeStorage() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
