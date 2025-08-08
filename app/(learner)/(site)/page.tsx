import { LandingBanner } from "@/features/learner/landing/components/landing-banner";

export default function LandingPage() {
	return (
		<div className="flex flex-col">
			<LandingBanner />
			<div className="container mx-auto w-full px-4 py-8">
				<h2 className="mt-8 text-center text-3xl font-bold">Our Solutions</h2>
				<p className="mt-4 text-center">
					Create your account quickly with just your email or social media
					login, then explore a wide range
				</p>
			</div>
		</div>
	);
}
