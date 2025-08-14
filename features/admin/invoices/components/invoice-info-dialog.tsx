"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Purchase, User } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/utils";
import { IconCalendar, IconCreditCard, IconUser } from "@tabler/icons-react";

interface InvoiceInfoDialogProps {
	trigger: React.ReactNode;
	data: {
		user: User | null;
		purchase: Purchase;
	};
}

export function InvoiceInfoDialog({ trigger, data }: InvoiceInfoDialogProps) {
	const { user, purchase } = data;

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-xl">Invoice Details</DialogTitle>
					<DialogDescription className="text-muted-foreground text-sm">
						View invoice information and payment details
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Learner Information */}
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage
										src={user?.image ? user?.image : undefined}
										alt={user?.name}
									/>
									<AvatarFallback className="text-sidebar-accent-foreground">
										{user?.name
											? user?.name
													.split(" ")
													.map((n) => n[0])
													.join("")
											: "U"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<h3 className="text-sm font-semibold">
										{user?.name || "Unknown User"}
									</h3>
									<p className="text-muted-foreground text-xs">
										{user?.email || "No email provided"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Invoice Details */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<IconCreditCard className="text-muted-foreground h-4 w-4" />
								<span className="text-sm font-medium">Amount</span>
							</div>
							<span className="text-sm font-semibold">
								{purchase.pricePaidInCents
									? formatPrice(purchase.pricePaidInCents / 100)
									: "—"}
							</span>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<IconCalendar className="text-muted-foreground h-4 w-4" />
								<span className="text-sm font-medium">Purchase Date</span>
							</div>
							<span className="text-sm">
								{purchase.createdAt ? formatDate(purchase.createdAt) : "—"}
							</span>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Status</span>
							<Badge
								variant={purchase.refundedAt ? "destructive" : "default"}
								className={
									purchase.refundedAt
										? "bg-red-100 text-red-800 hover:bg-red-100"
										: "bg-green-100 text-green-800 hover:bg-green-100"
								}
							>
								{purchase.refundedAt ? "Refunded" : "Paid"}
							</Badge>
						</div>

						{purchase.refundedAt && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Refund Date</span>
									<span className="text-muted-foreground text-sm">
										{formatDate(purchase.refundedAt)}
									</span>
								</div>
							</>
						)}
					</div>

					{/* Track Information */}
					{purchase.trackDetails && (
						<>
							<Separator />
							<Card>
								<CardContent className="p-4">
									<h4 className="mb-2 text-sm font-semibold">Track Details</h4>
									<div className="space-y-2">
										<div>
											<span className="text-muted-foreground text-xs font-medium">
												Name:
											</span>
											<p className="text-sm">
												{purchase.trackDetails.name || "N/A"}
											</p>
										</div>
										{purchase.trackDetails.description && (
											<div>
												<span className="text-muted-foreground text-xs font-medium">
													Description:
												</span>
												<p className="text-muted-foreground text-sm">
													{purchase.trackDetails.description}
												</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{/* Additional Information */}
					<div className="text-muted-foreground space-y-1 text-xs">
						<div className="flex justify-between">
							<span>Invoice ID:</span>
							<span className="font-mono">{purchase.id}</span>
						</div>
						{purchase.stripeSessionId && (
							<div className="flex justify-between">
								<span>Stripe Session:</span>
								<span className="max-w-32 truncate font-mono text-xs">
									{purchase.stripeSessionId}
								</span>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
