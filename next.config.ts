import type { NextConfig } from "next";

const NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.githubusercontent.com",
                port: "",
                pathname: "**",
            },
        ],
    },
};

export default NextConfig;
