"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User } from "@/db/schema";
import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { ChevronDown, GraduationCap, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MainNavProps {
	items?: NavItem[];
	user?: User | null;
}

export function MainNav({ items, user }: MainNavProps) {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<nav className="hidden w-full items-center justify-between gap-6 px-4 py-2 lg:mx-auto lg:flex lg:w-6xl">
			<div className="flex items-center gap-4">
				<Link href="/">
					<Icons.logo className="h-14 w-22" aria-hidden="true" />
				</Link>
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
			{user ? (
				<div className="flex items-center gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="lg"
								className="flex items-center gap-2 rounded-sm px-2"
								aria-label="User menu"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={user?.image ?? ""}
										alt={user?.name ?? "User"}
									/>
									<AvatarFallback>
										{(user?.name
											? user.name
													.trim()
													.split(/\s+/)
													.slice(0, 2)
													.map((p) => p[0])
													.join("")
													.toUpperCase()
											: "U") || "U"}
									</AvatarFallback>
								</Avatar>
								<span className="text-md max-w-[10rem] truncate font-medium">
									{user?.name ?? "User"}
								</span>
								<ChevronDown className="size-6 opacity-70" aria-hidden="true" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent align="end" sideOffset={8} className="w-42">
								<DropdownMenuItem
									className="text-primary focus:text-primary text-md"
									onClick={() => {
										router.push(redirects.toDashboard);
									}}
								>
									<GraduationCap className="size-5" />
									Portal
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-primary focus:text-primary text-md"
									onClick={async () => {
										await authClient.signOut();
										router.refresh();
									}}
								>
									<LogOut className="size-5" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>
				</div>
			) : (
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
			)}
		</nav>
	);
}
