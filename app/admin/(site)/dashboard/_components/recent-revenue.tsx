"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A stacked bar chart with a legend";

const chartData = [
	{ month: "January", revenue: 1860 },
	{ month: "February", revenue: 3050 },
	{ month: "March", revenue: 2370 },
	{ month: "April", revenue: 3300 },
	{ month: "May", revenue: 2090 },
	{ month: "June", revenue: 2140 },
  { month: "July", revenue: 1500 },
  { month: "August", revenue: 3000 },
  { month: "September", revenue: 2500 },
  { month: "October", revenue: 4000 },
  { month: "November", revenue: 3500 },
  { month: "December", revenue: 5000 },
];

const chartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

export function RecentRevenue() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl pb-4 border-b">Recent Revenue</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
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
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="revenue"
							stackId="a"
							fill="var(--color-revenue)"
							radius={[8, 8, 0, 0]}
						/>
						<Bar
							dataKey="mobile"
							stackId="a"
							fill="var(--color-mobile)"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
