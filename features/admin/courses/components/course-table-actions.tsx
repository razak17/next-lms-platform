import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Course, Track } from "@/db/schema";
import { deleteCourse } from "@/features/admin/courses/actions/courses";
import { Pencil, Trash2 } from "lucide-react";
import { CourseDialog } from "./course-dialog";

export function CourseTableActions({
	userId,
	course,
	tracks,
}: {
	userId: string;
	course: Course;
	tracks: Track[];
}) {
	return (
		<div className="flex gap-2">
			<CourseDialog
				userId={userId}
				tracks={tracks}
				course={course}
				trigger={
					<Button
						variant="ghost"
						className="h-4 w-8 p-4 text-blue-600 hover:bg-blue-100"
					>
						<Pencil />
					</Button>
				}
			/>
			<ConfirmDialog onConfirm={deleteCourse.bind(null, course.id)}>
				<Button
					variant="ghost"
					className="h-4 w-8 p-4 text-red-700 hover:bg-red-100"
				>
					<Trash2 />
				</Button>
			</ConfirmDialog>
		</div>
	);
}
