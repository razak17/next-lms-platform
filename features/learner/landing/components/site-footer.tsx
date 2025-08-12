"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { siteConfig } from "@/data/site";
import Link from "next/link";

export function SiteFooter() {
	return (
		<footer className="bg-sidebar border-t px-4 text-center text-white">
			<div className="flex flex-col px-4 lg:mx-auto lg:w-6xl">
				<div className="flex flex-col gap-8 py-6 lg:flex-row lg:justify-between lg:gap-0">
					<div className="flex w-full flex-col justify-between lg:flex-row">
						<div className="flex justify-center lg:justify-start">
							<Icons.logoWhite
								className="h-20 w-40 sm:h-24 sm:w-48 lg:h-32 lg:w-72"
								aria-hidden="true"
							/>
						</div>
						<div className="flex flex-col gap-8 sm:flex-row sm:justify-center lg:w-lg lg:justify-end">
							<div className="flex flex-col items-center gap-4 sm:items-start sm:px-4">
								<p className="text-lg font-semibold">Menu</p>
								{siteConfig.mainNav?.map((item) => (
									<Link
										key={item.title}
										href={item.url}
										className="text-secondary hover:text-white"
									>
										{item.title}
									</Link>
								))}
							</div>
							<div className="flex flex-col items-center gap-4 sm:items-start sm:px-4 lg:px-16">
								<p className="text-lg font-semibold">Contact</p>
								<p className="text-secondary">+233 123 456 789</p>
								<p className="text-secondary text-center sm:text-left">
									New Reiss, Ghana, Accra
								</p>
							</div>
							<div className="flex flex-col items-center gap-4 sm:items-start">
								<p className="text-lg font-semibold">Social</p>
								<Link
									href="https://linkedin.com"
									className="text-secondary hover:text-white"
								>
									LinkedIn
								</Link>
								<Link
									href="https://facebook.com"
									className="text-secondary hover:text-white"
								>
									Facebook
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm sm:text-base">
						&copy; copyright {new Date().getFullYear()} - G-Client, All rights
						reserved.
					</p>
					<Button
						className="hover:bg-accent/10 text-white"
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					>
						Back to top
						<ArrowUp className="ml-1 inline h-4 w-4 cursor-pointer" />
					</Button>
				</div>
			</div>
		</footer>
	);
}
