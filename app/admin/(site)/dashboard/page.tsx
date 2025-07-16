import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import data from "../../../dashboard/data.json";
import { Heading } from "@/components/ui/heading";

export default async function AdminDashbordPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex items-center justify-between px-4 lg:px-6 mt-4">
					<Heading
						title="Welcome Admin 👋"
						description="Track activities and trends in real time"
					/>
				</div>
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<DataTable data={data} />
				</div>
			</div>
		</div>
	);
}
