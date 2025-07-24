import { SearchInput } from "@/components/search-input";
import { Heading } from "@/components/ui/heading";
import { tracksCardData } from "@/constants/data";
import { TrackCard } from "@/features/tracks/components/track-card";
import { TrackDialog } from "@/features/tracks/components/track-dialog";
import { getTracks } from "@/features/tracks/queries/tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TracksCards } from "../dashboard/_components/tracks-cards";

interface TracksPageProps {
	searchParams: Promise<{ title?: string }>;
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const { title } = await searchParams;

	const tracks = await getTracks(session.user.id);

	const filteredTracks = tracksCardData.filter((track) => {
		return track.title.toLowerCase().includes(title?.toLowerCase() || "");
	});

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Tracks"
					description="Filter, sort and access detailed tracks"
				/>
			</div>
			<div className="flex justify-between px-6 pt-6">
				<SearchInput placeholder="Search Track" />
				<TrackDialog userId={session.user.id} />
			</div>
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
					{"length" in tracks && tracks.length === 0 && (
						<div className="text-muted-foreground col-span-full text-center">
							No tracks found. Please create a new track.
						</div>
					)}
					{"length" in tracks &&
						tracks.length > 0 &&
						Array.isArray(tracks) &&
						tracks.map((track) => (
							<TrackCard
								track={track}
								key={track.id}
								// courses={course}
							/>
						))}
				</div>
				<TracksCards tracksCardData={filteredTracks} />
			</div>
		</div>
	);
}
