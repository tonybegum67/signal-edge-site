import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Builds a small self-contained server for the Cloud Run container.
  output: "standalone",
  poweredByHeader: false,

  // One address for the site: www.signal-edge.ai sends visitors on to signal-edge.ai.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.signal-edge.ai" }],
        destination: "https://signal-edge.ai/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
