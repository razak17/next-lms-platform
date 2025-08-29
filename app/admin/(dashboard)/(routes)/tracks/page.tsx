import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Pagination } from "@/components/ui/pagination";
import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { TrackCard } from "@/features/admin/tracks/components/track-card";
import { TrackDialog } from "@/features/admin/tracks/components/track-dialog";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { IconPlus } from "@tabler/icons-react";
import { count, desc, ilike, or } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface TracksPageProps {
	searchParams: Promise<{ title?: string; page?: string }>;
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const { title, page } = await searchParams;

	const q = title?.trim() ?? "";
	const currentPage = page ? parseInt(page) : 1;
	const pageSize = 8;

	const where = q
		? or(ilike(track.name, `%${q}%`), ilike(track.description, `%${q}%`))
		: undefined;

	const totalTracksResult = await db
		.select({ count: count() })
		.from(track)
		.where(where);

	const totalTracks = totalTracksResult[0]?.count ?? 0;
	const totalPages = Math.ceil(totalTracks / pageSize);

	const tracks = await db.query.track.findMany({
		with: { courses: true },
		where,
		orderBy: desc(track.createdAt),
		limit: pageSize,
		offset: (currentPage - 1) * pageSize,
	});

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Tracks"
					description="Filter, sort and access detailed tracks"
				/>
			</div>
			<div className="flex items-center justify-between px-6 pt-6">
				<SearchInput placeholder="Search tracks..." />
				<TrackDialog
					trigger={
						<Button className="flex w-48 items-center gap-2" size="lg">
							<IconPlus />
							Add Track
						</Button>
					}
				/>
			</div>
			<div className="flex flex-col gap-4 py-2 md:gap-6">
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
					{tracks.length === 0 && (
						<div className="text-muted-foreground col-span-full text-center">
							No tracks found. Please create a new track.
						</div>
					)}
					{tracks.map((track, i) => (
						<TrackCard track={track} key={i} />
					))}
				</div>

				{totalTracks > 0 && (
					<div className="px-4 lg:px-6">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={totalTracks}
							pageSize={pageSize}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
