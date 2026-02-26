// @ts-nocheck
import {
  getRecentRuns,
  getRecentReports,
} from "@agent-artifacts/agent-runner";
import Link from "next/link";

type Props = { searchParams: Promise<{ key?: string }> };

function isAdmin(key: string | undefined): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return true;
  return !!key && key === adminKey;
}

export default async function AdminAgentsPage({ searchParams }: Props) {
  const { key } = await searchParams;

  if (!isAdmin(key)) {
    return (
      <main
        style={{
          maxWidth: 480,
          margin: "4rem auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1>Unauthorized</h1>
        <p style={{ color: "var(--muted)" }}>
          Provide a valid key: <code>/admin/agents?key=YOUR_ADMIN_KEY</code>
        </p>
      </main>
    );
  }

  const [runs, reports] = await Promise.all([
    getRecentRuns(14),
    getRecentReports(undefined, 30),
  ]);

  const execReports = reports.filter(
    (r: Record<string, string>) => r.agent_id === "executive" && r.report_type === "executive_weekly"
  );

  return (
    <main
      className="container"
      style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}
    >
      <h1>Agent Swarm Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Recent runs and Executive reports for the Agent Artifacts store.
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Recent Agent Runs</h2>
        {runs.length === 0 ? (
          <p>No runs yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "0.5rem" }}>Agent</th>
                <th style={{ padding: "0.5rem" }}>Started</th>
                <th style={{ padding: "0.5rem" }}>Status</th>
                <th style={{ padding: "0.5rem" }}>Summary</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r: Record<string, string>) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.5rem" }}>
                    <code>{r.agent_id}</code>
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {r.started_at
                      ? new Date(r.started_at).toLocaleString()
                      : "-"}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.15rem 0.4rem",
                        borderRadius: 4,
                        fontSize: "0.8rem",
                        background:
                          r.status === "success"
                            ? "var(--success-bg, #e8f5e9)"
                            : r.status === "failed"
                            ? "var(--error-bg, #ffebee)"
                            : "var(--muted-bg, #f5f5f5)",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem", maxWidth: 320 }}>
                    {r.summary ? String(r.summary).slice(0, 80) : "-"}
                    {r.error && (
                      <span style={{ color: "var(--error)", fontSize: "0.85rem" }}>
                        {" "}
                        ({r.error.slice(0, 40)})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Executive Reports</h2>
        {execReports.length === 0 ? (
          <p>No Executive reports yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {execReports.map((r: Record<string, string>) => (
              <li
                key={r.id}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Report #{r.id}</strong> —{" "}
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "-"}
                </div>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "0.85rem",
                    maxHeight: 200,
                    overflow: "auto",
                    margin: 0,
                  }}
                >
                  {String(r.content).slice(0, 1500)}
                  {String(r.content).length > 1500 ? "\n\n..." : ""}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "var(--muted)" }}>
        <Link href="/">← Back to site</Link>
      </p>
    </main>
  );
}
