"use client";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface InteractiveRatingProps {
	trackId: string;
	userId: string;
	currentRating?: number;
	averageRating?: number;
	totalRatings?: number;
	onRatingSubmit?: (rating: number) => void;
	disabled?: boolean;
}

export function InteractiveRating({
	trackId,
	userId,
	currentRating = 0,
	averageRating = 0,
	totalRatings = 0,
	onRatingSubmit,
	disabled = false,
}: InteractiveRatingProps) {
	const [hoveredRating, setHoveredRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(currentRating);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleStarClick = async (rating: number) => {
		if (disabled || isSubmitting) return;

		setSelectedRating(rating);
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/track-rating", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					trackId,
					userId,
					rating,
				}),
			});

			if (response.ok) {
				onRatingSubmit?.(rating);
				router.refresh();
			} else {
				// Reset on error
				setSelectedRating(currentRating);
			}
		} catch (error) {
			console.error("Error submitting rating:", error);
			setSelectedRating(currentRating);
		} finally {
			setIsSubmitting(false);
		}
	};

	const displayRating = hoveredRating || selectedRating;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center space-x-1">
				{[1, 2, 3, 4, 5].map((star) => {
					const isFilled = star <= displayRating;
					const StarComponent = isFilled ? StarFilledIcon : StarIcon;

					return (
						<button
							key={star}
							className={`transition-colors duration-200 ${
								disabled
									? "cursor-not-allowed opacity-50"
									: "cursor-pointer hover:scale-110"
							}`}
							onMouseEnter={() => !disabled && setHoveredRating(star)}
							onMouseLeave={() => !disabled && setHoveredRating(0)}
							onClick={() => handleStarClick(star)}
							disabled={disabled || isSubmitting}
						>
							<StarComponent
								className={`size-6 ${
									isFilled
										? "text-yellow-500"
										: "text-gray-300 hover:text-yellow-400"
								}`}
								aria-hidden="true"
							/>
						</button>
					);
				})}
			</div>

			{(averageRating > 0 || totalRatings > 0) && (
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<span>{averageRating.toFixed(1)} / 5.0</span>
					<span>•</span>
					<span>
						{totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
					</span>
				</div>
			)}

			{selectedRating > 0 && selectedRating !== currentRating && (
				<div className="text-sm text-green-600">
					{currentRating === 0 ? "Rating submitted!" : "Rating updated!"}
				</div>
			)}
		</div>
	);
}
