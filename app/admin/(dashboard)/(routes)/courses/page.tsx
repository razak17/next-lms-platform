import { SearchInput } from "@/components/search-input";
import { Heading } from "@/components/ui/heading";
import { CourseDialog } from "@/features/courses/components/course-dialog";
import { getCourses } from "@/features/courses/queries/courses";
import { getTracks } from "@/features/tracks/queries/tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface CoursePageProps {
	searchParams: Promise<{ title?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursePageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const { title } = await searchParams;

	const courses = await getCourses(session.user.id);

  const tracks = await getTracks(session.user.id);

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Courses"
					description="Create, edit, and manage your courses effectively"
				/>
			</div>
			<div className="flex justify-between px-6 pt-6">
				<SearchInput placeholder="Search Course" />
				<CourseDialog userId={session.user.id} tracks={tracks} />
			</div>
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
					{"length" in courses && courses.length === 0 && (
						<div className="text-muted-foreground col-span-full text-center">
							No courses found. Please create a new course.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
