"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseAnalytic {
	trackName: string;
	courseCount: number;
	totalEnrollments: number;
}

interface CourseAnalyticsProps {
	data: CourseAnalytic[];
}

export function CourseAnalytics({ data }: CourseAnalyticsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Analytics</CardTitle>
				<CardDescription>
					Course distribution and enrollment data by track
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{data.length === 0 ? (
						<div className="text-muted-foreground flex h-32 items-center justify-center">
							No course analytics data available
						</div>
					) : (
						data.map((item, index) => (
							<div
								key={index}
								className="flex items-center justify-between space-x-4 border-b pb-3 last:border-b-0"
							>
								<div className="flex-1 space-y-1">
									<p className="leading-none font-medium">{item.trackName}</p>
									<div className="flex items-center space-x-2">
										<Badge variant="outline" className="text-xs">
											{item.courseCount} courses
										</Badge>
										<Badge variant="secondary" className="text-xs">
											{item.totalEnrollments} enrollments
										</Badge>
									</div>
								</div>
								<div className="text-right">
									<p className="text-muted-foreground text-sm">
										{item.courseCount > 0
											? (item.totalEnrollments / item.courseCount).toFixed(1)
											: "0"}{" "}
										avg enrollments per course
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}
