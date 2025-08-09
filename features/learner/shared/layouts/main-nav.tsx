"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { redirects } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MainNavProps {
	items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<nav className="hidden w-full items-center justify-between gap-6 px-4 py-2 lg:mx-auto lg:flex lg:w-6xl">
			<div className="flex items-center gap-4">
				<Icons.logo className="h-14 w-22" aria-hidden="true" />
				<NavigationMenu>
					<NavigationMenuList>
						{items?.map((item) => {
							const normalize = (str: string) =>
								str === "/" ? "/" : str.replace(/\/$/, "");
							const normalizedPathname = normalize(pathname || "/");
							const normalizedItemUrl = normalize(item.url);

							const isHome = item.url === "/" || item.url === "";
							const isActive =
								(isHome &&
									(normalizedPathname === "/" || normalizedPathname === "")) ||
								normalizedPathname === normalizedItemUrl;

							return (
								<NavigationMenuItem key={item.title}>
									<NavigationMenuLink
										asChild
										className={cn(
											navigationMenuTriggerStyle(),
											"text-md h-auto",
											isActive && "underline decoration-2 underline-offset-8"
										)}
									>
										<Link href={item.url}>{item.title}</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className="flex items-center gap-4">
				<Button
					variant="outline"
					size="lg"
					className="text-sidebar flex w-28 items-center gap-2 rounded-sm"
					onClick={() => {
						router.push(redirects.toLogin);
					}}
				>
					Login
					<LogIn className="h-4 w-4" />
				</Button>
				<Button
					size="lg"
					className="flex w-28 items-center gap-2 rounded-sm"
					onClick={() => {
						router.push(redirects.toSignup);
					}}
				>
					Sign Up
					<LogIn className="h-4 w-4" />
				</Button>
			</div>
		</nav>
	);
}
