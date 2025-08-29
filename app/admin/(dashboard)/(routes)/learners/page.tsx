import { Heading } from "@/components/ui/heading";
import { LearnersTable } from "@/features/admin/learners/components/learners-table";
import { getAllLearnersAggregated } from "@/features/admin/learners/queries/learner-tracks";
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

	const learnersResult = await getAllLearnersAggregated();

	if ("error" in learnersResult) {
		throw new Error(learnersResult.error);
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
				<LearnersTable data={learnersResult} />
			</div>
		</div>
	);
}
