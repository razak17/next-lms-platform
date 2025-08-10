import type { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Computer from "@/assets/images/computer.png";
import { redirects } from "@/lib/constants";

export const metadata: Metadata = {
	title: "Learner Auth - E-Learning Platform",
	description: "Learner Auth For E-Learning Platform",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session && session.user.role === "admin") {
		redirect(redirects.adminToDashboard);
	} else if (session && session.user.role !== "admin") {
		redirect(redirects.toDashboard);
	}

	return (
		<div className="relative flex w-full flex-col items-center justify-center">
			<div className="flex items-center gap-4 py-8 lg:mx-auto lg:w-2xl">
				<div className="w-full">
					<Image
						src={Computer}
						alt="Computer Backdrop"
						className="object-fit inset-0 hidden h-full w-full md:block"
						priority
					/>
				</div>
				<div className="w-full">{children}</div>
			</div>
		</div>
	);
}
