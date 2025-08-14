"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface RevenueData {
	month: string;
	revenue: number;
	purchases: number;
}

interface RevenueChartProps {
	data: RevenueData[];
}

const chartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export function RevenueChart({ data }: RevenueChartProps) {
	// Format the data for better display
	const formattedData = data.map((item) => ({
		...item,
		monthLabel: new Date(item.month + "-01").toLocaleDateString("en-US", {
			month: "short",
			year: "numeric",
		}),
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Revenue Analytics</CardTitle>
				<CardDescription>Monthly revenue from track purchases</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className="text-muted-foreground flex h-48 items-center justify-center">
						No revenue data available
					</div>
				) : (
					<ChartContainer config={chartConfig}>
						<BarChart accessibilityLayer data={formattedData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="monthLabel"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
							/>
							<YAxis
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => `$${value}`}
							/>
							<ChartTooltip
								content={<ChartTooltipContent />}
								formatter={(value, name) => [
									`$${Number(value).toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}`,
									name,
								]}
							/>
							<Bar
								dataKey="revenue"
								fill="var(--color-revenue)"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
