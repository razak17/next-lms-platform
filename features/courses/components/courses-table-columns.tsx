"use client";

import { Button } from "@/components/ui/button";
import { Course, Track } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export const coursesTableColumns: ColumnDef<Course & { track: Track }>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "track",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Tracks
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const track = row.getValue("track") as Track;

			return <div>{track.name}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Created At
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const track = row.getValue("track") as Track;

			return (
				<div className="text-muted-foreground text-sm">
					{new Date(track.createdAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { id } = row.original;

			return (
					<div className="flex gap-2">
						<Link href={`/admin/courses/${id}`} className="text-blue-600 hover:text-blue-800">
							<Pencil className="h-4 w-4" />
						</Link>
						<Button variant="ghost" className="h-4 w-8 p-0 text-red-700 hover:bg-red-100">
							<Trash2 />
						</Button>
					</div>
			);
		},
	},
];
