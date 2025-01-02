/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['drizzle-orm'],
  experimental: {
    serverComponentsExternalPackages: ['mysql2']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:events': 'events'
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        events: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false
      };
    }
    return config;
  }
};

module.exports = nextConfig; 