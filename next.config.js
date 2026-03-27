/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [25, 50, 75, 80, 90, 100],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};
module.exports = nextConfig;
