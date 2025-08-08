"use client";

import { Button } from "@/components/ui/button";
import { redirects } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BannerImage from "../../../../assets/images/banner.jpg";

export function LandingBanner() {
	const router = useRouter();

	return (
		<div className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-start md:flex-row md:items-center">
			<Image
				src={BannerImage}
				alt="Landing Page Banner"
				className="absolute inset-0 hidden h-full w-full object-cover md:block"
				priority
			/>
			<div className="absolute inset-0 z-10 hidden bg-black/25 md:block"></div>
			<div className="absolute inset-0 z-10 hidden bg-gradient-to-r from-blue-600/30 to-transparent md:block"></div>
			<div className="flex w-full flex-col items-center">
				<div className="z-10 px-4 md:w-6xl">
					<div className="relative md:w-[400px]">
						<h1 className="text-2xl font-bold text-black md:text-4xl md:text-white">
							Unlock Your Potential with Industry-Leading Courses!
						</h1>
						<p className="mt-4 text-lg text-black md:w-[320px] md:text-white">
							"Join thousands of learners gaining real-world skills and
							advancing their careers. Our expert-led courses are designed to
							empower you to succeed."
						</p>
						<div className="mt-6 flex justify-start">
							<Button
								size="lg"
								className="flex h-12 w-32 items-center gap-2 rounded-sm font-semibold"
								onClick={() => router.push(redirects.toSignup)}
							>
								Get Started
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
