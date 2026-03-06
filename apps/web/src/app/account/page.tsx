import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SignIn routing="hash" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
