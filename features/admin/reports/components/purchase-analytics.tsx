"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

interface PurchaseData {
	purchaseStats: Array<{
		status: string;
		count: number;
		totalAmount: number;
	}>;
	recentPurchases: Array<{
		id: string;
		amount: number;
		status: string;
		trackName: string;
		learnerName: string;
		learnerEmail: string;
		createdAt: Date;
		refundedAt: Date | null;
	}>;
}

interface PurchaseAnalyticsProps {
	data: PurchaseData;
}

const getStatusColor = (status: string) => {
	switch (status) {
		case "completed":
			return "bg-green-100 text-green-800";
		case "refunded":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export function PurchaseAnalytics({ data }: PurchaseAnalyticsProps) {
	return (
		<div className="space-y-6">
			{/* Purchase Status Overview */}
			<div className="grid gap-4 md:grid-cols-2">
				{data.purchaseStats.map((stat) => (
					<Card key={stat.status}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm font-medium capitalize">
										{stat.status} Purchases
									</p>
									<p className="text-2xl font-bold">{stat.count}</p>
									<p className="text-muted-foreground text-sm">
										{formatPrice(stat.totalAmount / 100)} total
									</p>
								</div>
								<Badge className={getStatusColor(stat.status)}>
									{stat.status}
								</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Recent Purchases */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Purchases</CardTitle>
					<CardDescription>Latest purchases made in the system</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data.recentPurchases.length === 0 ? (
							<div className="text-muted-foreground flex h-32 items-center justify-center">
								No recent purchases found
							</div>
						) : (
							data.recentPurchases.map((purchase) => (
								<div
									key={purchase.id}
									className="flex items-center justify-between space-x-4 border-b pb-3 last:border-b-0"
								>
									<div className="flex-1 space-y-1">
										<div className="flex items-center space-x-2">
											<p className="leading-none font-medium">#{purchase.id}</p>
											<Badge className={getStatusColor(purchase.status)}>
												{purchase.status}
											</Badge>
										</div>
										<p className="text-muted-foreground text-sm">
											{purchase.learnerName}
										</p>
										<p className="text-muted-foreground text-xs">
											{purchase.learnerEmail}
										</p>
										<p className="text-muted-foreground text-xs font-medium">
											Track: {purchase.trackName}
										</p>
									</div>
									<div className="space-y-1 text-right">
										<p className="font-semibold">
											{formatPrice(purchase.amount / 100)}
										</p>
										<p className="text-muted-foreground text-xs">
											Purchased: {formatDate(purchase.createdAt)}
										</p>
										{purchase.refundedAt && (
											<p className="text-muted-foreground text-xs text-red-600">
												Refunded: {formatDate(purchase.refundedAt)}
											</p>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
