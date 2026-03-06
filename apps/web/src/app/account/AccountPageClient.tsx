"use client";

import { ClerkProvider, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import AccountDashboard from "./AccountDashboard";

function AccountContent() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--ink-muted)", fontSize: "0.9rem" }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div className="content-block" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔐</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Sign in</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-muted)", marginBottom: "1.75rem" }}>
            Connect with Google or GitHub to save products to your library and retrieve past purchases.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <SignInButton mode="modal">
              <button style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.8rem 1.25rem",
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--ink)",
                fontFamily: "inherit",
              }}>
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.8rem 1.25rem",
                background: "var(--green)",
                border: "1px solid transparent",
                borderRadius: "var(--r)",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                color: "white",
                fontFamily: "inherit",
              }}>
                Create account
              </button>
            </SignUpButton>
          </div>

          <p style={{ marginTop: "1.25rem", fontSize: "0.78rem", color: "var(--ink-subtle)" }}>
            Supports Google &amp; GitHub — no password needed.
          </p>
        </div>

        <div className="content-block" style={{ marginTop: "1rem", background: "var(--bg-alt)" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
            <strong style={{ color: "var(--ink)" }}>No account?</strong> You can still browse free downloads without signing in.
          </p>
        </div>
      </div>
    );
  }

  return <AccountDashboard email={user.emailAddresses[0]?.emailAddress ?? ""} />;
}

export default function AccountPageClient() {
  return (
    <ClerkProvider>
      <AccountContent />
    </ClerkProvider>
  );
}
