import { Logout } from "@/components/logout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminDashbordPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div>
			<h1>
				Welcome, {session?.user.name} {session?.user.role}
			</h1>
			<Logout />
		</div>
	);
}
