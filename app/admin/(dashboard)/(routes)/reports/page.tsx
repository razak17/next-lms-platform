import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsOverview } from "@/features/admin/reports/components/reports-overview";
import { UserGrowthChart } from "@/features/admin/reports/components/user-growth-chart";
import { RevenueChart } from "@/features/admin/reports/components/revenue-chart";
import { TopTracks } from "@/features/admin/reports/components/top-tracks";
import { RecentEnrollments } from "@/features/admin/reports/components/recent-enrollments";
import { UserDemographics } from "@/features/admin/reports/components/user-demographics";
import { InvoiceAnalytics } from "@/features/admin/reports/components/invoice-analytics";
import { CourseAnalytics } from "@/features/admin/reports/components/course-analytics";
import {
	getReportsOverview,
	getUserGrowthData,
	getRevenueData,
	getTopTracks,
	getRecentEnrollments,
	getUserDemographics,
	getInvoiceAnalytics,
	getCourseAnalytics,
} from "@/features/admin/reports/queries/reports";

export default async function ReportsPage() {
	const [
		overviewData,
		userGrowthData,
		revenueData,
		topTracksData,
		recentEnrollmentsData,
		userDemographicsData,
		invoiceAnalyticsData,
		courseAnalyticsData,
	] = await Promise.all([
		getReportsOverview(),
		getUserGrowthData(),
		getRevenueData(),
		getTopTracks(),
		getRecentEnrollments(),
		getUserDemographics(),
		getInvoiceAnalytics(),
		getCourseAnalytics(),
	]);

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Analytics & Reports"
					description="Comprehensive analytics and insights for your learning platform"
				/>
			</div>

			<div className="flex flex-col gap-6 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
				<ReportsOverview data={overviewData} />

				<Tabs defaultValue="analytics" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
						<TabsTrigger value="performance">Performance</TabsTrigger>
						<TabsTrigger value="users">Users</TabsTrigger>
						<TabsTrigger value="financial">Financial</TabsTrigger>
					</TabsList>

					<TabsContent value="analytics" className="space-y-6">
						<div className="grid gap-6 lg:grid-cols-2">
							<UserGrowthChart data={userGrowthData} />
							<RevenueChart data={revenueData} />
						</div>
						<RecentEnrollments data={recentEnrollmentsData} />
					</TabsContent>

					<TabsContent value="performance" className="space-y-6">
						<div className="grid gap-6 lg:grid-cols-2">
							<TopTracks data={topTracksData} />
							<CourseAnalytics data={courseAnalyticsData} />
						</div>
					</TabsContent>

					<TabsContent value="users" className="space-y-6">
						<UserDemographics data={userDemographicsData} />
					</TabsContent>

					<TabsContent value="financial" className="space-y-6">
						<InvoiceAnalytics data={invoiceAnalyticsData} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
