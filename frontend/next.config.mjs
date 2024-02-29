/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      '192.168.1.59',
      'res.cloudinary.com',
      'community.cloudflare.steamstatic.com',
      'steamcommunity-a.akamaihd.net',
    ],
  },
};

export default nextConfig;
