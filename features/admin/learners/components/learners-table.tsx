"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/db/schema";
import { DataTable } from "../../shared/components/data-table";
import { LearnerTableActions } from "./learner-table-actions";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LearnersTableProps {
	data: {
		user: User;
		enrolledTracks: Array<{ id: string | null; name: string | null }>;
		totalPurchases: number;
		totalPurchaseAmount: number;
	}[];
}

export function LearnersTable({ data }: LearnersTableProps) {
	const columns: ColumnDef<(typeof data)[number]>[] = [
		{
			id: "learner",
			accessorFn: (row) => row.user.name,
			header: "Learner",
			cell: ({ row }) => {
				const learner = row.original.user;
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-10 w-10 rounded-full">
							<AvatarImage
								src={learner.image ? learner.image : undefined}
								alt={learner.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full">
								{learner.name
									? learner.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "L"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="font-medium">{learner.name}</span>
							<span className="text-muted-foreground text-xs">
								{learner.email}
							</span>
						</div>
					</div>
				);
			},
			filterFn: (row, _, filterValue) => {
				const learner = row.original.user;
				return learner.name
					.toLowerCase()
					.includes(String(filterValue).toLowerCase());
			},
		},
		{
			id: "enrolledTracks",
			accessorFn: (row) =>
				row.enrolledTracks
					?.filter((t) => t.name)
					.map((t) => t.name)
					.join(", "),
			header: "Enrolled Tracks",
			cell: ({ row }) => {
				const tracks = row.original.enrolledTracks?.filter(
					(t) => t.id && t.name
				);
				if (!tracks || tracks.length === 0) {
					return <span className="text-muted-foreground">No enrollments</span>;
				}
				return (
					<div className="flex flex-wrap gap-1">
						{tracks.slice(0, 1).map((track, index) => (
							<Badge
								key={track.id || index}
								variant="secondary"
								className="text-xs"
							>
								{track.name}
							</Badge>
						))}
						{tracks.length > 1 && (
							<Badge variant="outline" className="text-xs">
								+{tracks.length - 1} more
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			id: "dateJoined",
			accessorFn: (row) => row.user.createdAt,
			header: "Date Joined",
			cell: ({ row }) => {
				const learner = row.original.user;
				return (
					<span>{learner.createdAt ? formatDate(learner.createdAt) : "—"}</span>
				);
			},
		},
		{
			id: "totalPurchases",
			accessorFn: (row) => row.totalPurchases,
			header: "Total Purchases",
			cell: ({ row }) => {
				const { totalPurchases, totalPurchaseAmount } = row.original;
				return (
					<div className="flex flex-col">
						<span className="font-medium">{totalPurchases} purchases</span>
						<span className="text-muted-foreground text-xs">
							{formatPrice(totalPurchaseAmount / 100)}
						</span>
					</div>
				);
			},
			sortingFn: (rowA, rowB, _) => {
				return rowA.original.totalPurchases - rowB.original.totalPurchases;
			},
		},
		{
			id: "gender",
			accessorFn: (row) => row.user.gender,
			header: "Gender",
			cell: ({ row }) => {
				const gender = row.original.user.gender;
				return <span className="capitalize">{gender || "Not Specified"}</span>;
			},
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<LearnerTableActions
					user={row.original.user}
					enrolledTracks={row.original.enrolledTracks}
					totalPurchases={row.original.totalPurchases}
					totalPurchaseAmount={row.original.totalPurchaseAmount}
				/>
			),
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			item="learners"
			searchColumn="learner"
			className="justify-end"
		/>
	);
}
