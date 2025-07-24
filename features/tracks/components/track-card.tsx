import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Course, Track } from "@/db/schema";
import { Calendar } from "lucide-react";
import Image from "next/image";

const courseColorClasses = [
	{ bg: "bg-blue-100", text: "text-blue-800" },
	{ bg: "bg-green-100", text: "text-green-800" },
	{ bg: "bg-yellow-100", text: "text-yellow-800" },
	{ bg: "bg-purple-100", text: "text-purple-800" },
	{ bg: "bg-pink-100", text: "text-pink-800" },
	{ bg: "bg-indigo-100", text: "text-indigo-800" },
	{ bg: "bg-red-100", text: "text-red-800" },
];

export function TrackCard({
	track,
	// courses,
}: {
	track: Track;
	// courses: Course[];
}) {
	return (
		<Card className="@container/card gap-0 p-0">
			<div className="relative">
				<Image
					src={(track.image?.url as string) || ""}
					alt={track.name}
          width={400}
          height={200}
          loading="lazy"
					className="h-40 w-full rounded-t-lg object-cover"
				/>
				<div className="bg-secondary text-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold">
					${track.price}
				</div>
			</div>
			<CardContent className="flex flex-col items-start gap-2 p-4">
				<CardTitle className="text-lg font-semibold">{track.name}</CardTitle>
				<div className="flex items-center gap-2 text-sm">
					<Calendar size={16} />
					<span className="text-muted-foreground">{track.duration}</span>
				</div>
				<div className="mt-2 flex flex-wrap gap-1">
					{/* {courses?.map((course, courseIndex) => { */}
					{/* 	const randomColorIndex = Math.floor( */}
					{/* 		Math.random() * courseColorClasses.length */}
					{/* 	); */}
					{/* 	const color = courseColorClasses[randomColorIndex]; */}
					{/* 	return ( */}
					{/* 		<span */}
					{/* 			key={courseIndex} */}
					{/* 			className={`${color.bg} ${color.text} rounded-full px-4 py-2 text-xs font-medium`} */}
					{/* 		> */}
					{/* 			{course.title} */}
					{/* 		</span> */}
					{/* 	); */}
					{/* })} */}
				</div>
			</CardContent>
		</Card>
	);
}
