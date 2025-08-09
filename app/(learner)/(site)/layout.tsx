import { SiteFooter } from "@/features/learner/landing/components/site-footer";
import { SiteHeader } from "@/features/learner/landing/components/site-header";
import type { Metadata } from "next";
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
	return (
		<div className="@container/main min-h-screen flex flex-1 flex-col">
			<SiteHeader />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
