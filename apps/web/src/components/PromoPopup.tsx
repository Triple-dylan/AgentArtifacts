"use client";

import { useEffect, useState, useCallback } from "react";

const SINGLE_CODE = "FIRST50";
const BUNDLE_CODE = "BUNDLE25";
const SESSION_KEY = "promo_popup_shown";
const TRIGGER_DELAY_MS = 30_000;
const COUNTDOWN_SECONDS = 15 * 60; // 15 minutes

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [isBundle, setIsBundle] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
  }, []);

  // Detect bundle context
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    setIsBundle(path.startsWith("/bundles") || search.includes("type=bundle"));
  }, []);

  // Trigger after 30s, once per session
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {}

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, TRIGGER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  // 15-minute countdown
  useEffect(() => {
    if (!visible) return;
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          dismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [visible, dismiss]);

  const code = isBundle ? BUNDLE_CODE : SINGLE_CODE;
  const discount = isBundle ? "25% off your first bundle" : "50% off your first purchase";
  const ctaHref = isBundle
    ? `/catalog?type=bundle&prefilled_promo_code=${BUNDLE_CODE}`
    : `/catalog?prefilled_promo_code=${SINGLE_CODE}`;
  const urgency = countdown < 60;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Limited time offer"
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2.25rem 2rem 2rem",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.10)",
            position: "relative",
            pointerEvents: "auto",
            animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Close */}
          <button
            onClick={dismiss}
            aria-label="Close offer"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: "1.25rem",
              lineHeight: 1,
              padding: "0.25rem",
              borderRadius: "6px",
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>

          {/* Eyebrow */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.7rem",
            borderRadius: "999px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            ✦ Welcome offer
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0d1117",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}>
            Get {discount}
          </h2>

          <p style={{
            fontSize: "0.875rem",
            color: "#4b5563",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}>
            {isBundle
              ? "Save on a bundle pack — the best value in the catalog."
              : "Try any single product at half price. No strings attached."}
            {" "}Use the code below at checkout.
          </p>

          {/* Code block */}
          <button
            onClick={handleCopy}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f8f7f5",
              border: "1.5px dashed #c8c6bd",
              borderRadius: "10px",
              padding: "0.85rem 1rem",
              cursor: "pointer",
              marginBottom: "1rem",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
          >
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.2rem", color: "#0d1117", letterSpacing: "0.08em" }}>
              {code}
            </span>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: copied ? "#059669" : "#4b5563",
              background: copied ? "#ecfdf5" : "#e5e4dd",
              padding: "0.2rem 0.6rem",
              borderRadius: "6px",
              transition: "all 0.2s",
            }}>
              {copied ? "✓ Copied!" : "Copy code"}
            </span>
          </button>

          {/* CTA */}
          <a
            href={ctaHref}
            onClick={dismiss}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              background: "#059669",
              color: "white",
              borderRadius: "10px",
              padding: "0.8rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              marginBottom: "1rem",
              boxShadow: "0 4px 14px rgba(5,150,105,0.28)",
              transition: "background 0.15s",
            }}
          >
            {isBundle ? "Browse bundle packs →" : "Shop the catalog →"}
          </a>

          {/* Timer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.78rem",
            color: urgency ? "#dc2626" : "#6b7280",
            fontWeight: 600,
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: `2px solid ${urgency ? "#dc2626" : "#9ca3af"}`,
              fontSize: "0.6rem",
            }}>⏱</span>
            Offer expires in{" "}
            <span style={{
              fontFamily: "monospace",
              fontWeight: 800,
              color: urgency ? "#dc2626" : "#0d1117",
            }}>
              {formatTime(countdown)}
            </span>
            {" "}— this session only
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </>
  );
}
