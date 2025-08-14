"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Purchase, User } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { Eye, RefreshCcw } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../shared/components/data-table";
import { InvoiceDialog } from "./invoice-dialog";
import { InvoiceInfoDialog } from "./invoice-info-dialog";
import { RefundDialog } from "./refund-dialog";

interface InvoicesTableProps {
	data: {
		user: User | null;
		purchase: Purchase;
	}[];
	userId: string;
	learners: User[];
}

export function InvoicesTable({ data, userId, learners }: InvoicesTableProps) {
	const columns: ColumnDef<{
		user: User | null;
		purchase: Purchase;
	}>[] = [
		{
			id: "user",
			accessorFn: (row) => row.user?.name,
			header: "Learner",
			cell: ({ row }) => {
				const { user } = row.original;
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-10 w-10 rounded-full">
							<AvatarImage
								src={user?.image ? user?.image : undefined}
								alt={user?.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full">
								{user?.name
									? user?.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
						<span>{user?.name}</span>
					</div>
				);
			},
			filterFn: (row, _, filterValue) => {
				const { user } = row.original;
				if (!user || !user.name) return false;
				return user.name
					.toLowerCase()
					.includes(String(filterValue).toLowerCase());
			},
		},
		{
			id: "email",
			accessorFn: (row) => row.user?.email,
			header: "Email",
			cell: ({ row }) => row.original.user?.email || "—",
		},
		{
			accessorKey: "date",
			header: "Date",
			cell: ({ row }) => {
				const { createdAt } = row.original.purchase;
				return <span>{createdAt ? formatDate(createdAt) : "—"}</span>;
			},
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) => {
				const { pricePaidInCents } = row.original.purchase;
				return (
					<span>
						{pricePaidInCents ? formatPrice(pricePaidInCents / 100) : "—"}
					</span>
				);
			},
			sortingFn: (rowA, rowB, _) => {
				const a = rowA.original.purchase.pricePaidInCents;
				const b = rowB.original.purchase.pricePaidInCents;
				return a - b;
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const { refundedAt } = row.original.purchase;
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
			header: "",
			cell: ({ row }) => {
				const { purchase } = row.original;
				const isRefunded = !!purchase.refundedAt;

				return (
					<div className="flex items-center gap-2">
						<InvoiceInfoDialog
							data={row.original}
							trigger={
								<Button
									variant="ghost"
									size="sm"
									className="flex h-8 items-center gap-1.5 px-3"
								>
									<Eye className="h-4 w-4" />
									View
								</Button>
							}
						/>
						{!isRefunded && (
							<RefundDialog
								data={row.original}
								trigger={
									<Button
										variant="ghost"
										size="sm"
										className="flex h-8 items-center gap-1.5 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
									>
										<RefreshCcw className="h-4 w-4" />
										Refund
									</Button>
								}
							/>
						)}
					</div>
				);
			},
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			item="invoices"
			searchColumn="user"
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
