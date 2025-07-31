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
import { Invoice, User } from "@/db/schema";
import { IconPlus } from "@tabler/icons-react";
import { ArrowUpDown } from "lucide-react";
import { InvoiceDialog } from "./invoice-dialog";
import { InvoiceTableActions } from "./invoice-table-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface InvoicesTableProps {
	data: (Invoice & { learner: User })[];
	userId: string;
	learners: User[];
}

export function InvoicesTable({ data, userId, learners }: InvoicesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const columns: ColumnDef<Invoice & { learner: User }>[] = [
		{
			id: "learner",
			accessorFn: (row) => row.learner?.name,
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-muted-foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Learner
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const { learner } = row.original as Invoice & { learner: User };
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 rounded-full grayscale">
							<AvatarImage
								src={learner?.image ? learner?.image : undefined}
								alt={learner?.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full">
								{learner.name
									? learner.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
						{learner?.name}
					</div>
				);
			},
			filterFn: (row, _, filterValue) => {
				const learner = row.original.learner;
				if (!learner || !learner.name) return false;
				return learner.name
					.toLowerCase()
					.includes(String(filterValue).toLowerCase());
			},
			sortingFn: (rowA, rowB, columnId) => {
				const a = rowA.getValue(columnId) as string;
				const b = rowB.getValue(columnId) as string;
				if (a === b) return 0;
				return a < b ? -1 : 1;
			},
		},
		{
			id: "email",
			accessorFn: (row) => row.learner?.email,
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-muted-foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email Address
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const { learner } = row.original as Invoice & { learner: User };
				return <span>{learner.email}</span>;
			},
		},
		{
			accessorKey: "dueDate",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-muted-foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Due Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const { dueDate } = row.original as Invoice & { learner: User };
				return (
					<span>
						{dueDate
							? new Date(dueDate).toLocaleDateString("en-US", {
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
			accessorKey: "amount",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-muted-foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Amount
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const { amount } = row.original as Invoice & { learner: User };
				const amountNumber = parseFloat(amount);
				return (
					<span>
						${!isNaN(amountNumber) ? amountNumber.toFixed(2) : amount}
					</span>
				);
			},
			sortingFn: (rowA, rowB, columnId) => {
				const a = parseFloat(rowA.getValue(columnId));
				const b = parseFloat(rowB.getValue(columnId));
				if (isNaN(a) && isNaN(b)) return 0;
				if (isNaN(a)) return 1;
				if (isNaN(b)) return -1;
				return a - b;
			},
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-muted-foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const { status } = row.original as Invoice & { learner: User };
				const statusColors = {
					paid: "green",
					pending: "gray",
					overdue: "red",
				};
				return (
					<Badge
						className={`text-${statusColors[status]}-500 bg-${statusColors[status]}-100 rounded-full font-medium`}
					>
						{status ? (
							<>{status?.charAt(0).toUpperCase() + status?.slice(1)}</>
						) : (
							"-"
						)}
					</Badge>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<InvoiceTableActions
					userId={userId}
					invoice={row.original}
					learners={learners}
				/>
			),
		},
	];

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="relative">
					<Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
					<Input
						placeholder="Search invoices..."
						value={
							(table.getColumn("learner")?.getFilterValue() as string) || ""
						}
						onChange={(e) =>
							table.getColumn("learner")?.setFilterValue(e.target.value)
						}
						aria-label="Search invoices"
						className="rounded-md pl-9 shadow-sm md:w-40 lg:w-[350px]"
					/>
				</div>
				<InvoiceDialog
					userId={userId}
					learners={learners}
					trigger={
						<Button className="flex w-48 items-center gap-2" size="lg">
							<IconPlus />
							Add Invoice
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
			<div className="mt-4 flex items-center justify-between">
				{/* Items Per Page */}
				{/* <div className="flex items-center gap-2"> */}
				{/* 	<span className="text-muted-foreground text-sm">Items per page:</span> */}
				{/* 	<select */}
				{/* 		value={table.getState().pagination.pageSize} */}
				{/* 		onChange={(e) => table.setPageSize(Number(e.target.value))} */}
				{/* 		className="rounded border px-2 py-1 text-sm" */}
				{/* 		aria-label="Items per page" */}
				{/* 	> */}
				{/* 		{[10, 20, 50, 100].map((size) => ( */}
				{/* 			<option key={size} value={size}> */}
				{/* 				{size} */}
				{/* 			</option> */}
				{/* 		))} */}
				{/* 	</select> */}
				{/* </div> */}

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
