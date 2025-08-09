"use client";

import GetStarted from "@/assets/images/get-started.jpg";
import MockupMonitor from "@/assets/images/mockup-monitor.png";
import MockupPhone from "@/assets/images/mockup-phone.png";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mainCourses } from "@/data/site";
import { TrackWithCourses } from "@/db/schema";
import { OverviewTrackCard } from "@/features/shared/components/overview-track-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { redirects } from "@/lib/constants";

export function MainContent({
	tracksWithCourses,
}: {
	tracksWithCourses: TrackWithCourses[];
}) {
	const router = useRouter();

	return (
		<div className="flex flex-col">
			<div className="mx-auto mt-16 w-full max-w-6xl">
				<h2 className="text-center text-3xl font-bold">Our Solutions</h2>
				<p className="mt-4 text-center">
					Create your account quickly with just your email or social media
					login, then explore a wide range
				</p>
				<div className="mt-8 grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
					{tracksWithCourses?.map((track, i) => (
						<OverviewTrackCard
							showDescription={false}
							showInstructor={false}
							track={track}
              role="learner"
							key={i}
						/>
					))}
				</div>
			</div>
			<div className="bg-sidebar mt-16">
				<div className="mx-auto mt-8 max-w-6xl text-white">
					<div className="flex justify-between px-4">
						<div className="w-full max-w-md">
							<h2 className="text-3xl font-bold">What will be next step</h2>
							<p className="mt-4">
								Discover our diverse stack of solutions, including software
								development, data science, and cloud tools. Sign up today and
								kickstart your journey!
							</p>
							<div className="mt-8 flex flex-wrap gap-5">
								{mainCourses?.map((course, index) => (
									<Badge
										variant="outline"
										className="text-md rounded-sm px-4 py-2 text-white"
										key={index}
									>
										{course}
									</Badge>
								))}
							</div>
						</div>
						<div className="relative hidden w-md md:block">
							<Image
								src={MockupMonitor}
								alt="Mockup Monitor"
								className="h-auto w-full"
								style={{ zIndex: 1, position: "relative" }}
								priority
							/>
							<Image
								src={MockupPhone}
								alt="Mockup Phone"
								className="absolute bottom-6 left-32 h-auto w-18 -translate-x-4"
								style={{ zIndex: 2 }}
								priority
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-4xl">
				<h2 className="mt-16 text-center text-3xl font-bold">We are proud</h2>
				<p className="mt-4 text-center">
					We take pride in our achievements and commitment to excellence. Join
					us in celebrating innovation, growth, and success.
				</p>
				<div className="mt-4 mt-8 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
					<div className="flex flex-col items-center justify-center px-8">
						<Icons.studentCap className="h-16 w-16" />
						<p className="text-sidebar text-4xl font-semibold">4+</p>
						<p className="text-lg font-semibold">Courses</p>
					</div>
					<div className="border-sidebar flex flex-col items-center justify-center border-r border-l px-8">
						<Icons.studentPerson className="h-12 w-12" />
						<p className="text-sidebar mt-2 text-3xl font-semibold">200+</p>
						<p className="text-lg font-semibold">Course students</p>
					</div>
					<div className="flex flex-col items-center justify-center px-8">
						<Icons.clock className="h-12 w-12" />
						<p className="text-sidebar mt-2 text-3xl font-semibold">250+</p>
						<p className="text-lg font-semibold">Hours of content</p>
					</div>
				</div>
			</div>
			<div
				className="bg-sidebar relative mt-16"
				style={{
					backgroundImage: `url(${GetStarted.src})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="bg-sidebar/70 absolute inset-0 z-0" />
				<div className="relative z-10 mx-auto my-4 max-w-6xl">
					<div className="flex items-center gap-4 px-4 py-8">
						<div className="flex max-w-3xl flex-col items-start justify-center text-white">
							<h2 className="text-3xl font-bold">
								It&apos;s time to start investing in yourself
							</h2>
							<p className="mt-4">
								Online courses open the opportunity for learning to almost
								anyone, regardless of their scheduling commitments.
							</p>
						</div>
						<Button
							variant="outline"
							className="border-background bg-sidebar h-12 w-32 rounded-sm font-semibold text-white"
							onClick={() => router.push(redirects.toSignup)}
						>
							Get Started
						</Button>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-6xl">
				<div className="mt-12 flex gap-2 px-4">
					{/* <p>Card Here</p> */}
					{/* <p>Card Here</p> */}
				</div>
			</div>
		</div>
	);
}
