/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [25, 50, 75, 80, 90, 100],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "bjpyavatmal-uploads-2026.s3.ap-south-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "*.amazonaws.com",
            }
        ],
    },
};
module.exports = nextConfig;
