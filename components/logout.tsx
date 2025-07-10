"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Logout() {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut();
		router.refresh(); // Forces a re-fetch of server components, including the layout's session check
	};

	return (
		<Button variant="outline" onClick={handleLogout}>
			Logout <LogOut className="size-4" />
		</Button>
	);
}
