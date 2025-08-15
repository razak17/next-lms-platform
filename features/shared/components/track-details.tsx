"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Rating } from "@/components/rating";
import { InteractiveRating } from "@/components/interactive-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackWithCourses, User } from "@/db/schema";
import { deleteTrack } from "@/features/admin/tracks/actions/tracks";
import { redirects } from "@/lib/constants";
import { Calendar, Pencil, Trash2, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TrackDialog } from "../../admin/tracks/components/track-dialog";
import { isAdmin } from "@/features/shared/utils/middleware";

interface RatingsData {
	averageRating: number;
	totalRatings: number;
	userRating: number | null;
}

export function TrackDetails({
	user,
	track,
	ratingsData,
}: {
	user: User;
	track: TrackWithCourses;
	ratingsData?: RatingsData;
}) {
	const router = useRouter();

	const { courses, ...trackWithoutCourses } = track;

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-4">
			<Image
				src={track.image?.url || "/placeholders/placeholder-lg.jpg"}
				alt={track.name}
				width={200}
				height={90}
				className="h-90 w-200 rounded-t-xl object-cover"
			/>
			<h2 className="text-3xl font-bold">{track.name}</h2>
			<div className="flex justify-between">
				<div className="flex gap-4">
					<div className="flex items-center gap-2 text-sm">
						<Calendar size={16} />
						<span className="text-muted-foreground">{track.duration}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<UserRound size={16} />
						<span className="text-muted-foreground">{track.instructor}</span>
					</div>
				</div>
				<p className="text-xl font-bold">${track.price}</p>
			</div>
			<div className="flex justify-between gap-4">
				<div className="flex flex-wrap gap-1">
					{track.courses?.map((course, i) => {
						return (
							<Badge
								key={i}
								className="rounded-full bg-blue-100 px-4 py-2 text-blue-800"
							>
								{course.title}
							</Badge>
						);
					})}
				</div>
				<div className="flex items-center justify-between">
					{ratingsData ? (
						<InteractiveRating
							trackId={track.id}
							userId={user.id}
							currentRating={ratingsData.userRating || 0}
							averageRating={ratingsData.averageRating}
							totalRatings={ratingsData.totalRatings}
							disabled={isAdmin(user.role)}
						/>
					) : (
						<>
							<Rating rating={0} />
							<Badge className="ml-2 rounded-full bg-red-100 px-4 py-2 tracking-wider text-yellow-800">
								{"0 / 5.0"}
							</Badge>
						</>
					)}
				</div>
			</div>
			<p className="text-md">{track.description}</p>
			{isAdmin(user.role) && (
				<div className="flex justify-end">
					<TrackDialog
						userId={user.id}
						track={trackWithoutCourses}
						trigger={
							<Button
								variant="ghost"
								className="h-12 w-18 text-blue-700 hover:bg-blue-100"
							>
								<Pencil />
							</Button>
						}
					/>
					<ConfirmDialog
						onConfirm={deleteTrack.bind(null, track.id)}
						onSuccess={() => router.push(redirects.adminToTracks)}
					>
						<Button
							variant="ghost"
							className="h-12 w-18 text-red-700 hover:bg-red-100"
						>
							<Trash2 />
						</Button>
					</ConfirmDialog>
				</div>
			)}
		</div>
	);
}
