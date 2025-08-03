"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LearnerTrack, Track, User } from "@/db/schema";
import { DataTable } from "../../shared/components/data-table";
import { LearnerTableActions } from "./learner-table-actions";

interface LearnersTableProps {
	data: {
		user: User | null;
		track: Track;
		learner_track: LearnerTrack | null;
	}[];
}

export function LearnersTable({ data }: LearnersTableProps) {
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
