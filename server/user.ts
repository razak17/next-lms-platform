import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getCurrentUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(user.id, session.user.id),
	});

	if (!currentUser) {
		redirect("/login");
	}

	return {
		...session,
		currentUser,
	};
};
