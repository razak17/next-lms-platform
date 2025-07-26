import { Heading } from "@/components/ui/heading";
import { TrackDetails } from "@/features/admin/tracks/components/track-details";
import { getTrackById } from "@/features/admin/tracks/queries/tracks";
import { auth } from "@/lib/auth/auth";
import { redirects } from "@/lib/constants";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function TrackDetailsPage({
	params,
}: {
	params: Promise<{ trackId: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(redirects.adminToLogin);
	}

	const { trackId } = await params;

	const track = await getTrackById(trackId);

	if (track == null) return notFound();

	if ("error" in track) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Heading
					title="Error"
					description="Unable to load track details. Please try again later."
				/>
				<p className="mt-2 text-red-500">
					{track.error || "An unexpected error occurred."}
				</p>
			</div>
		);
	}

	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="mt-4 flex items-center justify-between px-4 lg:px-6">
				<Heading
					title="Track Details"
					description="View and manage track details"
				/>
			</div>
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<TrackDetails track={track} userId={session.user.id} />
			</div>
		</div>
	);
}
