import { siteConfig } from "@/data/site";
import { MainNav } from "@/features/learner/shared/layouts/main-nav";
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
		<div className="@container/main flex flex-1 flex-col">
			<header className="bg-background sticky top-0 z-50 w-full border-b">
				<div className="flex h-16 items-center">
					<MainNav items={siteConfig.mainNav} />
				</div>
			</header>
			<div className="flex-1">{children}</div>
		</div>
	);
}
