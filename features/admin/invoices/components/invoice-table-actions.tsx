"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Course, Track } from "@/db/schema";
import { IconPlus } from "@tabler/icons-react";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { CourseDialog } from "./course-dialog";
import { CourseTableActions } from "./course-table-actions";

interface CoursesTableProps {
	data: (Course & { track: Track })[];
	userId: string;
	tracks: Track[];
}

export function CoursesTable({ data, userId, tracks }: CoursesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const columns: ColumnDef<Course & { track: Track }>[] = [
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
				const createdAt = row.getValue("createdAt") as
					| string
					| Date
					| undefined;
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
			cell: ({ row }) => (
				<CourseTableActions
					userId={userId}
					course={row.original}
					tracks={tracks}
				/>
			),
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div>
			<div className="flex items-center justify-between py-4">
				<div className="relative">
					<Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
					<Input
						placeholder="Search courses..."
						value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("title")?.setFilterValue(event.target.value)
						}
						className="rounded-md pl-9 shadow-sm md:w-40 lg:w-[350px]"
					/>
				</div>
				<CourseDialog
					userId={userId}
					tracks={tracks}
					trigger={
						<Button className="flex w-48 items-center gap-2" size="lg">
							<IconPlus />
							Add Course
						</Button>
					}
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-5">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

