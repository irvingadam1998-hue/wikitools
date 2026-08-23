import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.50.199'],
   typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
