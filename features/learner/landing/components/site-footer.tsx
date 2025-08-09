"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { siteConfig } from "@/data/site";
import Link from "next/link";

export function SiteFooter() {
	return (
		<footer className="bg-sidebar border-t px-4 text-center text-white">
			<div className="flex-col px-4 lg:mx-auto lg:flex lg:w-6xl">
				<div className="flex justify-between py-6">
					<Icons.logoWhite className="h-32 w-72" aria-hidden="true" />
					<div className="flex w-md">
						<div className="flex flex-col items-start gap-4 px-4">
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
						<div className="flex flex-col items-start gap-4 px-16">
							<p className="text-lg font-semibold">Contact</p>
							<p className="text-secondary">+233 012 345 6789</p>
							<p className="text-secondary text-left">
								New Reiss, Ghana, Accra
							</p>
						</div>
						<div className="flex flex-col items-start gap-4">
							<p className="text-lg font-semibold">Social</p>
							<p className="text-secondary">LinkedIn</p>
							<p className="text-secondary">Facebook</p>
						</div>
					</div>
				</div>
				<div className="flex justify-between border-t py-4">
					<p className="">
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
