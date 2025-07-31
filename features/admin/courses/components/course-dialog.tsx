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
import { useState } from "react";
import { CourseForm } from "./course-form";
import { Track, Course } from "@/db/schema";

interface CourseDialogProps {
	userId: string;
	trigger: React.ReactNode;
	tracks: Track[];
	course?: Course;
}

export function CourseDialog({
	userId,
	course,
	trigger,
	tracks,
}: CourseDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => setOpen(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						{course ? "Update" : "Add New"} Course
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-center">
						Fill in the details below to {course ? "update" : "create a new"}{" "}
						course.
					</DialogDescription>
				</DialogHeader>
				<CourseForm
					userId={userId}
					course={course}
					tracks={tracks}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
