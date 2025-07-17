import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TrackCardItem } from "@/types";
import { Calendar } from "lucide-react";
import Image from "next/image";

interface TracksCardsProps {
	tracksCardData?: TrackCardItem[];
}

const skillColorClasses = [
	{ bg: "bg-blue-100", text: "text-blue-800" },
	{ bg: "bg-green-100", text: "text-green-800" },
	{ bg: "bg-yellow-100", text: "text-yellow-800" },
	{ bg: "bg-purple-100", text: "text-purple-800" },
	{ bg: "bg-pink-100", text: "text-pink-800" },
	{ bg: "bg-indigo-100", text: "text-indigo-800" },
	{ bg: "bg-red-100", text: "text-red-800" },
];

export function TracksCards({ tracksCardData }: TracksCardsProps) {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{tracksCardData?.map((card, index) => (
				<Card key={index} className="@container/card gap-0 p-0">
					<div className="relative">
						<Image
							src={card.image}
							alt={card.title}
							className="h-40 w-full rounded-t-lg object-cover"
						/>
						<div className="bg-secondary text-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold">
							${card.price}
						</div>
					</div>
					<CardContent className="flex flex-col items-start gap-2 p-4">
						<CardTitle className="text-lg font-semibold">
							{card.title}
						</CardTitle>
						<div className="flex items-center gap-2 text-sm">
							<Calendar size={16} />
							<span className="text-muted-foreground">{card.duration}</span>
						</div>
						<div className="mt-2 flex flex-wrap gap-1">
							{card.skills?.map((skill, skillIndex) => {
								const randomColorIndex = Math.floor(
									Math.random() * skillColorClasses.length
								);
								const color = skillColorClasses[randomColorIndex];
								return (
									<span
										key={skillIndex}
										className={`${color.bg} ${color.text} rounded-full px-4 py-2 text-xs font-medium`}
									>
										{skill}
									</span>
								);
							})}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
