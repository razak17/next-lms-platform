import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCourse } from "@/features/courses/actions/courses";
import { Course } from "@/db/schema";

export function CourseTableActions({ course }: { course: Course }) {
	return (
		<div className="flex gap-2">
			<Link
				href={`/admin/courses/${course.id}`}
				className="text-blue-600 hover:text-blue-800"
			>
				<Pencil className="h-4 w-4" />
			</Link>
			<ConfirmDialog onConfirm={deleteCourse.bind(null, course.id)}>
				<Button
					variant="ghost"
					className="h-4 w-8 p-0 text-red-700 hover:bg-red-100"
				>
					<Trash2 />
				</Button>
			</ConfirmDialog>
		</div>
	);
}
