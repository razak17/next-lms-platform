"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

interface UserGrowthData {
	month: string;
	users: number;
}

interface UserGrowthChartProps {
	data: UserGrowthData[];
}

const chartConfig = {
	users: {
		label: "New Users",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function UserGrowthChart({ data }: UserGrowthChartProps) {
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
				<CardTitle>User Growth</CardTitle>
				<CardDescription>
					New learner registrations over the last 6 months
				</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className="text-muted-foreground flex h-48 items-center justify-center">
						No user growth data available
					</div>
				) : (
					<ChartContainer config={chartConfig}>
						<LineChart accessibilityLayer data={formattedData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="monthLabel"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
							/>
							<YAxis tickLine={false} tickMargin={10} axisLine={false} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								dataKey="users"
								type="monotone"
								stroke="var(--color-users)"
								strokeWidth={2}
								dot={{
									fill: "var(--color-users)",
								}}
								activeDot={{
									r: 6,
								}}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
