/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'community.cloudflare.steamstatic.com',
      'steamcommunity-a.akamaihd.net',
    ],
  },
};

export default nextConfig;
