/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development',
    },
    env: {
        UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
        UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    },

    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com',
            },
            {
                hostname: 'www.facebook.com',
            },
            {
                hostname: 'via.placeholder.com',
            },
            {
                hostname: 'github.com',
            },
            {
                hostname: 'i.pravatar.cc',
            },
            {
                hostname: 'lh3.googleusercontent.com',
            },
            {
                hostname: 'avatars.githubusercontent.com',
            },
            {
                hostname: 'images.unsplash.com',
            },
            {
                hostname: 'cloudinary.com',
            },
            {
                hostname: 'i.pinimg.com',
            },
            {
                hostname: 'placehold.co',
            },
            {
                hostname: 'images.pexels.com',
            },
            {
                hostname: 'flagcdn.com',
            },
        ],
    },
};

export default nextConfig;
