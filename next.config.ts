import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
