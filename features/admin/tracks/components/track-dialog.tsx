"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Track } from "@/db/schema";
import { useState } from "react";
import { TrackForm } from "./track-form";

interface TrackDialogProps {
	userId: string;
	trigger: React.ReactNode;
	track?: Track;
}

export function TrackDialog({ userId, trigger, track }: TrackDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => setOpen(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						Add New Track
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-center">
						Fill in the details below to create a new track.
					</DialogDescription>
				</DialogHeader>
				<TrackForm userId={userId} track={track} onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
