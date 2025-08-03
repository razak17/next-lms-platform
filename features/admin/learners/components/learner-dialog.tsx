"use client";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Track, User } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InvoiceDialogProps {
	trigger: React.ReactNode;
	user: User;
	track: Track;
}

export function LearnerDialog({ trigger, user, track }: InvoiceDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						Learner Details
					</DialogTitle>
					<DialogDescription className="text-muted-foreground sr-only text-center">
						View the details of the learner.
					</DialogDescription>
				</DialogHeader>
				<div className="p-4">
					<div className="flex flex-col items-center gap-2">
						<Avatar className="h-42 w-42 rounded-full grayscale">
							<AvatarImage
								src={user?.image ? user?.image : undefined}
								alt={user?.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full text-6xl">
								{user?.name
									? user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
						<h3 className="text-xl font-bold">{user?.name}</h3>
						<p className="text-muted-foreground">{user?.email}</p>
					</div>
					<div className="mt-8 grid gap-4">
						<div className="grid grid-cols-[120px_1fr] items-center">
							<Badge className="text-md bg-sidebar-accent text-sidebar-accent-foreground inline-block rounded-full px-3 py-1 font-semibold">
								Track
							</Badge>
							<span className="font-bold">{track?.name}</span>
						</div>
						<div className="grid grid-cols-[120px_1fr] items-center">
							<Badge className="text-md bg-sidebar-accent text-sidebar-accent-foreground inline-block rounded-full px-3 py-1 font-semibold">
								Gender
							</Badge>
							<span className="font-bold capitalize">
								{user?.gender || "Not Specified"}
							</span>
						</div>
						<div className="grid grid-cols-[120px_1fr] items-center">
							<Badge className="text-md bg-sidebar-accent text-sidebar-accent-foreground inline-block rounded-full px-3 py-1 font-semibold">
								Contact
							</Badge>
							<span className="font-bold">-</span>
						</div>
						<div className="grid grid-cols-[120px_1fr] items-center">
							<Badge className="text-md bg-sidebar-accent text-sidebar-accent-foreground inline-block rounded-full px-3 py-1 font-semibold">
								Location
							</Badge>
							<span className="font-bold">-</span>
						</div>
						<div className="grid grid-cols-[120px_1fr] items-center">
							<Badge className="text-md bg-sidebar-accent text-sidebar-accent-foreground inline-block rounded-full px-3 py-1 font-semibold">
								Paid
							</Badge>
							<span className="font-bold">-</span>
						</div>
						<div className="grid grid-cols-[120px_1fr] items-center">
							<Badge className="text-md bg-sidebar-accent text-sidebar-accent-foreground inline-block rounded-full px-3 py-1 font-semibold">
								Bio
							</Badge>
							<span className="font-bold">-</span>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
