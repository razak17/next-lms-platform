import { User } from "@/db/schema";
import { SiteFooter } from "@/features/learner/landing/components/site-footer";
import { SiteHeader } from "@/features/learner/landing/components/site-header";
import { auth } from "@/lib/auth/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import React from "react";

export const metadata: Metadata = {
	title: "G-Client - E-Learning Platform",
	description: "E-Learning Platform",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="@container/main flex min-h-screen flex-1 flex-col">
			<SiteHeader user={session?.user ? (session.user as User) : null} />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
