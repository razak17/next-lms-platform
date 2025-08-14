import { cn } from "@/lib/utils";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface RatingProps {
	rating: number;
  filledClassName?: string;
  emptyClassName?: string;
}

export function Rating({ rating, filledClassName, emptyClassName }: RatingProps) {
	const filledStars = Math.round(rating);
	const emptyStars = 5 - filledStars;
	return (
		<div className="flex items-center space-x-1">
			{Array.from({ length: filledStars }).map((_, i) => (
				<StarFilledIcon
					key={i}
					className={cn(
						"size-6 text-yellow-500",
						filledClassName
					)}
					aria-hidden="true"
				/>
			))}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<StarIcon
					key={i}
					className={cn(
						"text-foreground size-6",
						emptyClassName
					)}
					aria-hidden="true"
				/>
			))}
		</div>
	);
}
