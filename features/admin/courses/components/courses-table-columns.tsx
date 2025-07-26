"use client";

import { Button } from "@/components/ui/button";
import { Course, Track } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CourseTableActions } from "./course-table-actions";
import Image from "next/image";
import { StoredFile } from "@/types";

export const coursesTableColumns: ColumnDef<Course & { track: Track }>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="text-muted-foreground"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Title
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const { image, title } = row.original as Course & { track: Track };

			return (
				<div className="flex items-center gap-2">
					<Image
						src={image?.url || "/placeholders/placeholder-md.jpg"}
						alt={title}
						width={40}
						height={40}
						className="h-10 w-10 rounded-full object-cover"
					/>
					{title}
				</div>
			);
		},
	},
	{
		accessorKey: "track",
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="text-muted-foreground"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Tracks
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const track = row.getValue("track") as Track | undefined;
			return <div>{track?.name || "—"}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="text-muted-foreground"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Created At
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const createdAt = row.getValue("createdAt") as string | Date | undefined;
			return (
				<div className="text-sm">
					{createdAt
						? new Date(createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})
						: "—"}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <CourseTableActions course={row.original} />,
	},
];
