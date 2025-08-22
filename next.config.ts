import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // change this after test is finished
  },
  images: {
    domains: ["res.cloudinary.com"], // allow Cloudinary
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
