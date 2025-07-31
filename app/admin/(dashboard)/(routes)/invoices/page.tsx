import { Heading } from "@/components/ui/heading";
import { InvoicesTable } from "@/features/admin/invoices/components/invoices-table";
import { getInvoicesWithLearner } from "@/features/admin/invoices/queries/invoices";
import { getLearners } from "@/features/admin/users/queries/users";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const invoicesWithLearner = await getInvoicesWithLearner(session.user.id);

	if ("error" in invoicesWithLearner) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load invoices. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{invoicesWithLearner.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	const learners = await getLearners();

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
					title="Manage Invoices"
					description="Filter, sort and access detailed invoices"
				/>
			</div>
			<div className="flex flex-col px-6 pt-6">
				<InvoicesTable
					data={invoicesWithLearner}
					userId={session.user.id}
					learners={learners}
				/>
			</div>
		</div>
	);
}
