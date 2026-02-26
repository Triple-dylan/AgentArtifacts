import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "agentartifacts.io" },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-DNS-Prefetch-Control",    value: "on" },
      { key: "X-Frame-Options",           value: "DENY" },
      { key: "X-Content-Type-Options",    value: "nosniff" },
      { key: "X-XSS-Protection",          value: "1; mode=block" },
      { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: https://placehold.co https://agentartifacts.io",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' https://api.agentartifacts.io",
          "frame-src https://buy.stripe.com https://js.stripe.com",
          "frame-ancestors 'none'",
        ].join("; "),
      },
    ];
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
