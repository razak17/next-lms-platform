"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart showing monthly revenue";

export interface RevenueData {
	month: string;
	revenue: number;
	formattedRevenue: string;
}

interface RecentRevenueProps {
	data?: RevenueData[];
}

const chartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

export function RecentRevenue({ data = [] }: RecentRevenueProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="border-b pb-4 text-2xl">Recent Revenue</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className="text-muted-foreground flex h-48 items-center justify-center">
						No revenue data available
					</div>
				) : (
					<ChartContainer config={chartConfig}>
						<BarChart accessibilityLayer data={data}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<YAxis
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => `$${value}`}
							/>
							<ChartTooltip
								content={<ChartTooltipContent hideLabel />}
								formatter={(value) => [`$${value}`, " Revenue"]}
							/>
							<ChartLegend content={<ChartLegendContent />} />
							<Bar
								dataKey="revenue"
								fill="var(--color-revenue)"
								radius={[8, 8, 0, 0]}
							/>
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
