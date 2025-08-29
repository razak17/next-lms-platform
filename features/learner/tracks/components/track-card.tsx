import { Rating } from "@/components/rating";
import { formatPrice } from "@/lib/utils";
import { StoredFile } from "@/types";
import Image from "next/image";
import { PreviewButton } from "./preview-button";

export function TrackCard({
	track,
	userId,
}: {
	track: {
		id: string;
		name: string;
		description: string;
		image: StoredFile | null;
		price: string;
		rating: number;
		averageRating: string | null;
		totalRatings: number;
	};
	userId?: string;
}) {
	return (
		<div className="flex flex-col gap-4">
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
						<Rating
							rating={Math.round(
								Number(track.averageRating) || track.rating || 0
							)}
						/>
						<p className="text-md font-semibold">
							{track.averageRating
								? Number(track.averageRating).toFixed(1)
								: track.rating
									? track.rating.toString()
									: "0.0"}
						</p>
						{track.totalRatings > 0 && (
							<p className="text-muted-foreground text-sm">
								({track.totalRatings})
							</p>
						)}
					</div>
					<p className="text-muted-foreground font-semibold">
						Price:{" "}
						<span className="text-foreground">{formatPrice(track.price)}</span>
					</p>
				</div>
				<PreviewButton trackId={track?.id} learnerId={userId} />
			</div>
		</div>
	);
}
