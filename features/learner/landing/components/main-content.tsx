"use client";

import GetStarted from "@/assets/images/get-started.jpg";
import MockupMonitor from "@/assets/images/mockup-monitor.png";
import MockupPhone from "@/assets/images/mockup-phone.png";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mainCourses } from "@/data/site";
import { TrackWithCourses } from "@/db/schema";
import { OverviewTrackCard } from "@/features/shared/components/overview-track-card";
import { redirects } from "@/lib/constants";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function MainContent({
	tracksWithCourses,
	userId,
}: {
	tracksWithCourses: TrackWithCourses[];
	userId?: string;
}) {
	const router = useRouter();

	return (
		<div className="flex flex-col">
			<div className="mx-auto mt-8 w-full max-w-6xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:px-8">
				<h2 className="text-center text-2xl font-bold sm:text-3xl">
					Our Solutions
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base">
					Create your account quickly with just your email or social media
					login, then explore a wide range
				</p>
				<div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
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
			<div className="bg-sidebar mt-8 sm:mt-12 md:mt-16">
				<div className="mx-auto max-w-6xl px-4 pt-8 pb-4 text-white sm:px-6 sm:pt-12 sm:pb-8 lg:px-8">
					<div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
						<div className="w-full max-w-md text-center lg:max-w-lg lg:text-left">
							<h2 className="text-2xl font-bold sm:text-3xl">
								What will be next step
							</h2>
							<p className="mt-4 text-sm sm:text-base">
								Discover our diverse stack of solutions, including software
								development, data science, and cloud tools. Sign up today and
								kickstart your journey!
							</p>
							<div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-5 lg:justify-start">
								{mainCourses?.map((course, index) => (
									<Badge
										variant="outline"
										className="sm:text-md rounded-sm px-3 py-2 text-sm text-white sm:px-4"
										key={index}
									>
										{course}
									</Badge>
								))}
							</div>
						</div>
						<div className="relative hidden w-full max-w-md lg:block">
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
			<div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
				<h2 className="mt-8 text-center text-2xl font-bold sm:mt-12 sm:text-3xl md:mt-16">
					We are proud
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base">
					We take pride in our achievements and commitment to excellence. Join
					us in celebrating innovation, growth, and success.
				</p>
				<div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
					<div className="flex flex-col items-center justify-center px-4 py-4 sm:px-8">
						<Icons.studentCap className="h-12 w-12 sm:h-16 sm:w-16" />
						<p className="text-sidebar mt-2 text-3xl font-semibold sm:text-4xl">
							4+
						</p>
						<p className="text-center text-base font-semibold sm:text-lg">
							Courses
						</p>
					</div>
					<div className="border-sidebar flex flex-col items-center justify-center px-4 py-4 sm:border-r sm:border-l sm:px-8">
						<Icons.studentPerson className="h-10 w-10 sm:h-12 sm:w-12" />
						<p className="text-sidebar mt-2 text-2xl font-semibold sm:text-3xl">
							200+
						</p>
						<p className="text-center text-base font-semibold sm:text-lg">
							Course students
						</p>
					</div>
					<div className="flex flex-col items-center justify-center px-4 py-4 sm:px-8">
						<Icons.clock className="h-10 w-10 sm:h-12 sm:w-12" />
						<p className="text-sidebar mt-2 text-2xl font-semibold sm:text-3xl">
							250+
						</p>
						<p className="text-center text-base font-semibold sm:text-lg">
							Hours of content
						</p>
					</div>
				</div>
			</div>
			<div
				className="bg-sidebar relative mt-8 sm:mt-12 md:mt-16"
				style={{
					backgroundImage: `url(${GetStarted.src})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="bg-sidebar/70 absolute inset-0 z-0" />
				<div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
						<div className="flex max-w-3xl flex-col items-center justify-center text-center text-white sm:items-start sm:text-left">
							<h2 className="text-2xl font-bold sm:text-3xl">
								It&apos;s time to start investing in yourself
							</h2>
							<p className="mt-4 text-sm sm:text-base">
								Online courses open the opportunity for learning to almost
								anyone, regardless of their scheduling commitments.
							</p>
						</div>
						<GetStartedButton userId={userId} />
					</div>
				</div>
			</div>
			<div className="mx-auto my-8 w-full max-w-6xl px-4 sm:my-12 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-6 lg:gap-8 xl:flex-row">
					<div className="flex w-full flex-col gap-4 sm:gap-6 xl:flex-3">
						<Card className="@container/card flex flex-col gap-4 rounded-lg p-4 shadow-lg sm:flex-row sm:gap-6 sm:p-6 lg:gap-8">
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
								<Icons.signup className="h-12 w-16 flex-shrink-0" />
								<div className="flex flex-col gap-2 text-center sm:text-left">
									<h3 className="text-xl font-bold sm:text-2xl">
										Sign Up and Choose Your Course
									</h3>
									<p className="text-sm sm:text-base">
										Create your account quickly with just your email or social
										media login, then explore a wide range
									</p>
								</div>
							</div>
						</Card>
						<ArrowDown
							size={32}
							className="text-sidebar mx-auto hidden sm:block"
						/>
						<Card className="@container/card flex flex-col gap-4 rounded-lg p-4 shadow-lg sm:flex-row sm:gap-6 sm:p-6 lg:gap-8">
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
								<Icons.onboarding className="h-14 w-20 flex-shrink-0" />
								<div className="flex flex-col gap-2 text-center sm:text-left">
									<h3 className="text-xl font-bold sm:text-2xl">Onboarding</h3>
									<p className="text-sm sm:text-base">
										Get started seamlessly with a smooth onboarding experience.
										Learn the essentials and set yourself up for success from
										day one.
									</p>
								</div>
							</div>
						</Card>
						<ArrowDown
							size={32}
							className="text-sidebar mx-auto hidden sm:block"
						/>
						<Card className="@container/card flex flex-col gap-4 rounded-lg p-4 shadow-lg sm:flex-row sm:gap-6 sm:p-6 lg:gap-8">
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
								<Icons.startLearning className="h-12 w-20 flex-shrink-0" />
								<div className="flex flex-col gap-2 text-center sm:text-left">
									<h3 className="text-xl font-bold sm:text-2xl">
										Start Learning
									</h3>
									<p className="text-sm sm:text-base">
										Start your learning journey with practical, hands-on
										experience. Develop the skills needed to build, implement,
										and manage effective solutions.
									</p>
								</div>
							</div>
						</Card>
					</div>
					<div className="w-full flex-col gap-2 xl:flex-4">
						<Card className="@container/card flex h-full flex-col gap-4 rounded-lg px-4 py-6 shadow-lg sm:gap-6 lg:flex-row lg:gap-8">
							<div className="flex w-full flex-col gap-4 sm:flex-row lg:flex-col lg:gap-8">
								<div className="flex w-full flex-row gap-4 sm:flex-row lg:flex-row lg:gap-8">
									<div className="flex w-full flex-col items-center justify-center gap-2 sm:gap-4 lg:w-full">
										<h3 className="sm:text-md text-sm font-bold">1</h3>
										<h3 className="sm:text-md text-sm font-bold">
											Secure Login
										</h3>
										<Icons.secureLogin className="h-24 w-32 sm:h-32 sm:w-42" />
									</div>
									<div className="flex w-full flex-col items-center justify-center gap-2 sm:w-1/2 sm:gap-4 lg:w-full">
										<h3 className="sm:text-md text-sm font-bold">2</h3>
										<h3 className="sm:text-md text-sm font-bold">
											Authentication
										</h3>
										<Icons.authentication className="h-24 w-24 sm:h-32 sm:w-32" />
									</div>
								</div>
								<div className="mt-4 flex w-full flex-col justify-center gap-2 lg:mt-0">
									<div className="flex items-center gap-2 sm:gap-4">
										<h3 className="sm:text-md text-sm font-bold">3</h3>
										<h3 className="sm:text-md text-sm font-bold">
											Choose a course
										</h3>
									</div>

									<div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3">
										<Card className="@container/card flex flex-col gap-2 rounded-lg p-3 shadow-lg sm:gap-4 sm:p-4">
											<Icons.softwareDev className="h-8 w-8 sm:h-10 sm:w-10" />
											<h3 className="text-xs font-bold sm:text-sm">
												Software Development
											</h3>
											<p className="text-xs leading-tight">
												Unlock your potential with comprehensive training in
												modern software development.
											</p>
											<p className="text-center text-xs font-bold">
												Price: $350
											</p>
										</Card>
										<Card className="@container/card flex flex-col gap-2 rounded-lg p-3 shadow-lg sm:gap-4 sm:p-4">
											<Icons.dataScience className="h-8 w-8 sm:h-10 sm:w-10" />
											<h3 className="text-xs font-bold sm:text-sm">
												Data Science
											</h3>
											<p className="text-xs leading-tight">
												Equip yourself with the skills to analyze, interpret,
												and leverage data, becoming an expert.
											</p>
											<p className="text-center text-xs font-bold">
												Price: $350
											</p>
										</Card>
										<Card className="@container/card flex flex-col gap-2 rounded-lg p-3 shadow-lg sm:gap-4 sm:p-4">
											<Icons.cloudComputing className="h-8 w-8 sm:h-10 sm:w-10" />
											<h3 className="text-xs font-bold sm:text-sm">
												Cloud Computing
											</h3>
											<p className="text-xs leading-tight">
												Gain hands-on experience in cloud computing, preparing
												you to design, deploy, and manage scalable solutions.
											</p>
											<p className="text-center text-xs font-bold">
												Price: $350
											</p>
										</Card>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

function GetStartedButton({ userId }: { userId?: string }) {
	const router = useRouter();

	if (userId) {
		return (
			<Button
				variant="outline"
				className="border-background bg-sidebar h-12 w-36 flex-shrink-0 rounded-sm font-semibold text-white sm:w-48"
				onClick={() => router.push(redirects.toDashboard)}
			>
				Go to Dashboard
			</Button>
		);
	}

	return (
		<Button
			variant="outline"
			className="border-background bg-sidebar h-12 w-36 flex-shrink-0 rounded-sm font-semibold text-white sm:w-40"
			onClick={() => router.push(redirects.toSignup)}
		>
			Get Started
		</Button>
	);
}
