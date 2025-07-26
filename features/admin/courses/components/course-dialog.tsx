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
import { CourseForm } from "./course-form";
import { Track } from "@/db/schema";

interface CourseDialogProps {
	userId: string;
	tracks: Track[];
}

export function CourseDialog({ userId, tracks }: CourseDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => setOpen(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex w-48 items-center gap-2" size="lg">
					<IconPlus />
					Add Course
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						Add New Course
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-center">
						Fill in the details below to create a new course.
					</DialogDescription>
				</DialogHeader>
				<CourseForm userId={userId} tracks={tracks} onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
