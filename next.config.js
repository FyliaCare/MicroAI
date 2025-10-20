/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig