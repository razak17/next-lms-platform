import { Heading } from "@/components/ui/heading";
import { CoursesTable } from "@/features/admin/courses/components/courses-table";
import { getCoursesWithTrack } from "@/features/admin/courses/queries/courses";
import { getTracks } from "@/features/admin/tracks/queries/tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const coursesWithTrack = await getCoursesWithTrack(session.user.id);

	if ("error" in coursesWithTrack) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load courses. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{coursesWithTrack.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	const tracks = await getTracks(session.user.id);

	if ("error" in tracks) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load tracks. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{tracks.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Courses"
					description="Create, edit, and manage your courses effectively"
				/>
			</div>
			<div className="flex flex-col gap-4 py-2 md:gap-6">
				<div className="px-6">
					<CoursesTable
						data={coursesWithTrack}
						userId={session.user.id}
						tracks={tracks}
					/>
				</div>
			</div>
		</div>
	);
}
