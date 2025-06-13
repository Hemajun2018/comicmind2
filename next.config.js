/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // 忽略 Supabase WebSocket 相关的可选依赖警告
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'utf-8-validate': false,
        'bufferutil': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
