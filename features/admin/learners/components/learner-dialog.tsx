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
import { User } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/utils";
import {
	CalendarDays,
	GraduationCap,
	MapPin,
	Phone,
	Mail,
	User as UserIcon,
	ShoppingBag,
} from "lucide-react";

interface LearnerDialogProps {
	trigger: React.ReactNode;
	user: User;
	enrolledTracks?: Array<{
		id: string | null;
		name: string | null;
	}>;
	totalPurchases?: number;
	totalPurchaseAmount?: number;
}

export function LearnerDialog({
	trigger,
	user,
	enrolledTracks = [],
	totalPurchases = 0,
	totalPurchaseAmount = 0,
}: LearnerDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
				<DialogHeader className="space-y-4 pb-6">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarImage src={user.image || undefined} alt={user.name} />
							<AvatarFallback className="text-xl font-semibold">
								{user.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-1">
							<DialogTitle className="text-2xl font-bold">
								{user.name}
							</DialogTitle>
							<DialogDescription className="flex items-center gap-2 text-base">
								<Mail className="h-4 w-4" />
								{user.email}
							</DialogDescription>
						</div>
						<Badge
							variant={user.emailVerified ? "default" : "secondary"}
							className="ml-auto"
						>
							{user.emailVerified ? "Verified" : "Unverified"}
						</Badge>
					</div>
				</DialogHeader>

				<div className="grid gap-6 md:grid-cols-2">
					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<UserIcon className="h-5 w-5" />
								Personal Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-[80px_1fr] items-center gap-3">
								<span className="text-muted-foreground text-sm">Gender:</span>
								<span className="font-medium capitalize">
									{user.gender || "Not specified"}
								</span>
							</div>
							{user.phone && (
								<div className="grid grid-cols-[80px_1fr] items-center gap-3">
									<span className="text-muted-foreground text-sm">Phone:</span>
									<div className="flex items-center gap-2">
										<Phone className="text-muted-foreground h-4 w-4" />
										<span className="font-medium">{user.phone}</span>
									</div>
								</div>
							)}
							{user.location && (
								<div className="grid grid-cols-[80px_1fr] items-center gap-3">
									<span className="text-muted-foreground text-sm">
										Location:
									</span>
									<div className="flex items-center gap-2">
										<MapPin className="text-muted-foreground h-4 w-4" />
										<span className="font-medium">{user.location}</span>
									</div>
								</div>
							)}
							<div className="grid grid-cols-[80px_1fr] items-center gap-3">
								<span className="text-muted-foreground text-sm">Joined:</span>
								<div className="flex items-center gap-2">
									<CalendarDays className="text-muted-foreground h-4 w-4" />
									<span className="font-medium">
										{formatDate(user.createdAt)}
									</span>
								</div>
							</div>
							{user.bio && (
								<>
									<Separator />
									<div>
										<span className="text-muted-foreground text-sm">Bio:</span>
										<p className="mt-1 text-sm leading-relaxed">{user.bio}</p>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Purchase Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ShoppingBag className="h-5 w-5" />
								Purchase Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<div className="text-primary text-2xl font-bold">
										{totalPurchases}
									</div>
									<div className="text-muted-foreground text-sm">
										Total Purchases
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{formatPrice(totalPurchaseAmount / 100)}
									</div>
									<div className="text-muted-foreground text-sm">
										Total Spent
									</div>
								</div>
							</div>
							<Separator />
							<div className="grid grid-cols-2 gap-4 text-center">
								<div>
									<div className="text-lg font-semibold">
										{enrolledTracks.filter((t) => t.id && t.name).length}
									</div>
									<div className="text-muted-foreground text-sm">
										Enrolled Tracks
									</div>
								</div>
								<div>
									<Badge variant={user.banned ? "destructive" : "default"}>
										{user.banned ? "Banned" : "Active"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Enrolled Tracks */}
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<GraduationCap className="h-5 w-5" />
								Enrolled Tracks (
								{enrolledTracks.filter((t) => t.id && t.name).length})
							</CardTitle>
							<CardDescription>
								All tracks this learner is currently enrolled in
							</CardDescription>
						</CardHeader>
						<CardContent>
							{enrolledTracks.filter((t) => t.id && t.name).length > 0 ? (
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{enrolledTracks
										.filter((t) => t.id && t.name)
										.map((track, index) => (
											<Card key={track.id || index} className="border-muted">
												<CardContent className="p-4">
													<div className="space-y-2">
														<h4 className="font-semibold">{track.name}</h4>
														<div className="text-muted-foreground text-sm">
															<Badge variant="secondary" className="text-xs">
																Enrolled
															</Badge>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
								</div>
							) : (
								<div className="text-muted-foreground py-8 text-center">
									No tracks enrolled yet
								</div>
							)}
						</CardContent>
					</Card>

					{/* Account Status Information */}
					{(user.banned || user.banReason) && (
						<Card className="border-destructive md:col-span-2">
							<CardHeader>
								<CardTitle className="text-destructive flex items-center gap-2">
									Account Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								{user.banned && (
									<div className="space-y-2">
										<Badge variant="destructive">Banned Account</Badge>
										{user.banReason && (
											<p className="text-muted-foreground text-sm">
												Reason: {user.banReason}
											</p>
										)}
										{user.banExpires && (
											<p className="text-muted-foreground text-sm">
												Expires: {formatDate(user.banExpires)}
											</p>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
