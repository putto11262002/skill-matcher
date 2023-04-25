/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME,
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
