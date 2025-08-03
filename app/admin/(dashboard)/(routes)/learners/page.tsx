import { Heading } from "@/components/ui/heading";
import { LearnersTable } from "@/features/admin/learners/components/learners-table";
import { getAllLearnersTracks } from "@/features/admin/learners/queries/learner-tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LearnersPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const learners = await getAllLearnersTracks(session.user.id);

	if ("error" in learners) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load learners. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{learners.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Learners"
					description="Filter, sort and access detailed learners"
				/>
			</div>
			<div className="flex flex-col px-6 pt-6">
				<LearnersTable data={learners} />
			</div>
		</div>
	);
}
