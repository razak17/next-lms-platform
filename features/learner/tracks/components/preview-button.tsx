import { Button } from "@/components/ui/button";
import { learnerOwnsTrack } from "@/features/shared/actions/tracks";
import Link from "next/link";

export async function PreviewButton({
	trackId,
	learnerId,
}: {
	trackId?: string;
	learnerId?: string;
}) {
	const PreviewBtn = () => (
		<Button
			asChild
			className="bg-primary text-primary-foreground mt-10 w-full rounded-xs"
			size="lg"
		>
			<Link href={`/tracks/${trackId}/preview`} className="block">
				Preview Track
			</Link>
		</Button>
	);

	if (!trackId || !learnerId) {
		return <PreviewBtn />;
	}

	const ownsTrack = await learnerOwnsTrack(trackId, learnerId);

	if (ownsTrack) {
		return (
			<Button
				asChild
				className="bg-primary text-primary-foreground mt-10 w-full rounded-xs"
				size="lg"
			>
				<Link href={`/tracks/${trackId}`} className="block">
					Go to Track
				</Link>
			</Button>
		);
	}

	return <PreviewBtn />;
}
