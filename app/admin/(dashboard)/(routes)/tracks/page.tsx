import { Heading } from "@/components/ui/heading";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { tracksCardData } from "@/constants/data";
import { TracksCards } from "../dashboard/_components/tracks-cards";

interface TracksPageProps {
	searchParams: Promise<{ title?: string }>;
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
	const { title } = await searchParams;

	const filteredTracks = tracksCardData.filter((track) => {
		return track.title.toLowerCase().includes(title?.toLowerCase() || "");
	});

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Manage Tracks"
					description="Filter, sort and access detailed tracks"
				/>
			</div>
			<div className="flex justify-between px-6 pt-6">
				<SearchInput placeholder="Search Track" />
				<Button className="flex w-48 items-center gap-2" size="lg">
					<IconPlus />
					Add Track
				</Button>
			</div>
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<TracksCards tracksCardData={filteredTracks} />
			</div>
		</div>
	);
}
