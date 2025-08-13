"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Purchase, Track, User } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

interface PurchaseReceiptProps {
	purchase: Purchase & { track: Track; user: User };
	receiptUrl?: string | null;
}

export function PurchaseReceipt({
	purchase,
	receiptUrl,
}: PurchaseReceiptProps) {
	return (
		<div className="print-container container mx-auto max-w-6xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between print:hidden">
				<Link
					href="/dashboard"
					className="text-muted-foreground hover:text-foreground flex items-center gap-2"
				>
					<IconArrowLeft className="h-4 w-4" />
					Back to Dashboard
				</Link>
				{receiptUrl && (
					<Button variant="outline" asChild>
						<Link target="_blank" href={receiptUrl}>
							View Stripe Receipt
						</Link>
					</Button>
				)}
			</div>

			<Card className="print:shadow-none">
				<CardHeader className="pb-8 text-center">
					<CardTitle className="text-2xl">Purchase Receipt</CardTitle>
					<p className="text-muted-foreground">Receipt #{purchase.id}</p>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Customer Information */}
					<div>
						<h3 className="mb-3 font-semibold">Customer Information</h3>
						<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
							<div>
								<p className="text-muted-foreground">Name</p>
								<p className="font-medium">{purchase.user.name}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Email</p>
								<p className="font-medium">{purchase.user.email}</p>
							</div>
						</div>
					</div>

					<Separator />

					{/* Purchase Details */}
					<div>
						<h3 className="mb-3 font-semibold">Purchase Details</h3>
						<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
							<div>
								<p className="text-muted-foreground">Purchase Date</p>
								<p className="font-medium">{formatDate(purchase.createdAt)}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Payment Method</p>
								<p className="font-medium">Credit Card (Stripe)</p>
							</div>
							<div>
								<p className="text-muted-foreground">Transaction ID</p>
								<p className="font-mono text-xs font-medium">
									{purchase.stripeSessionId}
								</p>
							</div>
						</div>
					</div>

					{/* <Separator /> */}

					{/* Track Information */}
					{/* <div> */}
					{/* 	<h3 className="mb-3 font-semibold">Track Information</h3> */}
					{/* 	<div className="flex items-start gap-4 rounded-lg border p-4"> */}
					{/* 		{purchase.trackDetails.image && ( */}
					{/* 			<div className="bg-muted h-16 w-16 flex-shrink-0 rounded-md"> */}
					{/* 				<img */}
					{/* 					src={purchase.trackDetails.image} */}
					{/* 					alt={purchase.trackDetails.name} */}
					{/* 					className="h-16 w-16 rounded-md object-cover" */}
					{/* 				/> */}
					{/* 			</div> */}
					{/* 		)} */}
					{/* 		<div className="flex-1"> */}
					{/* 			<h4 className="text-lg font-medium"> */}
					{/* 				{purchase.trackDetails.name} */}
					{/* 			</h4> */}
					{/* 			<p className="text-muted-foreground mt-1 text-sm"> */}
					{/* 				{purchase.trackDetails.description} */}
					{/* 			</p> */}
					{/* 		</div> */}
					{/* 		<div className="text-right"> */}
					{/* 			<p className="text-2xl font-bold"> */}
					{/* 				{formatPrice(purchase.pricePaidInCents / 100)} */}
					{/* 			</p> */}
					{/* 		</div> */}
					{/* 	</div> */}
					{/* </div> */}

					{/* <Separator /> */}

					{/* Payment Summary */}
					<div>
						{/* <h3 className="mb-3 font-semibold">Payment Summary</h3> */}
						<div className="space-y-2">
							{/* <div className="flex justify-between"> */}
							{/* 	<span>Subtotal</span> */}
							{/* 	<span>{formatPrice(purchase.pricePaidInCents / 100)}</span> */}
							{/* </div> */}
							{/* <div className="flex justify-between"> */}
							{/* 	<span>Tax</span> */}
							{/* 	<span>$0.00</span> */}
							{/* </div> */}
							<Separator />
							<div className="flex justify-between text-lg font-semibold">
								<span>Total</span>
								<span>{formatPrice(purchase.pricePaidInCents / 100)}</span>
							</div>
						</div>
					</div>

					{purchase.refundedAt && (
						<>
							<Separator />
							<div className="rounded-lg bg-red-50 p-4">
								<h3 className="mb-2 font-semibold text-red-800">
									Refund Information
								</h3>
								<p className="text-sm text-red-700">
									This purchase was refunded on{" "}
									{formatDate(purchase.refundedAt)}.
								</p>
							</div>
						</>
					)}

					{/* <Separator /> */}

					{/* Footer */}
					{/* <div className="text-muted-foreground text-center text-sm"> */}
					{/* 	<p>Thank you for your purchase!</p> */}
					{/* 	<p className="mt-2"> */}
					{/* 		If you have any questions about this receipt, please contact our */}
					{/* 		support team. */}
					{/* 	</p> */}
					{/* </div> */}
				</CardContent>
			</Card>
		</div>
	);
}
