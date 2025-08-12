"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { NavItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/db/schema";
import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { ChevronDown, GraduationCap, LogIn, LogOut, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
	items?: NavItem[];
	user?: User | null;
}

export function MobileNav({ items, user }: MobileNavProps) {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	if (isDesktop) return null;

	const normalize = (str: string) =>
		str === "/" ? "/" : str.replace(/\/$/, "");

	const handleSignOut = async () => {
		await authClient.signOut();
		router.refresh();
		setOpen(false);
	};

	return (
		<div className="flex lg:hidden px-2">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="ml-auto">
						<Menu className="size-6" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[300px] p-0">
					<ScrollArea className="h-full py-6 pr-6 pl-6">
						<div className="flex flex-col space-y-6">
							{/* Logo */}
							<Link
								href="/"
								className="flex items-center px-2"
								onClick={() => setOpen(false)}
							>
								<Icons.logo className="h-20 w-24" aria-hidden="true" />
							</Link>

							{/* Navigation Items */}
							{items && items.length > 0 && (
								<nav className="flex flex-col space-y-1">
									{items.map((item, index) => {
										const normalizedPathname = normalize(pathname || "/");
										const normalizedItemUrl = normalize(item.url);
										const isActive = normalizedPathname === normalizedItemUrl;

										return (
											<Link
												key={index}
												href={item.url}
												onClick={() => setOpen(false)}
												className={cn(
													"hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
													isActive
														? "bg-accent text-accent-foreground"
														: "text-muted-foreground"
												)}
											>
												{item.title}
											</Link>
										);
									})}
								</nav>
							)}

							<Separator />

							{/* User Section */}
							{user ? (
								<div className="flex flex-col space-y-4">
									{/* User Info */}
									<div className="flex items-center space-x-3 px-3">
										<Avatar className="size-8">
											<AvatarImage
												src={user.image || ""}
												alt={user.name || "User"}
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
										<div className="flex flex-col">
											<span className="text-sm font-medium">
												{user.name || "User"}
											</span>
											<span className="text-muted-foreground text-xs">
												{user.email}
											</span>
										</div>
									</div>

									{/* User Actions */}
									<div className="flex flex-col space-y-1">
										<Button
											variant="ghost"
											className="justify-start px-3"
											onClick={() => {
												router.push(redirects.toDashboard);
												setOpen(false);
											}}
										>
											<GraduationCap className="mr-3 size-4" />
											Portal
										</Button>
										<Button
											variant="ghost"
											className="justify-start px-3"
											onClick={handleSignOut}
										>
											<LogOut className="mr-3 size-4" />
											Logout
										</Button>
									</div>
								</div>
							) : (
								<div className="flex flex-col space-y-2">
									<Button
										variant="outline"
										className="justify-start"
										onClick={() => {
											router.push(redirects.toLogin);
											setOpen(false);
										}}
									>
										<LogIn className="mr-2 size-4" />
										Login
									</Button>
									<Button
										className="justify-start"
										onClick={() => {
											router.push(redirects.toSignup);
											setOpen(false);
										}}
									>
										<LogIn className="mr-2 size-4" />
										Sign Up
									</Button>
								</div>
							)}
						</div>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);
}
