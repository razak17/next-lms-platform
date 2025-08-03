"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice, User } from "@/db/schema";
import { IconPlus } from "@tabler/icons-react";
import { DataTable } from "../../shared/components/data-table";
import { InvoiceDialog } from "./invoice-dialog";
import { InvoiceTableActions } from "./invoice-table-actions";

interface InvoicesTableProps {
	data: (Invoice & { learner: User })[];
	userId: string;
	learners: User[];
}

export function InvoicesTable({ data, userId, learners }: InvoicesTableProps) {
	const columns: ColumnDef<Invoice & { learner: User }>[] = [
		{
			id: "learner",
			accessorFn: (row) => row.learner?.name,
			header: "Learner",
			cell: ({ row }) => {
				const { learner } = row.original;
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
						<span>{learner.name}</span>
					</div>
				);
			},
			filterFn: (row, _, filterValue) => {
				const {learner} = row.original;
				if (!learner || !learner.name) return false;
				return learner.name
					.toLowerCase()
					.includes(String(filterValue).toLowerCase());
			},
		},
		{
			id: "email",
			accessorFn: (row) => row.learner?.email,
			header: "Email",
			cell: ({ row }) => row.original.learner.email || "—",
		},
		{
			accessorKey: "dueDate",
			header: "Due Date",
			cell: ({ row }) => {
				const { dueDate } = row.original;
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
			header: "Amount",
			cell: ({ row }) => {
				const { amount } = row.original;
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
			header: "Status",
			cell: ({ row }) => {
				const { status } = row.original;
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

	return (
		<DataTable
			columns={columns}
			data={data}
			item="invoices"
			searchColumn="learner"
			addButton={
				<InvoiceDialog
					userId={userId}
					learners={learners}
					trigger={
						<Button className="flex w-48 items-center gap-2">
							<IconPlus />
							Add Invoice
						</Button>
					}
				/>
			}
		/>
	);
}
