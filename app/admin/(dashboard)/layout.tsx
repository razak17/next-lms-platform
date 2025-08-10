import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { User } from "@/db/schema/user";
import { SiteHeader } from "@/features/admin/overview/components/site-header";
import { AdminSidebar } from "@/features/admin/shared/components/admin-sidebar";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
	title: "Admin Dashboard - E-Learning Platform",
	description: "Admin Dashboard For E-Learning Platform",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	if (session.user.role !== "admin") {
		redirect(redirects.toLanding);
	}

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AdminSidebar user={session.user as User} variant="inset" />
			<SidebarInset>
				<SiteHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
