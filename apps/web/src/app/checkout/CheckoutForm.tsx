"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  checkoutUrl: string | null;
  priceLabel: string;
  needsDisclosure: boolean;
  disclosureText: string;
};

export default function CheckoutForm({ checkoutUrl, priceLabel, needsDisclosure, disclosureText }: Props) {
  const [disclosureChecked, setDisclosureChecked] = useState(false);
  const [licenseChecked, setLicenseChecked] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const disclosureValid = !needsDisclosure || disclosureChecked;
  const canProceed = disclosureValid && licenseChecked;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!canProceed) {
      e.preventDefault();
      setAttempted(true);
    }
  }

  return (
    <>
      {/* Disclosure */}
      {needsDisclosure && (
        <div className="disclosure-panel" style={{ marginBottom: "1.25rem", outline: attempted && !disclosureChecked ? "2px solid #c0392b" : "none", borderRadius: "10px" }}>
          <div className="disclosure-panel-header">⚠️ Risk disclosure required</div>
          <p style={{ marginBottom: "0.75rem" }}>{disclosureText || "This asset includes trading tooling. Research outputs are informational and require independent judgment. Not investment advice."}</p>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.82rem", color: "#7a3530" }}>
            <input
              type="checkbox"
              checked={disclosureChecked}
              onChange={(e) => setDisclosureChecked(e.target.checked)}
              style={{ marginTop: "0.2rem", flexShrink: 0 }}
            />
            <span>I acknowledge the disclosure and understand this is tooling and education, not investment advice.</span>
          </label>
          {attempted && !disclosureChecked && (
            <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "0.5rem", fontWeight: 600 }}>You must acknowledge the risk disclosure to continue.</p>
          )}
        </div>
      )}

      {/* License ack */}
      <div className="content-block" style={{ marginBottom: "1.25rem", outline: attempted && !licenseChecked ? "2px solid #c0392b" : "none", borderRadius: "10px" }}>
        <h2>License acknowledgement</h2>
        <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>By completing this purchase you agree to the license terms: commercial single-seat use, no redistribution, no resale of raw files.</p>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--ink-muted)" }}>
          <input
            type="checkbox"
            checked={licenseChecked}
            onChange={(e) => setLicenseChecked(e.target.checked)}
            style={{ marginTop: "0.2rem", flexShrink: 0 }}
          />
          <span>I have read and agree to the <Link href="/pricing#license" style={{ color: "var(--green)" }}>license terms</Link>.</span>
        </label>
        {attempted && !licenseChecked && (
          <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "0.5rem", fontWeight: 600 }}>You must agree to the license terms to continue.</p>
        )}
      </div>

      {/* CTA */}
      {checkoutUrl ? (
        <a
          href={canProceed ? checkoutUrl : "#"}
          onClick={handleClick}
          className="btn btn-buy btn-lg"
          style={{ justifyContent: "center", fontSize: "1rem", opacity: canProceed ? 1 : 0.6 }}
          target={canProceed ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          Continue to payment — {priceLabel} →
        </a>
      ) : (
        <div className="btn btn-buy btn-lg" style={{ justifyContent: "center", background: "var(--ink-subtle)", cursor: "default" }}>Payment link coming soon</div>
      )}

      <p style={{ fontSize: "0.78rem", color: "var(--ink-subtle)", textAlign: "center", marginTop: "0.85rem" }}>
        Secured by Stripe · No card data stored on our servers
      </p>
    </>
  );
}
