import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { UserProfileDetails } from "@/features/admin/users/components/user-profile-details";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/db/schema";
import { getUserByEmail } from "@/features/admin/users/queries/users";

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const user = await getUserByEmail(session.user.email);

	if (!user) {
		redirect(redirects.adminToLogin);
	}

	if ("error" in user) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load user. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{user.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Profile"
					description="Update your profile information and preferences"
				/>
			</div>
			<div className="flex flex-col px-6 pt-6">
				<UserProfileDetails user={user} />
			</div>
		</div>
	);
}
