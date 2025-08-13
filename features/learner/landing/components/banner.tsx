"use client";

import { Button } from "@/components/ui/button";
import { redirects } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BannerImage from "@/assets/images/banner.jpg";

export function Banner({ userId }: { userId?: string }) {
	const router = useRouter();

	return (
		<div className="relative flex min-h-[50vh] w-full flex-col items-center justify-center sm:min-h-[70vh] md:h-[calc(100vh-4rem)]">
			<Image
				src={BannerImage}
				alt="Landing Page Banner"
				className="absolute inset-0 hidden h-full w-full object-cover md:block"
				priority
			/>
			<div className="absolute inset-0 z-10 hidden bg-black/25 md:block"></div>
			<div className="absolute inset-0 z-10 hidden bg-gradient-to-r from-blue-600/30 to-transparent md:block"></div>
			<div className="flex w-full flex-col items-center">
				<div className="z-10 w-full max-w-6xl px-4">
					<div className="relative text-center md:max-w-lg md:text-left lg:max-w-xl xl:max-w-2xl">
						<h1 className="text-3xl leading-tight font-bold text-black sm:text-4xl md:text-5xl md:text-white lg:text-6xl">
							Unlock Your Potential with Industry-Leading Courses!
						</h1>
						<p className="mt-4 text-lg leading-relaxed text-black sm:mt-6 sm:text-xl md:max-w-[450px] md:text-white lg:max-w-[500px]">
							"Join thousands of learners gaining real-world skills and
							advancing their careers. Our expert-led courses are designed to
							empower you to succeed."
						</p>
						<div className="mt-6 flex justify-center sm:mt-8 md:justify-start">
							<CTAButton userId={userId} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function CTAButton({ userId }: { userId?: string }) {
	const router = useRouter();

	if (userId) {
		return (
			<Button
				size="lg"
				className="h-12 w-36 gap-2 rounded-sm text-sm font-semibold sm:w-48 sm:text-base"
				onClick={() => router.push(redirects.toDashboard)}
			>
				Go to Dashboard
			</Button>
		);
	}

	return (
		<Button
			size="lg"
			className="h-12 w-36 gap-2 rounded-sm text-sm font-semibold sm:w-40 sm:text-base"
			onClick={() => router.push(redirects.toSignup)}
		>
			Get Started
		</Button>
	);
}
