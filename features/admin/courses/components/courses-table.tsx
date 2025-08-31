"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Course, Track } from "@/db/schema";
import { IconPlus } from "@tabler/icons-react";
import { DataTable } from "../../shared/components/data-table";
import { CourseDialog } from "./course-dialog";
import { CourseTableActions } from "./course-table-actions";
import { formatDate } from "@/lib/utils";

interface CoursesTableProps {
	data: (Course & { track: Track })[];
	tracks: Track[];
}

export function CoursesTable({ data, tracks }: CoursesTableProps) {
	const columns: ColumnDef<Course & { track: Track }>[] = [
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => {
				const { image, title } = row.original;
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-10 w-10 rounded-full">
							<AvatarImage src={image?.url} alt={title} />
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full">
								{title
									? title
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "C"}
							</AvatarFallback>
						</Avatar>
						{title}
					</div>
				);
			},
		},
		{
			accessorKey: "track",
			header: "Track",
			cell: ({ row }) => row.original.track?.name || "—",
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => {
				const { createdAt } = row.original;
				return <span>{createdAt ? formatDate(createdAt) : "—"}</span>;
			},
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<CourseTableActions course={row.original} tracks={tracks} />
			),
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			item="courses"
			searchColumn="title"
			addButton={
				<CourseDialog
					tracks={tracks}
					trigger={
						<Button className="flex w-48 items-center gap-2">
							<IconPlus className="size-4" />
							Add Course
						</Button>
					}
				/>
			}
		/>
	);
}
