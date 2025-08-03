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
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { LearnerTrack, Track, User } from "@/db/schema";
import { ArrowUpDown } from "lucide-react";
import { LearnerTableActions } from "./learner-table-actions";

interface LearnersTableProps {
	data: {
		user: User | null;
		track: Track;
		learner_track: LearnerTrack | null;
	}[];
}

export function LearnersTable({ data }: LearnersTableProps) {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const columns: ColumnDef<(typeof data)[number]>[] = [
		{
			id: "learner",
			accessorFn: (row) => row.user?.name,
			header: "Learner",
			cell: ({ row }) => {
				const learner = row.original.user;
				return (
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={learner?.image ? learner?.image : undefined}
								alt={learner?.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full">
								{learner?.name
									? learner?.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
						<span>{learner?.name}</span>
					</div>
				);
			},
			filterFn: (row, _, filterValue) => {
				const learner = row.original.user;
				if (!learner || !learner.name) return false;
				return learner.name
					.toLowerCase()
					.includes(String(filterValue).toLowerCase());
			},
		},
		{
			id: "track",
			accessorFn: (row) => row.track?.name,
			header: "Track",
			cell: ({ row }) => row.original.track.name,
		},
		{
			id: "dateJoined",
			accessorFn: (row) => row.user?.createdAt,
			header: "Date Joined",
			cell: ({ row }) => {
				const learner_track = row.original.learner_track;
				return (
					<span>
						{learner_track?.createdAt
							? new Date(learner_track?.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})
							: "—"}
					</span>
				);
			},
		},
		{
			id: "amount",
			accessorFn: (row) => row.track?.price,
			header: "Amount",
			cell: ({ row }) => {
				const { price } = row.original.track;
				const amountNumber = parseFloat(price);
				return (
					<span>${!isNaN(amountNumber) ? amountNumber.toFixed(2) : price}</span>
				);
			},
			sortingFn: (rowA, rowB, _) => {
				const a = parseFloat(rowA.original.track.price);
				const b = parseFloat(rowB.original.track.price);
				if (isNaN(a) && isNaN(b)) return 0;
				if (isNaN(a)) return 1;
				if (isNaN(b)) return -1;
				return a - b;
			},
		},
		{
			id: "gender",
			accessorFn: (row) => row.user?.gender,
			header: "Gender",
			cell: ({ row }) => row.original.user?.gender || "Not specified",
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<LearnerTableActions
					user={row.original.user as User}
					track={row.original.track}
				/>
			),
		},
	];

	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
			sorting,
		},
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<div className="relative">
					<Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
					<Input
						placeholder="Search learners..."
						value={
							(table.getColumn("learner")?.getFilterValue() as string) || ""
						}
						onChange={(e) =>
							table.getColumn("learner")?.setFilterValue(e.target.value)
						}
						aria-label="Search learners"
						className="rounded-md pl-9 shadow-sm md:w-40 lg:w-[350px]"
					/>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										<Button
											variant="ghost"
											className="text-muted-foreground"
											onClick={() => header.column.toggleSorting()}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
											{header.column.getCanSort() && (
												<ArrowUpDown className="ml-2 h-4 w-4" />
											)}
										</Button>
									</TableHead>
								))}
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
			<div className="mt-4 flex items-center justify-between">
				{/* Previous Button */}
				<Button
					variant="outline"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ArrowLeft />
					Previous
				</Button>

				{/* Page Numbers */}
				<div className="flex items-center gap-1">
					{(() => {
						const pageCount = table.getPageCount();
						const currentPage = table.getState().pagination.pageIndex;
						const pageButtons = [];

						const createPageButton = (pageIdx: number) => (
							<Button
								key={pageIdx}
								size="sm"
								className={
									pageIdx === currentPage ? "bg-primary text-white" : ""
								}
								variant={pageIdx === currentPage ? "default" : "outline"}
								onClick={() => table.setPageIndex(pageIdx)}
								// disabled={pageIdx === currentPage}
							>
								{pageIdx + 1}
							</Button>
						);

						// Always show first page
						if (pageCount <= 7) {
							for (let i = 0; i < pageCount; i++) {
								pageButtons.push(createPageButton(i));
							}
						} else {
							pageButtons.push(createPageButton(0));
							// Left side ellipsis
							if (currentPage > 3) {
								pageButtons.push(
									<span
										key="start-ellipsis"
										className="text-muted-foreground px-2"
									>
										…
									</span>
								);
							}
							// Pages around current
							for (
								let i = Math.max(1, currentPage - 2);
								i <= Math.min(pageCount - 2, currentPage + 2);
								i++
							) {
								if (i !== 0 && i !== pageCount - 1)
									pageButtons.push(createPageButton(i));
							}
							// Right side ellipsis
							if (currentPage < pageCount - 4) {
								pageButtons.push(
									<span
										key="end-ellipsis"
										className="text-muted-foreground px-2"
									>
										…
									</span>
								);
							}
							// Always show last page
							pageButtons.push(createPageButton(pageCount - 1));
						}

						return pageButtons;
					})()}
				</div>

				{/* Next Button */}
				<Button
					variant="outline"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
					<ArrowRight />
				</Button>
			</div>
		</div>
	);
}
