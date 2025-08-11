import { Rating } from "@/components/rating";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { env } from "@/config/schema";
import { db } from "@/db/drizzle";
import { track } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface LearnerTracksPageProps {
	searchParams: Promise<{ title?: string }>;
}

export default async function LearnerTracksPage({
	searchParams,
}: LearnerTracksPageProps) {
	const { title } = await searchParams;

	const q = title?.trim() ?? "";

	const baseFilter = eq(track.userId, env.LANDING_PAGE_ADMIN_ID);

	const where = q
		? and(
				baseFilter,
				or(ilike(track.name, `%${q}%`), ilike(track.description, `%${q}%`))
			)
		: baseFilter;

	const tracks = await db.query.track.findMany({
		with: { courses: true },
		where,
		orderBy: desc(track.createdAt),
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
						{tracks?.map((item) => (
							<Link
								key={item.id}
								href={`/tracks/preview/${item.id}`}
								className="block"
							>
								<div className="flex flex-col gap-4">
									<Image
										src={item.image?.url || "/placeholders/placeholder-md.jpg"}
										alt={item.name}
										width={400}
										height={200}
										loading="lazy"
										className="object-fit h-56 w-full"
									/>
									<h2 className="text-center text-lg font-semibold">
										{item.name || "No Title Available"}
									</h2>
									<p className="line-clamp-2 min-h-[3rem] text-center">
										{item.description || "No description available."}
									</p>

									<div className="mt-auto">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Rating rating={Math.round(4.1)} />
												<p className="text-md font-semibold">4.8</p>
											</div>
											<p className="text-muted-foreground font-semibold">
												Price:{" "}
												<span className="text-foreground">
													{formatPrice(item.price)}
												</span>
											</p>
										</div>
										<Button
											className="bg-primary text-primary-foreground mt-10 w-full rounded-xs"
											size="lg"
										>
											Preview Track
										</Button>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
