import { Button } from "@/components/ui/button";
import { Track, User } from "@/db/schema";
import { Eye } from "lucide-react";
import { LearnerDialog } from "./learner-dialog";

export function LearnerTableActions({
	user,
	track,
}: {
	user: User;
	track: Track | null;
}) {
	return (
		<div className="flex gap-2">
			<LearnerDialog
				trigger={
					<Button
						variant="ghost"
						className="h-4 w-8 p-4 text-blue-600 hover:bg-blue-100"
					>
						<Eye />
					</Button>
				}
				user={user}
				track={track}
			/>
		</div>
	);
}
