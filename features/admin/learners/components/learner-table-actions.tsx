import { Button } from "@/components/ui/button";
import { User } from "@/db/schema";
import { Eye } from "lucide-react";
import { LearnerDialog } from "./learner-dialog";

export function LearnerTableActions({
	user,
	enrolledTracks,
	totalPurchases,
	totalPurchaseAmount,
}: {
	user: User;
	enrolledTracks?: Array<{ id: string | null; name: string | null }>;
	totalPurchases?: number;
	totalPurchaseAmount?: number;
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
				enrolledTracks={enrolledTracks}
				totalPurchases={totalPurchases}
				totalPurchaseAmount={totalPurchaseAmount}
			/>
		</div>
	);
}
