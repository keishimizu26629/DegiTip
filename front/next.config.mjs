/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['files.slack.com'],
  },
  env: {
    API_COMPILE_SECRET_KEY: process.env.API_COMPILE_SECRET_KEY,
  },
}

export default nextConfig;
