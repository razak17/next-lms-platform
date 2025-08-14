"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface DemographicData {
	genderStats: Array<{
		gender: string | null;
		count: number;
	}>;
	locationStats: Array<{
		location: string | null;
		count: number;
	}>;
}

interface UserDemographicsProps {
	data: DemographicData;
}

const COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

const genderChartConfig = {
	male: {
		label: "Male",
		color: "var(--chart-1)",
	},
	female: {
		label: "Female",
		color: "var(--chart-2)",
	},
	other: {
		label: "Other",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

export function UserDemographics({ data }: UserDemographicsProps) {
	// Prepare gender data
	const genderData = data.genderStats.map((item) => ({
		name: item.gender || "Not specified",
		value: item.count,
	}));

	// Prepare location data (top 5)
	const locationData = data.locationStats.slice(0, 5).map((item) => ({
		name: item.location || "Not specified",
		value: item.count,
	}));

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Gender Distribution</CardTitle>
					<CardDescription>User distribution by gender</CardDescription>
				</CardHeader>
				<CardContent>
					{genderData.length === 0 ? (
						<div className="text-muted-foreground flex h-48 items-center justify-center">
							No gender data available
						</div>
					) : (
						<div className="space-y-4">
							<ChartContainer config={genderChartConfig} className="h-48">
								<PieChart>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Pie
										data={genderData}
										cx="50%"
										cy="50%"
										innerRadius={40}
										outerRadius={80}
										paddingAngle={5}
										dataKey="value"
									>
										{genderData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
								</PieChart>
							</ChartContainer>
							<div className="space-y-2">
								{genderData.map((item, index) => (
									<div
										key={item.name}
										className="flex items-center justify-between"
									>
										<div className="flex items-center space-x-2">
											<div
												className="h-3 w-3 rounded-full"
												style={{
													backgroundColor: COLORS[index % COLORS.length],
												}}
											/>
											<span className="text-sm">{item.name}</span>
										</div>
										<span className="text-sm font-medium">{item.value}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Top Locations</CardTitle>
					<CardDescription>
						User distribution by location (top 5)
					</CardDescription>
				</CardHeader>
				<CardContent>
					{locationData.length === 0 ? (
						<div className="text-muted-foreground flex h-48 items-center justify-center">
							No location data available
						</div>
					) : (
						<div className="space-y-4">
							<ChartContainer config={genderChartConfig} className="h-48">
								<PieChart>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Pie
										data={locationData}
										cx="50%"
										cy="50%"
										innerRadius={40}
										outerRadius={80}
										paddingAngle={5}
										dataKey="value"
									>
										{locationData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
								</PieChart>
							</ChartContainer>
							<div className="space-y-2">
								{locationData.map((item, index) => (
									<div
										key={item.name}
										className="flex items-center justify-between"
									>
										<div className="flex items-center space-x-2">
											<div
												className="h-3 w-3 rounded-full"
												style={{
													backgroundColor: COLORS[index % COLORS.length],
												}}
											/>
											<span className="text-sm">{item.name}</span>
										</div>
										<span className="text-sm font-medium">{item.value}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
