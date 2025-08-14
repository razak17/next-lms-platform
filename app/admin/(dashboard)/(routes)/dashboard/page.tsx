import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { db } from "@/db/drizzle";
import { track, user, purchase, learnerTrack } from "@/db/schema";
import { LatestInvoice } from "@/features/admin/overview/components/latest-invoice";
import { OverviewStatsCard } from "@/features/admin/overview/components/overview-stats-card";
import { RecentRevenue } from "@/features/admin/overview/components/recent-revenue";
import { OverviewTrackCard } from "@/features/shared/components/overview-track-card";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { CardItem } from "@/types";
import { IconArrowRight } from "@tabler/icons-react";
import {
	desc,
	eq,
	count,
	sum,
	countDistinct,
	gte,
	lt,
	and,
	sql,
} from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashbordOverviewPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const [
		tracksWithCourses,
		learnersData,
		revenueData,
		purchasesData,
		purchases,
		monthlyRevenueData,
	] = await Promise.all([
		getTracks(session.user.id),
		getTotalLearners(),
		getTotalRevenue(),
		getTotalPurchases(),
		getPurchases(),
		getMonthlyRevenue(),
	]);

	console.warn("DEBUGPRINT[1155]: page.tsx:28: purchases=", purchases.length);
	const formatChange = (change: number) => {
		const sign = change >= 0 ? "+" : "";
		return `${sign}${change.toFixed(1)}%`;
	};

	const getChangeDirection = (change: number): "up" | "down" => {
		return change >= 0 ? "up" : "down";
	};

	const cardData: CardItem[] = [
		{
			title: "Total Learners",
			value: learnersData.total.toLocaleString(),
			change: formatChange(learnersData.change),
			changeDirection: getChangeDirection(learnersData.change),
			icon: <Icons.users />,
		},
		{
			title: "Revenue",
			value: `$${revenueData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			change: formatChange(revenueData.change),
			changeDirection: getChangeDirection(revenueData.change),
			icon: <Icons.earnings />,
		},
		{
			title: "Purchases",
			value: purchasesData.total.toLocaleString(),
			change: formatChange(purchasesData.change),
			changeDirection: getChangeDirection(purchasesData.change),
			icon: <Icons.clipboard />,
		},
	];

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
						{tracksWithCourses.length === 0 && (
							<div className="text-muted-foreground col-span-full text-center">
								No tracks created yet.
							</div>
						)}
						{tracksWithCourses.map((track, i) => (
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
					<RecentRevenue data={monthlyRevenueData} />
					<LatestInvoice purchases={purchases} />
				</div>
			</div>
		</div>
	);
}

async function getTotalLearners() {
	const now = new Date();
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const currentResult = await db
		.select({ count: countDistinct(learnerTrack.userId) })
		.from(learnerTrack)
		.where(gte(learnerTrack.createdAt, currentMonth));

	const previousResult = await db
		.select({ count: countDistinct(learnerTrack.userId) })
		.from(learnerTrack)
		.where(
			and(
				gte(learnerTrack.createdAt, lastMonth),
				lt(learnerTrack.createdAt, currentMonth)
			)
		);

	const current = currentResult[0]?.count ?? 0;
	const previous = previousResult[0]?.count ?? 0;
	const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;

	return { total: current, change };
}

async function getTotalRevenue() {
	const now = new Date();
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const currentResult = await db
		.select({ total: sum(purchase.pricePaidInCents) })
		.from(purchase)
		.where(gte(purchase.createdAt, currentMonth));

	const previousResult = await db
		.select({ total: sum(purchase.pricePaidInCents) })
		.from(purchase)
		.where(
			and(
				gte(purchase.createdAt, lastMonth),
				lt(purchase.createdAt, currentMonth)
			)
		);

	const currentCents = currentResult[0]?.total ?? 0;
	const previousCents = previousResult[0]?.total ?? 0;
	const currentDollars = Number(currentCents) / 100;
	const previousDollars = Number(previousCents) / 100;
	const change =
		previousDollars === 0
			? 0
			: ((currentDollars - previousDollars) / previousDollars) * 100;

	return { total: currentDollars, change };
}

async function getTotalPurchases() {
	const now = new Date();
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const currentResult = await db
		.select({ count: count() })
		.from(purchase)
		.where(gte(purchase.createdAt, currentMonth));

	const previousResult = await db
		.select({ count: count() })
		.from(purchase)
		.where(
			and(
				gte(purchase.createdAt, lastMonth),
				lt(purchase.createdAt, currentMonth)
			)
		);

	const current = currentResult[0]?.count ?? 0;
	const previous = previousResult[0]?.count ?? 0;
	const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;

	return { total: current, change };
}

async function getTracks(userId: string) {
	const results = await db.query.track.findMany({
		with: { courses: true },
		where: eq(track.userId, userId),
		limit: 4,
		orderBy: desc(track.createdAt),
	});

	return results;
}

async function getPurchases() {
	const results = await db
		.select()
		.from(purchase)
		.leftJoin(track, eq(purchase.trackId, track.id))
		.leftJoin(user, eq(purchase.userId, user.id))
		.limit(5)
		.orderBy(desc(purchase.createdAt));

	return results;
}

async function getMonthlyRevenue() {
	const now = new Date();
	const currentYear = now.getFullYear();
	const startDate = new Date(currentYear, now.getMonth() - 11, 1);

	const monthlyData = await db
		.select({
			year: sql<number>`EXTRACT(YEAR FROM ${purchase.createdAt})`,
			month: sql<number>`EXTRACT(MONTH FROM ${purchase.createdAt})`,
			revenue: sum(purchase.pricePaidInCents),
		})
		.from(purchase)
		.where(gte(purchase.createdAt, startDate))
		.groupBy(
			sql`EXTRACT(YEAR FROM ${purchase.createdAt})`,
			sql`EXTRACT(MONTH FROM ${purchase.createdAt})`
		)
		.orderBy(
			sql`EXTRACT(YEAR FROM ${purchase.createdAt})`,
			sql`EXTRACT(MONTH FROM ${purchase.createdAt})`
		);

	const monthlyRevenue = new Map<string, number>();

	for (let i = 11; i >= 0; i--) {
		const date = new Date(currentYear, now.getMonth() - i, 1);
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		monthlyRevenue.set(monthKey, 0);
	}

	monthlyData.forEach((row) => {
		if (row.year && row.month && row.revenue) {
			const monthKey = `${row.year}-${String(row.month).padStart(2, "0")}`;
			const revenueInDollars = Number(row.revenue) / 100;
			monthlyRevenue.set(monthKey, revenueInDollars);
		}
	});

	return Array.from(monthlyRevenue.entries()).map(([monthKey, revenue]) => {
		const [year, month] = monthKey.split("-");
		const date = new Date(parseInt(year), parseInt(month) - 1, 1);
		const monthName = date.toLocaleString("default", { month: "long" });

		return {
			month: monthName,
			revenue: Math.round(revenue * 100) / 100,
			formattedRevenue: `$${revenue.toFixed(2)}`,
		};
	});
}
