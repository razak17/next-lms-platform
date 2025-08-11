import { StarFilledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

interface RatingProps {
	rating: number;
}

export function Rating({ rating }: RatingProps) {
	return (
		<div className="flex items-center space-x-1">
			{Array.from({ length: 5 }).map((_, i) => (
				<StarFilledIcon
					key={i}
					className={cn(
						"size-6",
						rating >= i + 1 ? "text-yellow-500" : "text-foreground"
					)}
					aria-hidden="true"
				/>
			))}
		</div>
	);
}
