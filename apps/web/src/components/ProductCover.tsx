type CoverProps = {
  category: string;
  name: string;
  height?: number;
  isBundle?: boolean;
};

const COVER_CONFIG: Record<string, {
  gradient: string;
  accent: string;
  label: string;
  pattern: "lines" | "dots" | "grid" | "hex" | "circuit";
}> = {
  prompt: {
    gradient: "linear-gradient(135deg, #0d3d2e 0%, #1a6b50 60%, #0f4d38 100%)",
    accent: "rgba(52,211,153,0.18)",
    label: "Prompt Pack",
    pattern: "lines",
  },
  skill: {
    gradient: "linear-gradient(135deg, #1e0a4e 0%, #4c1d95 60%, #2d0f70 100%)",
    accent: "rgba(167,139,250,0.18)",
    label: "Skill Module",
    pattern: "hex",
  },
  agent: {
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 60%, #0d2040 100%)",
    accent: "rgba(96,165,250,0.18)",
    label: "Agent",
    pattern: "circuit",
  },
  utility: {
    gradient: "linear-gradient(135deg, #1c0f00 0%, #78350f 60%, #451a03 100%)",
    accent: "rgba(251,191,36,0.18)",
    label: "Utility",
    pattern: "grid",
  },
  doc: {
    gradient: "linear-gradient(135deg, #111827 0%, #374151 60%, #1f2937 100%)",
    accent: "rgba(209,213,219,0.14)",
    label: "Document",
    pattern: "dots",
  },
};

const BUNDLE_CONFIG = {
  gradient: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
  accent: "rgba(99,102,241,0.22)",
  label: "Bundle",
  pattern: "grid" as const,
};

// SVG icons — clean geometric, no emojis
function CategoryIcon({ category, isBundle, color }: { category: string; isBundle: boolean; color: string }) {
  const s = { width: 40, height: 40, fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (isBundle) {
    return (
      <svg viewBox="0 0 40 40" {...s}>
        <rect x="6" y="12" width="28" height="20" rx="3" />
        <path d="M6 18h28" />
        <path d="M14 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
        <path d="M16 24h8" />
      </svg>
    );
  }
  if (category === "prompt") {
    return (
      <svg viewBox="0 0 40 40" {...s}>
        <path d="M8 10h24a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H22l-6 5v-5H8a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" />
        <path d="M13 17h14M13 22h8" />
      </svg>
    );
  }
  if (category === "skill") {
    return (
      <svg viewBox="0 0 40 40" {...s}>
        <circle cx="20" cy="20" r="4" />
        <path d="M20 6v4M20 30v4M6 20h4M30 20h4" />
        <path d="M10.1 10.1l2.8 2.8M27.1 27.1l2.8 2.8M10.1 29.9l2.8-2.8M27.1 12.9l2.8-2.8" />
      </svg>
    );
  }
  if (category === "agent") {
    return (
      <svg viewBox="0 0 40 40" {...s}>
        <rect x="10" y="12" width="20" height="18" rx="4" />
        <circle cx="16" cy="20" r="2" />
        <circle cx="24" cy="20" r="2" />
        <path d="M16 28v3M24 28v3M14 12V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
        <path d="M4 22h6M30 22h6" />
      </svg>
    );
  }
  if (category === "utility") {
    return (
      <svg viewBox="0 0 40 40" {...s}>
        <path d="M28 8c0 0-4 2-4 8s4 8 4 8l-2 2-8-8c-2 2-4 4-4 8H8l4-4c-2-4 0-8 4-10l2 2 4-4 6-2z" />
        <path d="M14 26l-6 6" />
      </svg>
    );
  }
  if (category === "doc") {
    return (
      <svg viewBox="0 0 40 40" {...s}>
        <path d="M10 6h14l8 8v20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M24 6v8h8" />
        <path d="M14 20h12M14 26h8" />
      </svg>
    );
  }
  // fallback
  return (
    <svg viewBox="0 0 40 40" {...s}>
      <rect x="8" y="8" width="24" height="24" rx="4" />
      <path d="M14 20h12M20 14v12" />
    </svg>
  );
}

function PatternSVG({ type, accent }: { type: string; accent: string }) {
  if (type === "dots") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`dots-${accent.slice(0,4)}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill={accent} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${accent.slice(0,4)})`} />
      </svg>
    );
  }
  if (type === "lines") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`lines-${accent.slice(0,4)}`} x="0" y="0" width="40" height="12" patternUnits="userSpaceOnUse">
            <rect x="0" y="5" width="28" height="2" rx="1" fill={accent} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#lines-${accent.slice(0,4)})`} />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${accent.slice(0,4)}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={accent} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${accent.slice(0,4)})`} />
      </svg>
    );
  }
  if (type === "hex") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`hex-${accent.slice(0,4)}`} x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
            <polygon points="15,2 26,8 26,18 15,24 4,18 4,8" fill="none" stroke={accent} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hex-${accent.slice(0,4)})`} />
      </svg>
    );
  }
  if (type === "circuit") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`circuit-${accent.slice(0,4)}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 L 12 20 M 28 20 L 40 20 M 20 0 L 20 12 M 20 28 L 20 40" stroke={accent} strokeWidth="1.5" fill="none" />
            <circle cx="20" cy="20" r="3.5" fill="none" stroke={accent} strokeWidth="1.5" />
            <circle cx="20" cy="20" r="1" fill={accent} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#circuit-${accent.slice(0,4)})`} />
      </svg>
    );
  }
  return null;
}

export default function ProductCover({ category, name, height = 160, isBundle = false }: CoverProps) {
  const cfg = isBundle ? BUNDLE_CONFIG : (COVER_CONFIG[category] ?? COVER_CONFIG.doc);
  // Extract a bright version of the accent for the icon stroke
  const iconColor = category === "prompt" ? "rgba(52,211,153,0.85)"
    : category === "skill" ? "rgba(167,139,250,0.85)"
    : category === "agent" ? "rgba(96,165,250,0.85)"
    : category === "utility" ? "rgba(251,191,36,0.85)"
    : isBundle ? "rgba(129,140,248,0.85)"
    : "rgba(209,213,219,0.75)";

  return (
    <div
      style={{
        height: `${height}px`,
        background: cfg.gradient,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        flexShrink: 0,
      }}
    >
      <PatternSVG type={cfg.pattern} accent={cfg.accent} />

      {/* Glow orb */}
      <div style={{
        position: "absolute",
        top: "-30%",
        right: "-10%",
        width: "60%",
        height: "160%",
        background: cfg.accent,
        borderRadius: "50%",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      {/* Icon */}
      <div style={{
        position: "relative",
        width: 44,
        height: 44,
        filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.4))",
      }}>
        <CategoryIcon category={category} isBundle={isBundle} color={iconColor} />
      </div>

      {/* Name */}
      <div style={{
        position: "relative",
        color: "rgba(255,255,255,0.88)",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "0 1rem",
        maxWidth: "90%",
        lineHeight: 1.3,
        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
      }}>
        {name}
      </div>
    </div>
  );
}
