import { Heading } from "@/components/ui/heading";
import { InvoicesTable } from "@/features/admin/invoices/components/invoices-table";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import {
	desc,
	eq,
} from "drizzle-orm";
import { track, user, purchase } from "@/db/schema";

export default async function InvoicesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const [invoicesWithLearner, learners] = await Promise.all([
		getPurchases(session.user.id),
		getLearners(),
	]);

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

async function getPurchases(adminUserId: string) {
	const results = await db
		.select()
		.from(purchase)
		.leftJoin(user, eq(purchase.userId, user.id))
		.leftJoin(track, eq(purchase.trackId, track.id))
		.where(eq(track.userId, adminUserId))
		.orderBy(desc(purchase.createdAt));

	return results;
}

export async function getLearners() {
	const results = await db
		.select()
		.from(user)
		.where(eq(user.role, "learner"))
		.orderBy(desc(user.createdAt));
	return results;
}
