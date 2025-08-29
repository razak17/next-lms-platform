"use client";

import { Icons } from "@/components/icons";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn, isActiveUrl } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainNavProps {
	items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
	const pathname = usePathname();

	return (
		<div className="hidden gap-6 lg:flex">
			<div className="flex items-center gap-4">
				<Link href="/">
					<Icons.logo className="h-14 w-22" aria-hidden="true" />
				</Link>
				<NavigationMenu>
					<NavigationMenuList>
						{items?.map((item) => {
							return (
								<NavigationMenuItem key={item.title}>
									<NavigationMenuLink
										asChild
										className={cn(
											navigationMenuTriggerStyle(),
											"text-md h-auto",
											isActiveUrl(pathname, item.url) &&
												"underline decoration-2 underline-offset-8"
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
		</div>
	);
}
