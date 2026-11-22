import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // ~/Code har en egen pnpm-workspace/lockfil; lås roten till projektet så att
    // Turbopack inte bevakar och söker igenom hela ~/Code.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
