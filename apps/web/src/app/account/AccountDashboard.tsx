"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type SavedItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_label: string;
  type: "product" | "bundle" | "free";
  saved_at: number;
};

type PurchaseItem = {
  type: "product" | "bundle";
  id: string;
  name: string;
  slug: string;
  download_url: string;
};

type Purchase = {
  session_id: string;
  purchased_at: number;
  items: PurchaseItem[];
};

const STORAGE_KEY = "aa_library";

function useLibrary() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { items, remove, clear };
}

function LibraryTab() {
  const { items, remove, clear } = useLibrary();
  const [copied, setCopied] = useState(false);

  const exportManifest = () => {
    if (items.length === 0) return;
    const lines = [
      "# Agent Artifacts — My Library",
      `# Generated: ${new Date().toISOString()}`,
      "",
      ...items.map(
        (item) =>
          `- [${item.name}](https://agentartifacts.io/${item.type === "bundle" ? "bundles" : item.type === "free" ? "sample" : "products"}/${item.slug}) — ${item.category} — ${item.price_label}`
      ),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "3rem 0" }}>
        <div className="empty-state-icon">📚</div>
        <h3>Your library is empty</h3>
        <p style={{ marginBottom: "1rem" }}>
          Save products and free assets to build your agent library. Hit the save button on any product page.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
          <Link href="/free-library" className="btn btn-outline">Free library</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={exportManifest} className="btn btn-outline btn-sm">
            {copied ? "✅ Copied!" : "Copy as manifest"}
          </button>
          <button onClick={clear} className="btn btn-outline btn-sm" style={{ color: "var(--red)" }}>
            Clear all
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {items.map((item) => {
          const href =
            item.type === "bundle"
              ? `/bundles/${item.slug}`
              : item.type === "free"
              ? `/sample/${item.slug}`
              : `/products/${item.slug}`;
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
                  <span className={`badge badge-${item.category}`} style={{ fontSize: "0.7rem" }}>{item.category}</span>
                  {item.type === "free" && <span className="badge badge-plain" style={{ fontSize: "0.7rem" }}>Free</span>}
                  {item.type === "bundle" && <span className="badge badge-bundle" style={{ fontSize: "0.7rem" }}>Bundle</span>}
                </div>
                <Link href={href} style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</Link>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{item.price_label}</span>
                <button
                  onClick={() => remove(item.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-subtle)", fontSize: "1rem", padding: "0.25rem" }}
                  title="Remove from library"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "1.25rem", background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--ink-muted)" }}>
        <strong style={{ color: "var(--ink)" }}>Share with your agents</strong> — Hit &ldquo;Copy as manifest&rdquo; to get a Markdown list of your library. Paste it into a CLAUDE.md, system prompt, or any AI tool to give your agent context about your artifact stack.
      </div>
    </div>
  );
}

function PurchasesTab() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[] | null>(null);
  const [error, setError] = useState("");

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPurchases(null);

    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setPurchases(data.purchases);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", marginBottom: "1.25rem" }}>
        Enter the email address you used at checkout to retrieve your purchases and download links.
      </p>

      <form onSubmit={lookup} style={{ display: "flex", gap: "0.5rem", maxWidth: "480px", marginBottom: "1.5rem" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{
            flex: 1,
            padding: "0.6rem 0.85rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)",
            fontSize: "0.9rem",
            background: "white",
            color: "var(--ink)",
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Looking up…" : "Look up"}
        </button>
      </form>

      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "var(--red-light)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "var(--r-sm)", fontSize: "0.875rem", color: "var(--red)", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {purchases !== null && (
        purchases.length === 0 ? (
          <div className="empty-state" style={{ padding: "2rem 0" }}>
            <div className="empty-state-icon">🔍</div>
            <h3>No purchases found</h3>
            <p>No completed orders found for that email. If you think this is wrong, contact <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)" }}>support@agentartifacts.io</a> with your Stripe receipt.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {purchases.map((purchase) => (
              <div key={purchase.session_id} className="content-block">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>
                    {new Date(purchase.purchased_at * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {purchase.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <span className={`badge badge-${item.type === "bundle" ? "bundle" : "plain"}`} style={{ fontSize: "0.7rem", marginRight: "0.4rem" }}>{item.type}</span>
                        <Link href={item.type === "bundle" ? `/bundles/${item.slug}` : `/products/${item.slug}`} style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</Link>
                      </div>
                      <a href={item.download_url} download={item.type !== "bundle" ? `${item.slug}.md` : undefined} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                        ↓ Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default function AccountDashboard() {
  const [tab, setTab] = useState<"library" | "purchases">("library");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1.1rem",
    borderRadius: "var(--r-pill)",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
    border: "none",
    background: active ? "var(--ink)" : "transparent",
    color: active ? "white" : "var(--ink-muted)",
    transition: "all 0.15s",
  });

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "inline-flex", gap: "0.25rem", background: "var(--bg-alt)", borderRadius: "var(--r-pill)", padding: "0.25rem", marginBottom: "1.5rem", border: "1px solid var(--border)" }}>
        <button style={tabStyle(tab === "library")} onClick={() => setTab("library")}>📚 My Library</button>
        <button style={tabStyle(tab === "purchases")} onClick={() => setTab("purchases")}>🛒 Purchases</button>
      </div>

      {tab === "library" && <LibraryTab />}
      {tab === "purchases" && <PurchasesTab />}

      {/* Support */}
      <div className="content-block" style={{ marginTop: "2rem", background: "var(--green-light)", borderColor: "rgba(26,107,80,0.2)" }}>
        <h3 style={{ color: "var(--green)", marginBottom: "0.4rem" }}>Need help?</h3>
        <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem", color: "var(--ink-muted)" }}>
          Download issues, missing orders, or license questions — reach out to support.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="mailto:support@agentartifacts.io" className="btn btn-green-outline btn-sm">Email support</a>
          <Link href="/refund-policy" className="btn btn-outline btn-sm">Refund policy</Link>
          <Link href="/docs-guides" className="btn btn-outline btn-sm">Docs &amp; guides</Link>
        </div>
      </div>
    </div>
  );
}
