"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Purchase, Track } from "@/db/schema";
import { Eye } from "lucide-react";
import { DataTable } from "@/features/admin/shared/components/data-table";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface PurchasesTableProps {
	data: (Purchase & { track: Track })[];
}

export function PurchasesTable({ data }: PurchasesTableProps) {
	const columns: ColumnDef<Purchase & { track: Track }>[] = [
		{
			accessorKey: "trackDetails",
			header: "Track",
			cell: ({ row }) => {
				const { trackDetails } = row.original;
				return trackDetails.name;
			},
			filterFn: (row, _, filterValue) => {
				const { trackDetails } = row.original;
				return trackDetails.name
					.toLowerCase()
					.includes(String(filterValue).toLowerCase());
			},
		},
		{
			accessorKey: "pricePaidInCents",
			header: "Amount",
			cell: ({ row }) => {
				const amount = row.original.pricePaidInCents;
				return formatPrice(amount / 100);
			},
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.pricePaidInCents;
				const b = rowB.original.pricePaidInCents;
				return a - b;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Purchase Date",
			cell: ({ row }) => {
				const { createdAt } = row.original;
				return <span>{formatDate(createdAt)}</span>;
			},
		},
		{
			accessorKey: "refundedAt",
			header: "Status",
			cell: ({ row }) => {
				const { refundedAt } = row.original;
				return (
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
							refundedAt
								? "bg-red-100 text-red-800"
								: "bg-green-100 text-green-800"
						}`}
					>
						{refundedAt ? "Refunded" : "Paid"}
					</span>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<Link href={`/dashboard/purchases/${row.original.id}`}>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<Eye className="h-4 w-4" />
						View
					</Button>
				</Link>
			),
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			item="purchases"
			searchColumn="trackDetails"
			className="justify-end"
		/>
	);
}
