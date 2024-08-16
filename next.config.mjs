/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "tse3.explicit.bing.net",
      },{
        protocol: "https",
        hostname: "i.imgur.com",
      },{
        protocol: "https",
        hostname: "imgur.com",
      },
      {protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ],
  },
};

export default nextConfig;
