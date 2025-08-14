"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

interface RecentEnrollment {
	id: string;
	userName: string;
	userEmail: string;
	trackName: string;
	trackPrice: number;
	enrolledAt: Date;
}

interface RecentEnrollmentsProps {
	data: RecentEnrollment[];
}

export function RecentEnrollments({ data }: RecentEnrollmentsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Enrollments</CardTitle>
				<CardDescription>
					Latest learner enrollments across all tracks
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{data.length === 0 ? (
						<div className="text-muted-foreground flex h-32 items-center justify-center">
							No recent enrollments found
						</div>
					) : (
						data.map((enrollment, index) => (
							<div
								key={`${enrollment.id}-${index}`}
								className="flex items-center justify-between space-x-4 border-b pb-3 last:border-b-0"
							>
								<div className="space-y-1">
									<p className="leading-none font-medium">
										{enrollment.userName}
									</p>
									<p className="text-muted-foreground text-sm">
										{enrollment.userEmail}
									</p>
									<p className="text-sm font-medium text-blue-600">
										{enrollment.trackName}
									</p>
								</div>
								<div className="space-y-1 text-right">
									<Badge variant="secondary" className="text-xs">
										{formatPrice(enrollment.trackPrice)}
									</Badge>
									<p className="text-muted-foreground text-xs">
										{formatDate(enrollment.enrolledAt)}
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
