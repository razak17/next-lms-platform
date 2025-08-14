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
            size="sm"
            className="flex h-8 items-center gap-1.5 px-3"
					>
						<Eye />
						View
					</Button>
				}
				user={user}
				track={track}
			/>
		</div>
	);
}
