import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LatestInvoice } from "@/features/admin/overview/components/latest-invoice";
import { OverviewStatsCard } from "@/features/admin/overview/components/overview-stats-card-stats-card";
import { OverviewTrackCard } from "@/features/shared/components/overview-track-card";
import { RecentRevenue } from "@/features/admin/overview/components/recent-revenue";
import { getTracksWithCourses } from "@/features/admin/tracks/queries/tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { IconArrowRight } from "@tabler/icons-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icons } from "@/components/icons";
import { CardItem } from "@/types";

const cardData: CardItem[] = [
	{
		title: "Total Learners",
		value: "12,450",
		change: "+12%",
		changeDirection: "up",
		icon: <Icons.users />,
	},
	{
		title: "Revenue",
		value: "12,434",
		change: "+20%",
		changeDirection: "up",
		icon: <Icons.earnings />,
	},
	{
		title: "Invoice",
		value: "100",
		change: "-2%",
		changeDirection: "down",
		icon: <Icons.clipboard />,
	},
];

export default async function DashbordOverviewPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const tracksWithCourses = await getTracksWithCourses(session.user.id);

	if ("error" in tracksWithCourses) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load tracks. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{tracksWithCourses.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	const firstFourTracks = tracksWithCourses.slice(0, 4);

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Welcome Admin 👋"
					description="Track activities, trends and popular courses in real time"
				/>
			</div>
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
					{cardData?.map((card, index) => (
						<OverviewStatsCard key={index} card={card} />
					))}
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between px-4 lg:px-6">
						<h2 className="px-4 text-xl font-semibold tracking-tight lg:px-6">
							Tracks
						</h2>
						<Link href={`${redirects.adminToTracks}`}>
							<Button variant="ghost" size="sm" className="px-4 lg:px-6">
								See All
								<IconArrowRight className="mr-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
					<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
						{firstFourTracks.length === 0 && (
							<div className="text-muted-foreground col-span-full text-center">
								No tracks created yet.
							</div>
						)}
						{firstFourTracks.map((track, i) => (
							<OverviewTrackCard
								showDescription={false}
								showInstructor={false}
								track={track}
								role="admin"
								key={i}
							/>
						))}
					</div>
				</div>
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-2">
					<RecentRevenue />
					<LatestInvoice />
				</div>
			</div>
		</div>
	);
}
