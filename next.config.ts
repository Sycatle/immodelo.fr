import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const ContentSecurityPolicy = isDev
  ? `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.apple-mapkit.com;
    style-src  'self' 'unsafe-inline';
    img-src    'self' data: https:;
    connect-src 'self' https://api-adresse.data.gouv.fr https://*.maptiles.apple.com;
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.apple-mapkit.com;
    style-src  'self' 'unsafe-inline';
    img-src    'self' data: https:;
    connect-src 'self' https://api-adresse.data.gouv.fr https://*.maptiles.apple.com;
  `;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, " "),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
