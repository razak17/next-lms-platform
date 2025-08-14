"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Purchase, User } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/utils";
import { refundPurchase } from "@/features/shared/actions/purchase";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface RefundDialogProps {
	trigger: React.ReactNode;
	data: {
		user: User | null;
		purchase: Purchase;
	};
}

export function RefundDialog({ trigger, data }: RefundDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { user, purchase } = data;

	const handleRefund = async () => {
		setIsLoading(true);

		try {
			const result = await refundPurchase(purchase.id);

			if (result.error) {
				toast.error(result.message || "Failed to process refund");
			} else {
				toast.success(result.message || "Purchase refunded successfully");
				setOpen(false);
			}
		} catch (error) {
			console.error("Error processing refund:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	// Don't show refund option if already refunded
	if (purchase.refundedAt) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-amber-500" />
						Refund Purchase
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to refund this purchase? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Purchase Details */}
					<div className="bg-muted/50 space-y-2 rounded-lg p-4">
						<div className="flex justify-between">
							<span className="text-sm font-medium">Customer:</span>
							<span className="text-sm">{user?.name || "Unknown User"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm font-medium">Email:</span>
							<span className="text-sm">{user?.email || "N/A"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm font-medium">Amount:</span>
							<span className="text-sm font-semibold">
								{formatPrice(purchase.pricePaidInCents / 100)}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm font-medium">Purchase Date:</span>
							<span className="text-sm">{formatDate(purchase.createdAt)}</span>
						</div>
						{purchase.trackDetails && (
							<div className="flex justify-between">
								<span className="text-sm font-medium">Track:</span>
								<span className="text-sm">{purchase.trackDetails.name}</span>
							</div>
						)}
					</div>

					{/* Warning */}
					<div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
						<p className="text-sm text-amber-800">
							<strong>Warning:</strong> Refunding this purchase will:
						</p>
						<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-700">
							<li>Process a refund through Stripe</li>
							<li>Revoke the learner's access to the track</li>
							<li>Remove their enrollment from the track</li>
						</ul>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleRefund}
						disabled={isLoading}
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isLoading ? "Processing..." : "Refund Purchase"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
