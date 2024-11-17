import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "upload.wikimedia.org",
        protocol: "https",
      },
    ],
  },
};

export default bundleAnalyzer(nextConfig);
