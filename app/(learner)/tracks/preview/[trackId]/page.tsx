import Image from "next/image";
import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/db/drizzle";
import { track as tracksTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Clock,
	GraduationCap,
	User,
	CalendarDays,
	BookOpen,
	Star,
	Users,
	TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/rating";

export default async function TrackItemPreviewPage({
	params,
}: {
	params: Promise<{ trackId: string }>;
}) {
	const { trackId } = await params;

	const track = await db.query.track.findFirst({
		where: eq(tracksTable.id, trackId),
		with: { courses: true },
	});

	function formatMonthYear(value?: Date | string | null): string {
		if (!value) return "N/A";
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return "N/A";
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const year = date.getUTCFullYear();
		return `${month}/${year}`;
	}

	return (
		<div className="from-background to-muted/20 flex min-h-screen flex-col bg-gradient-to-br">
			{/* Hero Section */}
			<div className="from-sidebar to-sidebar/90 bg-gradient-to-r py-12 text-white">
				<div className="container mx-auto px-4 lg:max-w-6xl">
					<Breadcrumb className="mb-8">
						<BreadcrumbList className="text-secondary/80">
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="transition-colors hover:text-white"
								>
									<Link href="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-secondary/60" />
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="transition-colors hover:text-white"
								>
									<Link href="/tracks">Tracks</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-secondary/60" />
							<BreadcrumbItem>
								<BreadcrumbPage className="font-semibold text-white">
									{track?.name || "Track name"}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="flex max-w-4xl flex-col">
						<div className="mb-4 flex items-center gap-2">
							<Badge
								variant="secondary"
								className="border-white/30 bg-white/20 text-white"
							>
								Premium Track
							</Badge>
							<Badge variant="outline" className="border-white/30 text-white">
								{track?.courses?.length || 0} Courses
							</Badge>
						</div>

						<h1 className="mb-6 text-3xl leading-tight font-bold md:text-5xl">
							{track?.name || "Track name"}
						</h1>

						<p className="text-secondary/90 mb-8 max-w-2xl text-lg leading-relaxed">
							{track?.description ||
								"Discover the comprehensive learning journey designed to take your skills to the next level."}
						</p>

						<div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
							<div className="flex flex-col gap-2 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
								<div className="text-secondary/80 flex items-center gap-2">
									<User size={16} />
									<span>Instructor</span>
								</div>
								<span className="text-base font-semibold text-white">
									{track?.instructor || "Expert Instructor"}
								</span>
							</div>
							<div className="flex flex-col gap-2 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
								<div className="text-secondary/80 flex items-center gap-2">
									<Users size={16} />
									<span>Enrolled Students</span>
								</div>
								<span className="text-base font-semibold text-white">
									1,247
								</span>
							</div>
							<div className="flex flex-col gap-2 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
								<div className="text-secondary/80 flex items-center gap-2">
									<Star size={16} />
									<span>Rating</span>
								</div>
								<div className="flex items-center gap-2">
									<Rating rating={Math.round(4.8)} />
									<span className="font-semibold text-white">
										(127 reviews)
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-12 lg:max-w-6xl">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Left Column - Course Content */}
					<div className="space-y-8 lg:col-span-2">
						{/* What You'll Learn */}
						<Card className="border-0 shadow-lg">
							<CardContent className="p-8">
								<h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
									<TrendingUp className="text-primary" size={24} />
									What You'll Learn
								</h2>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{[
										"Master fundamental concepts and advanced techniques",
										"Build real-world projects from scratch",
										"Learn industry best practices and standards",
										"Develop problem-solving and critical thinking skills",
										"Gain hands-on experience with modern tools",
										"Prepare for certification and career advancement",
									].map((item, index) => (
										<div key={index} className="flex items-start gap-3">
											<div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
											<span className="text-muted-foreground">{item}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Course Content */}
						<Card className="border-0 shadow-lg">
							<CardContent className="p-8">
								<h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
									<BookOpen className="text-primary" size={24} />
									Course Content
								</h2>
								<div className="space-y-4">
									{track?.courses?.map((course, index) => (
										<div
											key={course.id}
											className="border-border hover:bg-muted/50 rounded-lg border p-4 transition-colors"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
														<span className="text-primary text-sm font-semibold">
															{index + 1}
														</span>
													</div>
													<div>
														<h3 className="font-semibold">{course.name}</h3>
														<p className="text-muted-foreground text-sm">
															{course.description}
														</p>
													</div>
												</div>
												<Badge variant="outline">
													{course.duration || "2 weeks"}
												</Badge>
											</div>
										</div>
									)) || (
										<div className="text-muted-foreground py-8 text-center">
											<BookOpen size={48} className="mx-auto mb-4 opacity-50" />
											<p>Course content will be available soon</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Instructor */}
						<Card className="border-0 shadow-lg">
							<CardContent className="p-8">
								<h2 className="mb-6 text-2xl font-bold">Instructor</h2>
								<div className="flex items-start gap-4">
									<div className="from-primary to-primary/70 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
										<User className="text-white" size={24} />
									</div>
									<div>
										<h3 className="mb-2 text-xl font-semibold">
											{track?.instructor || "Expert Instructor"}
										</h3>
										<p className="text-muted-foreground mb-4">
											Experienced professional with over 10 years in the
											industry. Passionate about teaching and helping students
											achieve their goals.
										</p>
										<div className="text-muted-foreground flex items-center gap-4 text-sm">
											<span>50+ Courses</span>
											<span>•</span>
											<span>10,000+ Students</span>
											<span>•</span>
											<span>4.9 Rating</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Enrollment Card */}
					<div className="lg:col-span-1">
						<div className="sticky top-6">
							<Card className="overflow-hidden border-0 shadow-xl">
								<div className="relative">
									<Image
										src={
											track?.image?.url || "/placeholders/placeholder-md.jpg"
										}
										alt={track?.name || "track image"}
										width={400}
										height={240}
										className="h-60 w-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
									<div className="absolute right-4 bottom-4 left-4">
										<div className="mb-2 text-2xl font-bold text-white">
											{track?.price ? `$${track?.price}` : "Free"}
										</div>
									</div>
								</div>

								<CardContent className="p-6">
									<Button
										className="mb-6 w-full py-3 text-lg font-semibold"
										size="lg"
									>
										Enroll Now
									</Button>

									<div className="space-y-4">
										<div className="flex items-center justify-between border-b py-3">
											<div className="flex items-center gap-3">
												<Clock size={18} className="text-muted-foreground" />
												<span className="font-medium">Duration</span>
											</div>
											<span className="text-muted-foreground">
												{track?.duration || "8 weeks"}
											</span>
										</div>

										<div className="flex items-center justify-between border-b py-3">
											<div className="flex items-center gap-3">
												<GraduationCap
													size={18}
													className="text-muted-foreground"
												/>
												<span className="font-medium">Courses</span>
											</div>
											<span className="text-muted-foreground">
												{track?.courses?.length || "12"} courses
											</span>
										</div>

										<div className="flex items-center justify-between border-b py-3">
											<div className="flex items-center gap-3">
												<User size={18} className="text-muted-foreground" />
												<span className="font-medium">Instructor</span>
											</div>
											<span className="text-muted-foreground">
												{track?.instructor || "Expert"}
											</span>
										</div>

										<div className="flex items-center justify-between border-b py-3">
											<div className="flex items-center gap-3">
												<CalendarDays
													size={18}
													className="text-muted-foreground"
												/>
												<span className="font-medium">Start Date</span>
											</div>
											<span className="text-muted-foreground">
												{formatMonthYear(track?.createdAt)}
											</span>
										</div>
									</div>

									<div className="bg-muted/50 mt-6 rounded-lg p-4">
										<div className="text-center">
											<p className="text-muted-foreground mb-2 text-sm">
												30-day money-back guarantee
											</p>
											<p className="text-muted-foreground text-sm">
												Full lifetime access
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
