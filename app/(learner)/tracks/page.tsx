import { SearchInput } from "@/components/search-input";
import { db } from "@/db/drizzle";
import { trackRating, track as tracksTable } from "@/db/schema";
import { TrackCard } from "@/features/learner/tracks/components/track-card";
import { auth } from "@/lib/auth/auth";
import { avg, count, desc, eq, ilike, or } from "drizzle-orm";
import { headers } from "next/headers";

interface LearnerTracksPageProps {
	searchParams: Promise<{ title?: string }>;
}

export default async function LearnerTracksPage({
	searchParams,
}: LearnerTracksPageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const { title } = await searchParams;

	const q = title?.trim() ?? "";

	const tracks = await getTracks(q);

	return (
		<div className="flex min-h-screen flex-col">
			<div className="bg-sidebar py-12 text-center text-white">
				<h1 className="text-2xl font-bold md:text-3xl">Tracks</h1>
			</div>
			<div className="mb-12 w-full gap-6 px-4 lg:mx-auto lg:w-6xl">
				<div className="mt-8 flex justify-center">
					<SearchInput
						className="bg-secondary rounded-xs md:w-40 lg:w-180"
						placeholder="Search tracks..."
					/>
				</div>
				<div className="mt-8 flex flex-col gap-4">
					<h1 className="text-2xl font-bold">Top Tracks</h1>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{tracks?.map((track) => (
							<TrackCard key={track.id} track={track} userId={session?.user?.id} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

async function getTracks(q: string) {
	const tracks = await db
		.select({
			id: tracksTable.id,
			name: tracksTable.name,
			description: tracksTable.description,
			image: tracksTable.image,
			price: tracksTable.price,
			rating: tracksTable.rating,
			averageRating: avg(trackRating.rating),
			totalRatings: count(trackRating.rating),
		})
		.from(tracksTable)
		.leftJoin(trackRating, eq(tracksTable.id, trackRating.trackId))
		.where(
			or(
				ilike(tracksTable.name, `%${q}%`),
				ilike(tracksTable.description, `%${q}%`)
			)
		)
		.groupBy(tracksTable.id)
		.orderBy(desc(tracksTable.createdAt));

	return tracks;
}

