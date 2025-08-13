"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TrackWithCourses, UserRole } from "@/db/schema";
import { Calendar, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { redirects } from "@/lib/constants";
import { isAdmin } from "@/features/shared/utils/middleware";

const courseColorClasses = [
	{ bg: "bg-blue-100", text: "text-blue-800" },
	{ bg: "bg-green-100", text: "text-green-800" },
	{ bg: "bg-yellow-100", text: "text-yellow-800" },
	{ bg: "bg-purple-100", text: "text-purple-800" },
	{ bg: "bg-pink-100", text: "text-pink-800" },
	{ bg: "bg-indigo-100", text: "text-indigo-800" },
	{ bg: "bg-red-100", text: "text-red-800" },
];

interface OverviewTrackCardProps {
	track: TrackWithCourses;
	role?: UserRole;
	showDescription?: boolean;
	showInstructor?: boolean;
}

export function OverviewTrackCard({
	track,
	role,
	showDescription = true,
	showInstructor = true,
}: OverviewTrackCardProps) {
	return (
		<Link
			href={
				isAdmin(role)
					? `${redirects.adminToTracks}/${track.id}`
					: `${redirects.toTracks}/${track.id}/preview`
			}
			className="block"
		>
			<Card className="@container/card flex flex-col gap-0 p-0">
				<div className="relative">
					<Image
						src={track.image?.url || "/placeholders/placeholder-md.jpg"}
						alt={track.name}
						width={400}
						height={200}
						loading="lazy"
						className="h-40 w-full rounded-t-xl object-cover"
					/>
					<div className="bg-secondary text-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold">
						{formatPrice(track.price)}
					</div>
				</div>
				<CardContent className="flex h-full flex-1 flex-col items-start gap-2 p-4">
					<CardTitle className="text-lg font-semibold">{track.name}</CardTitle>
					{showDescription && (
						<p className="line-clamp-3 flex-1 overflow-hidden text-sm">
							{track.description || "No description available."}
						</p>
					)}
					<div className="flex items-center gap-2 text-sm">
						<Calendar size={16} />
						<span className="text-muted-foreground">{track.duration}</span>
					</div>
					{showInstructor && (
						<div className="flex items-center gap-2 text-sm">
							<UserRound size={16} />
							<span className="text-muted-foreground">{track.instructor}</span>
						</div>
					)}
					<div className="mt-2 flex flex-wrap gap-1">
						{track?.courses && track?.courses?.length > 0 ? (
							track?.courses?.map((course, courseIndex) => {
								const color =
									courseColorClasses[courseIndex % courseColorClasses.length];
								return (
									<Badge
										key={courseIndex}
										className={`${color.bg} ${color.text} rounded-full px-4 py-2 font-medium`}
									>
										{course.title}
									</Badge>
								);
							})
						) : (
							<Badge className="invisible rounded-full px-4 py-2 text-xs font-medium">
								No courses
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
