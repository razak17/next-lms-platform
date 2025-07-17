import { Heading } from "@/components/ui/heading";
import { cardData, tracksCardData } from "@/constants/data";
import { DashboardCards } from "./_components/dashboard-cards";
import { LatestInvoice } from "./_components/latest-invoice";
import { RecentRevenue } from "./_components/recent-revenue";
import { TracksCards } from "./_components/tracks-cards";

export default async function DashbordOverviewPage() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
					<Heading
						title="Welcome Admin 👋"
						description="Track activities, trends and popular courses in real time"
					/>
				</div>
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<DashboardCards cardData={cardData} />
					<div className="flex flex-col gap-4">
						<h2 className="px-4 text-xl font-semibold tracking-tight lg:px-6">
							Tracks
						</h2>
						<TracksCards tracksCardData={tracksCardData} />
					</div>
					<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-2">
						<RecentRevenue />
						<LatestInvoice />
					</div>
				</div>
			</div>
		</div>
	);
}
