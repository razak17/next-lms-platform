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
import { ArrowLeft, ArrowRight, ArrowUpDown, Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

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

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	item: string;
	searchColumn?: string;
	addButton?: React.ReactNode;
	className?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	item,
	searchColumn = "name",
	addButton,
	className = "",
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

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
		<div className="space-y-4">
			<div className={cn("flex items-center justify-between", className)}>
				<div className="relative">
					<Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
					<Input
						placeholder={`Search ${item}...`}
						value={
							(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
						}
						onChange={(e) =>
							table.getColumn(searchColumn)?.setFilterValue(e.target.value)
						}
						aria-label={`Search ${item}`}
						className="rounded-md pl-9 shadow-sm md:w-40 lg:w-[350px]"
					/>
				</div>
				{addButton && <div className="flex items-center">{addButton}</div>}
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
					variant="ghost"
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
								disabled={pageIdx === currentPage}
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
					variant="ghost"
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
