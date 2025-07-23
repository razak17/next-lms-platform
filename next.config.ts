import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.sh",
			},
		],
		unoptimized: true,
	},
	// Already doing linting and typechecking as separate tasks in CI
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
