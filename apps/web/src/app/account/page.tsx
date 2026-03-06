import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import AccountDashboard from "./AccountDashboard";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your Agent Artifacts library, saved products, and purchase history.",
};

export default async function AccountPage() {
  const user = await currentUser();

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Account</div>
          <h1 style={{ marginBottom: "0.4rem" }}>
            {user ? `Hi, ${user.firstName ?? "there"}` : "My account"}
          </h1>
          <p style={{ color: "var(--ink-muted)" }}>
            {user
              ? "Your saved library, purchased products, and download history."
              : "Sign in to access your library and purchase history."}
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "760px" }}>
          {user ? (
            <AccountDashboard email={user.emailAddresses[0]?.emailAddress ?? ""} />
          ) : (
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
                      gap: "0.65rem",
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
                      gap: "0.65rem",
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
                  <strong style={{ color: "var(--ink)" }}>No account?</strong> You can still browse free downloads without signing in. Purchases are retrieved by email after sign-in.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
