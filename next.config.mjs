/** @type {import('next').NextConfig} */

const hostnames = [
  "*.googleusercontent.com",
  "*.githubusercontent.com",
  "*.utfs.io",
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "githubusercontent.com",
        pathname: "**",
      },

      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pm-s3-images.s3.us-east-2.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
