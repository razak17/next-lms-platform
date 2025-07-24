"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants/data";
import { User } from "@/db/schema/user";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut();
		router.refresh(); // Forces a re-fetch of server components, including the layout's session check
	};

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader className="p-0">
				<SidebarMenu className="flex h-20 items-center justify-center rounded-sm bg-white">
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="hover:bg-sidebar-foreground data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Icons.logo className="h-10 w-18" aria-hidden="true" />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-col gap-2">
						<SidebarMenu className="mt-6">
							{navItems.map((item) => {
								const Icon = item.icon ? Icons[item.icon] : Icons.dashboard;
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											tooltip={item.title}
											isActive={pathname === item.url}
											className="h-14 px-4"
										>
											<Link href={item.url}>
												{item.icon && <Icon />}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex w-full items-center gap-2">
					<Button
						className="hover:bg-accent/10 flex flex-1 px-2 py-6"
						onClick={() => router.push("/admin/profile")}
					>
						<Avatar className="h-8 w-8 rounded-full grayscale">
							<AvatarImage
								src={props.user.image ? props.user.image : undefined}
								alt={props.user.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full">
								{props.user.name
									? props.user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{props.user.name}</span>
							<span className="truncate text-xs">{props.user.email}</span>
						</div>
					</Button>
					<Button
						className="hover:bg-accent/10 px-2 py-6"
						onClick={handleLogout}
					>
						<Icons.logout aria-hidden="true" />
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
