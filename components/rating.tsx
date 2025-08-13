import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface RatingProps {
	rating: number;
}

export function Rating({ rating }: RatingProps) {
	const filledStars = Math.round(rating);
	const emptyStars = 5 - filledStars;
	return (
		<div className="flex items-center space-x-1">
			{Array.from({ length: filledStars }).map((_, i) => (
				<StarFilledIcon
					key={i}
					className="size-6 text-yellow-500"
					aria-hidden="true"
				/>
			))}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<StarIcon
					key={i}
					className="text-foreground size-6"
					aria-hidden="true"
				/>
			))}
		</div>
	);
}
