import Image from "next/image";
import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/db/drizzle";
import { track as tracksTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Clock, GraduationCap, User, CalendarDays } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/rating";

export default async function TrackItemPreviewPage({
	params,
}: {
	params: Promise<{ trackId: string }>;
}) {
	const { trackId } = await params;

	const track = await db.query.track.findFirst({
		where: eq(tracksTable.id, trackId),
		with: { courses: true },
	});

	function formatMonthYear(value?: Date | string | null): string {
		if (!value) return "N/A";
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return "N/A";
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const year = date.getUTCFullYear();
		return `${month}/${year}`;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<div className="bg-sidebar min-h-92 py-6 text-white">
				<div className="px-4 lg:mx-auto lg:w-6xl">
					<Breadcrumb>
						<BreadcrumbList className="text-secondary hover:text-secondary">
							<BreadcrumbItem>
								<BreadcrumbLink asChild className="hover:text-secondary/60">
									<Link href="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild className="hover:text-secondary/60">
									<Link href="/tracks">Tracks</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-secondary font-semibold">
									{track?.name || "Track name"}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="mt-6 flex max-w-2xl flex-col">
						<h1 className="mt-6 text-xl font-bold md:text-3xl">
							{track?.name || "Track name"}
						</h1>
						<p className="mt-4">
							{track?.description || "No description available."}
						</p>
						<div className="mt-6 flex items-center gap-8">
							<div className="flex flex-col gap-2">
								<span className="text-md text-secondary">Instructor</span>
								<span className="text-md text-secondary font-semibold">
									{track?.instructor || "N/A"}
								</span>
							</div>
							<div className="flex flex-col gap-2">
								<span className="text-md text-secondary">
									Enrolled Students
								</span>
								<span className="text-md text-secondary font-semibold">17</span>
							</div>
							<div className="flex flex-col gap-2">
								<span className="text-md text-secondary">1 Review</span>
								<span className="text-md text-secondary font-semibold">
									<Rating rating={Math.round(4.2)} />
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 flex gap-8 px-4 lg:mx-auto lg:w-6xl">
				{/* Left column: Add your extra info here */}
				<div className="flex-1">
					{/* Your additional info goes here */}
					<div>
						{/* Example: */}
						<h2 className="mb-2 text-xl font-semibold">More Information</h2>
						<p className="mb-4">
							Write anything you want here, outside the colored background, to
							the left of the card.
						</p>
						{/* You can add more components, lists, etc. */}
					</div>
				</div>

				<div className="absolute top-26 right-48 z-10 w-92 px-4">
					<Card className="bg-background rounded-xs border-none p-4 shadow-none">
						<Image
							src={track?.image?.url || "/placeholders/placeholder-md.jpg"}
							alt={track?.name || "track image"}
							width={400}
							height={200}
							loading="lazy"
							className="object-fit h-52 w-full"
						/>
						<CardContent className="px-0">
							<CardTitle className="border-b pb-3 text-lg font-semibold">
								Course Details
							</CardTitle>
							<div className="flex flex-col">
								<div className="flex justify-between gap-2 border-b py-6">
									<div className="flex items-center gap-2">
										<Clock size={16} />
										<span className="text-foreground">Duration</span>
									</div>
									<span className="text-foreground">
										{track?.duration || "N/A"}
									</span>
								</div>
								<div className="flex justify-between gap-2 border-b py-6">
									<div className="flex items-center gap-2">
										<GraduationCap size={18} />
										<span className="text-foreground">Courses</span>
									</div>
									<span className="text-foreground">
										{track?.courses.length || "N/A"}
									</span>
								</div>
								<div className="flex justify-between gap-2 border-b py-6">
									<div className="flex items-center gap-2">
										<User size={18} />
										<span className="text-foreground">Instructor</span>
									</div>
									<span className="text-foreground">
										{track?.instructor || "N/A"}
									</span>
								</div>
								<div className="flex justify-between gap-2 border-b py-6">
									<div className="flex items-center gap-2">
										<CalendarDays size={18} />
										<span className="text-foreground">Date</span>
									</div>
									<span className="text-foreground">
										{formatMonthYear(track?.createdAt)}
									</span>
								</div>
								<div className="flex items-center justify-center py-6">
									<span className="text-foreground text-lg font-semibold">
										{track?.price ? `$${track?.price}` : "Free"}
									</span>
								</div>
								<div className="flex items-center justify-center">
									<Button className="w-full rounded-sm py-6" size="lg">
										Enroll Now
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
