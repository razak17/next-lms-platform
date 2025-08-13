import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db/drizzle";
import { Course, learnerTrack } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import {
	IconArrowRight,
	IconDashboard,
	IconSettings,
	IconReceipt,
} from "@tabler/icons-react";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/features/shared/queries/users";
import { LearnerProfileForm } from "@/features/learner/profile/components/learner-profile-form";
import { LearnerChangePasswordButton } from "@/features/learner/profile/components/learner-change-password-button";
import { getPurchasesByUserId } from "@/features/learner/purchases/queries/purchases";
import { PurchasesTable } from "@/features/learner/purchases/components/purchases-table";

export default async function LearnersDashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.toLogin);
	}

	const user = await getUserByEmail(session.user.email);

	if (!user || "error" in user) {
		redirect(redirects.toLogin);
	}

	const learnerTracksWithCourses = await db.query.learnerTrack.findMany({
		with: {
			track: {
				with: {
					courses: true,
				},
			},
		},
		where: eq(learnerTrack.userId, session.user.id),
		orderBy: desc(learnerTrack.createdAt),
	});

	const purchases = await getPurchasesByUserId(session.user.id);
	const purchasesData = Array.isArray(purchases) ? purchases : [];

	return (
		<div className="flex min-h-screen flex-col">
			<div className="py-1 text-center text-white">
				<div className="bg-background text-foreground mx-auto max-w-6xl p-4">
					<Tabs defaultValue="dashboard" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger
								value="dashboard"
								className="flex items-center gap-2"
							>
								<IconDashboard className="h-4 w-4" />
								Dashboard
							</TabsTrigger>
							<TabsTrigger value="settings" className="flex items-center gap-2">
								<IconSettings className="h-4 w-4" />
								Settings
							</TabsTrigger>
							<TabsTrigger value="invoices" className="flex items-center gap-2">
								<IconReceipt className="h-4 w-4" />
								Purchases
							</TabsTrigger>
						</TabsList>
						<TabsContent value="dashboard">
							<div className="mb-12 w-full gap-6 px-4 py-8">
								<h2 className="mb-8 text-xl font-bold md:text-2xl">
									Enrolled Tracks
								</h2>
								{learnerTracksWithCourses.length > 0 ? (
									<div className="space-y-8">
										{learnerTracksWithCourses.map((learnerTrack, i) => (
											<div
												key={i}
												className="flex w-full flex-col gap-4 rounded-lg border px-6 py-4"
											>
												<div className="flex items-center justify-between">
													<h2 className="pb-2 text-xl font-semibold">
														{learnerTrack.track?.name}
													</h2>
													<Link href={`/tracks/${learnerTrack.track?.id}`}>
														<Button
															variant="ghost"
															size="sm"
															className="px-4 lg:px-6"
														>
															Go to Track
															<IconArrowRight className="mr-2 h-4 w-4" />
														</Button>
													</Link>
												</div>
												{learnerTrack.track?.courses &&
												learnerTrack.track.courses.length > 0 ? (
													<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
														{learnerTrack.track.courses.map((course, j) => (
															<CourseCard
																key={j}
																course={course}
																image={course.image?.url}
															/>
														))}
													</div>
												) : (
													<div className="text-muted-foreground py-8 text-center">
														No courses available in this track yet.
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<div className="text-center text-lg">
										You have not enrolled in any tracks yet. Explore available
										tracks and start learning!
									</div>
								)}
							</div>
						</TabsContent>
						<TabsContent value="settings">
							<div className="mb-12 w-full gap-6 px-4 py-8">
								<h2 className="mb-8 text-xl font-bold md:text-2xl">Settings</h2>
								<div className="space-y-6">
									<Card className="p-6">
										<h3 className="text-lg font-semibold">Profile Settings</h3>
										<p className="text-muted-foreground mb-6">
											Update your profile information.
										</p>
										<LearnerProfileForm user={user} />
									</Card>
									<Card className="p-6">
										<h3 className="text-lg font-semibold">Security Settings</h3>
										<p className="text-muted-foreground mb-4">
											Manage your account security and password.
										</p>
										<LearnerChangePasswordButton />
									</Card>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="invoices">
							<div className="mb-12 w-full gap-6 px-4 py-8">
								<h2 className="mb-8 text-xl font-bold md:text-2xl">
									Purchases
								</h2>
								<div className="space-y-6">
									<Card className="p-6">
										<h3 className="mb-4 text-lg font-semibold">
											Purchase History
										</h3>
										<p className="text-muted-foreground mb-6">
											View your purchase history and download receipts.
										</p>
										{purchasesData.length > 0 ? (
											<PurchasesTable data={purchasesData} />
										) : (
											<div className="text-muted-foreground py-8 text-center">
												No purchases found. Start learning by enrolling in a
												track!
											</div>
										)}
									</Card>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

function CourseCard({
	course,
	image = "/placeholders/placeholder-md.jpg",
}: {
	course: Course;
	image?: string;
}) {
	return (
		<Card className="@container/card flex min-h-[20rem] flex-col gap-0 p-0 transition-all hover:scale-105 hover:shadow-lg">
			<Image
				src={image}
				alt={course.title}
				width={400}
				height={200}
				loading="lazy"
				className="h-40 w-full rounded-t-lg object-cover"
			/>
			<CardContent className="flex flex-1 flex-col gap-3 p-4">
				<CardTitle className="group-hover:text-primary line-clamp-2 text-lg">
					{course.title}
				</CardTitle>
				{course.description && (
					<p className="text-muted-foreground line-clamp-3 flex-1 text-sm">
						{course.description}
					</p>
				)}
				<div className="text-muted-foreground flex items-center justify-between text-sm">
					<span>Course</span>
					<span className="text-primary font-medium">Registered</span>
				</div>
			</CardContent>
		</Card>
	);
}
