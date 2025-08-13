import { Rating } from "@/components/rating";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { env } from "@/config/server";
import { db } from "@/db/drizzle";
import { track as tracksTable } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { learnerOwnsTrack } from "@/features/shared/actions/tracks";
import { auth } from "@/lib/auth/auth";
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

	const baseFilter = eq(tracksTable.userId, env.LANDING_PAGE_ADMIN_ID);

	const where = q
		? and(
				baseFilter,
				or(
					ilike(tracksTable.name, `%${q}%`),
					ilike(tracksTable.description, `%${q}%`)
				)
			)
		: baseFilter;

	const tracks = await db.query.track.findMany({
		with: { courses: true },
		where,
		orderBy: desc(tracksTable.createdAt),
	});

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
							<div key={track.id} className="flex flex-col gap-4">
								<Image
									src={track.image?.url || "/placeholders/placeholder-md.jpg"}
									alt={track.name}
									width={400}
									height={200}
									loading="lazy"
									className="object-fit h-56 w-full"
								/>
								<h2 className="text-center text-lg font-semibold">
									{track.name || "No Title Available"}
								</h2>
								<p className="line-clamp-2 min-h-[3rem] text-center">
									{track.description || "No description available."}
								</p>

								<div className="mt-auto">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Rating rating={Math.round(4.1)} />
											<p className="text-md font-semibold">4.1</p>
										</div>
										<p className="text-muted-foreground font-semibold">
											Price:{" "}
											<span className="text-foreground">
												{formatPrice(track.price)}
											</span>
										</p>
									</div>
									<PreviewButton
										trackId={track?.id}
										learnerId={session?.user?.id}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

async function PreviewButton({
	trackId,
	learnerId,
}: {
	trackId?: string;
	learnerId?: string;
}) {
	const PreviewBtn = () => (
		<Button
			asChild
			className="bg-primary text-primary-foreground mt-10 w-full rounded-xs"
			size="lg"
		>
			<Link href={`/tracks/${trackId}/preview`} className="block">
				Preview Track
			</Link>
		</Button>
	);

	if (!trackId || !learnerId) {
		return <PreviewBtn />;
	}

	const ownsTrack = await learnerOwnsTrack(trackId, learnerId);

	if (ownsTrack) {
		return (
			<Button
				asChild
				className="bg-primary text-primary-foreground mt-10 w-full rounded-xs"
				size="lg"
			>
				<Link href={`/tracks/${trackId}`} className="block">
					Go to Track
				</Link>
			</Button>
		);
	}

	return <PreviewBtn />;
}
