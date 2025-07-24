"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { TrackForm } from "./track-form";

interface TrackDialogProps {
	userId: string;
}

export function TrackDialog({ userId }: TrackDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => setOpen(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex w-48 items-center gap-2" size="lg">
					<IconPlus />
					Add Track
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						Add New Track
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-center">
						Fill in the details below to create a new track.
					</DialogDescription>
				</DialogHeader>
				<TrackForm userId={userId} onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
