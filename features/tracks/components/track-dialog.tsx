import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus } from "@tabler/icons-react";
import TrackForm from "./track-form";

interface TrackDialogProps {
  children: React.ReactNode;
}

export function TrackDialog({ children }: TrackDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex w-48 items-center gap-2" size="lg">
					<IconPlus />
					Add Track
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						Add New Track
					</DialogTitle>
				</DialogHeader>
        { children}
			</DialogContent>
		</Dialog>
	);
}
