
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Use the existing public directory from Vite
  publicRuntimeConfig: {
    basePath: '',
  },
  // Configure to work with the existing Vite setup
  webpack: (config, { isServer }) => {
    // Needed for compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
  // Enable turbopack for faster development
  experimental: {
    turbo: {
      loaders: {
        // Define loaders for different file types
        '.js': 'jsx',
        '.ts': 'tsx',
      },
    },
  },
}

module.exports = nextConfig;
