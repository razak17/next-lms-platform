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

interface InvoiceData {
	statusStats: Array<{
		status: string;
		count: number;
		totalAmount: number;
	}>;
	recentInvoices: Array<{
		id: string;
		amount: number;
		status: string;
		dueDate: Date | null;
		learnerName: string;
		learnerEmail: string;
		createdAt: Date;
	}>;
}

interface InvoiceAnalyticsProps {
	data: InvoiceData;
}

const getStatusColor = (status: string) => {
	switch (status) {
		case "paid":
			return "bg-green-100 text-green-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		case "overdue":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export function InvoiceAnalytics({ data }: InvoiceAnalyticsProps) {
	return (
		<div className="space-y-6">
			{/* Invoice Status Overview */}
			<div className="grid gap-4 md:grid-cols-3">
				{data.statusStats.map((stat) => (
					<Card key={stat.status}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm font-medium capitalize">
										{stat.status} Invoices
									</p>
									<p className="text-2xl font-bold">{stat.count}</p>
									<p className="text-muted-foreground text-sm">
										{formatPrice(stat.totalAmount)} total
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

			{/* Recent Invoices */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Invoices</CardTitle>
					<CardDescription>
						Latest invoices created in the system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data.recentInvoices.length === 0 ? (
							<div className="text-muted-foreground flex h-32 items-center justify-center">
								No recent invoices found
							</div>
						) : (
							data.recentInvoices.map((invoice) => (
								<div
									key={invoice.id}
									className="flex items-center justify-between space-x-4 border-b pb-3 last:border-b-0"
								>
									<div className="flex-1 space-y-1">
										<div className="flex items-center space-x-2">
											<p className="leading-none font-medium">#{invoice.id}</p>
											<Badge className={getStatusColor(invoice.status)}>
												{invoice.status}
											</Badge>
										</div>
										<p className="text-muted-foreground text-sm">
											{invoice.learnerName}
										</p>
										<p className="text-muted-foreground text-xs">
											{invoice.learnerEmail}
										</p>
									</div>
									<div className="space-y-1 text-right">
										<p className="font-semibold">
											{formatPrice(invoice.amount)}
										</p>
										<p className="text-muted-foreground text-xs">
											Created: {formatDate(invoice.createdAt)}
										</p>
										{invoice.dueDate && (
											<p className="text-muted-foreground text-xs">
												Due: {formatDate(invoice.dueDate)}
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
