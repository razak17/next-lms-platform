import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { Heading } from "@/components/ui/heading";
import { cardData, tableData, tracksCardData } from "@/constants/data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardCards } from "./_components/dashboard-cards";
import { TracksCards } from "./_components/tracks-cards";

export default async function AdminDashbordPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<DataTable data={tableData} />
				</div>
			</div>
		</div>
	);
}
