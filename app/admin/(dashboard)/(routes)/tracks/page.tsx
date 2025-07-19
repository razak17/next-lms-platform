import { Heading } from "@/components/ui/heading";

export default async function TracksPage() {
	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Tracks"
					description="Filter and access detailed tracks"
				/>
			</div>
		</div>
	);
}
