/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["79.143.185.101"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
