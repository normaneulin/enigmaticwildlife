import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites() {
    return [
      {
        // Sveltia CMS is a static file in /public. Without this, /admin 404s and
        // only /admin/index.html works.
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
  headers() {
    return [
      {
        // The CMS is a private editing surface — keep it out of search results
        // even if someone links to it.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
