type CoverProps = {
  category: string;
  name: string;
  height?: number;
  isBundle?: boolean;
};

const COVER_CONFIG: Record<string, {
  gradient: string;
  accent: string;
  icon: string;
  label: string;
  pattern: "lines" | "dots" | "grid" | "hex" | "circuit";
}> = {
  prompt: {
    gradient: "linear-gradient(135deg, #0d3d2e 0%, #1a6b50 60%, #0f4d38 100%)",
    accent: "rgba(52,211,153,0.15)",
    icon: "💬",
    label: "Prompt Pack",
    pattern: "lines",
  },
  skill: {
    gradient: "linear-gradient(135deg, #1e0a4e 0%, #4c1d95 60%, #2d0f70 100%)",
    accent: "rgba(167,139,250,0.15)",
    icon: "⚙️",
    label: "Skill Module",
    pattern: "hex",
  },
  agent: {
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 60%, #0d2040 100%)",
    accent: "rgba(96,165,250,0.15)",
    icon: "🤖",
    label: "Agent",
    pattern: "circuit",
  },
  utility: {
    gradient: "linear-gradient(135deg, #1c0f00 0%, #78350f 60%, #451a03 100%)",
    accent: "rgba(251,191,36,0.15)",
    icon: "🔧",
    label: "Utility",
    pattern: "grid",
  },
  doc: {
    gradient: "linear-gradient(135deg, #111827 0%, #374151 60%, #1f2937 100%)",
    accent: "rgba(209,213,219,0.12)",
    icon: "📄",
    label: "Document",
    pattern: "dots",
  },
};

const BUNDLE_CONFIG = {
  gradient: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
  accent: "rgba(99,102,241,0.2)",
  icon: "📦",
  label: "Bundle",
  pattern: "grid" as const,
};

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
        gap: "0.5rem",
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
        fontSize: "2.2rem",
        lineHeight: 1,
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
      }}>
        {cfg.icon}
      </div>

      {/* Name */}
      <div style={{
        position: "relative",
        color: "rgba(255,255,255,0.9)",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "0 1rem",
        maxWidth: "90%",
        lineHeight: 1.3,
        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
      }}>
        {name}
      </div>
    </div>
  );
}
