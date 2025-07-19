import type { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import AuthBackdrop from "../../../assets/images/auth-backdrop.jpg";

export const metadata: Metadata = {
	title: "Admin Auth - E-Learning Platform",
	description: "Admin Auth For E-Learning Platform",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/admin/dashboard");
	}

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center">
			<Image
				src={AuthBackdrop}
				alt="Authentication Backdrop"
				className="object-fit absolute inset-0 hidden h-full w-full md:block"
				priority
			/>
			<div className="absolute inset-0 hidden bg-white/35 md:block"></div>
			<div className="relative z-10 w-[300px] md:w-[350px]">{children}</div>
		</div>
	);
}
