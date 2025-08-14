"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { formatPrice } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface OverviewData {
	totalUsers: number;
	totalTracks: number;
	totalCourses: number;
	totalEnrollments: number;
	totalRevenue: number;
	avgTrackRating: number;
}

interface ReportsOverviewProps {
	data: OverviewData;
}

export function ReportsOverview({ data }: ReportsOverviewProps) {
	const stats = [
		{
			title: "Total Learners",
			value: data.totalUsers.toLocaleString(),
			icon: <Icons.users className="h-6 w-6" />,
			description: "Registered learners",
		},
		{
			title: "Total Tracks",
			value: data.totalTracks.toLocaleString(),
			icon: <Icons.users className="h-6 w-6" />,
			description: "Available learning tracks",
		},
		{
			title: "Total Courses",
			value: data.totalCourses.toLocaleString(),
			icon: <Icons.dashboard className="h-6 w-6" />,
			description: "Courses across all tracks",
		},
		{
			title: "Total Enrollments",
			value: data.totalEnrollments.toLocaleString(),
			icon: <Icons.clipboard className="h-6 w-6" />,
			description: "Learner enrollments",
		},
		{
			title: "Total Revenue",
			value: formatPrice(data.totalRevenue),
			icon: <Icons.earnings className="h-6 w-6" />,
			description: "Revenue from purchases",
		},
		{
			title: "Avg Track Rating",
			value: `${data.avgTrackRating.toFixed(1)}/5.0`,
			icon: <Icons.dashboard className="h-6 w-6" />,
			description: "Average track rating",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{stats.map((stat, index) => (
				<Card key={index}>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<p className="text-muted-foreground text-sm font-medium">
									{stat.title}
								</p>
								<p className="text-2xl font-bold">{stat.value}</p>
								<p className="text-muted-foreground text-xs">
									{stat.description}
								</p>
							</div>
							<div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
								{stat.icon}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
