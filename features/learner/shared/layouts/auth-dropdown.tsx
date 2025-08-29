"use client";

import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons";
import { ChevronDown, LogIn, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/db/schema";

interface AuthDropdownProps {
	user?: User | null;
}

export function AuthDropdown({ user }: AuthDropdownProps) {
	const router = useRouter();

	if (!user) {
		return (
			<>
				<Button variant="ghost" size="sm" asChild>
					<Link href={redirects.toLogin}>
						<LogIn className="mr-2 size-4" />
						Login
						<span className="sr-only">Login</span>
					</Link>
				</Button>
				<Button variant="ghost" size="sm" asChild>
					<Link href={redirects.toSignup}>
						<UserIcon className="mr-2 size-4" />
						Register
						<span className="sr-only">Register</span>
					</Link>
				</Button>
			</>
		);
	}

	const initials = user.name
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0])
		.join("")
		.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="lg"
					className="flex items-center gap-2 rounded-sm px-2"
					aria-label="User menu"
				>
					<Avatar className="size-8">
						<AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<span className="text-md max-w-[10rem] truncate font-medium">
						{user?.name ?? "User"}
					</span>
					<ChevronDown className="size-6 opacity-70" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent
					className="bg-background w-56"
					align="end"
					forceMount
				>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm leading-none font-medium">{user.name}</p>
							<p className="text-muted-foreground text-xs leading-none">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={redirects.toDashboard}>
							<DashboardIcon
								className="text-foreground mr-2 size-4"
								aria-hidden="true"
							/>
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={async () => {
							await authClient.signOut();
							router.refresh();
						}}
					>
						<ExitIcon
							className="text-foreground mr-2 size-4"
							aria-hidden="true"
						/>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
