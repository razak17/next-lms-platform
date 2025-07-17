import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { CardItem } from "@/types";

interface DashboardCardsProps {
  cardData?: CardItem[];
}

export function DashboardCards({ cardData }: DashboardCardsProps) {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
			{cardData?.map((card, index) => (
				<Card key={index} className="@container/card">
					<CardContent>
						<CardDescription className="text-foreground text-md">{card.title}</CardDescription>
						<div className="mt-2 flex items-center justify-between">
							<div className="flex flex-col items-center gap-4">
								<CardTitle className="w-full text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
									{card.value}
								</CardTitle>
								<div className="text-muted-foreground flex gap-2 text-sm font-medium">
									<div
										className={`flex items-center font-semibold ${card.changeDirection === "up" ? "text-green-600" : "text-red-600"}`}
									>
										{card.changeDirection === "up" ? (
											<IconTrendingUp size={18} />
										) : (
											<IconTrendingDown size={18} />
										)}
										<span>{card.change}</span>
									</div>
									<span>vs last month</span>
								</div>
							</div>
							{card.icon && (
								<div className="flex h-16 w-16 flex-col items-center">
									{card.icon}
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
