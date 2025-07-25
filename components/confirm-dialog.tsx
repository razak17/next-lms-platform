"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { ReactNode, useTransition } from "react";
import { toast } from "sonner";

interface ConfirmDialogProps {
	children: React.ReactNode;
	onConfirm: () => Promise<{ error: boolean; message: string }>;
}

export const ConfirmDialog = ({ children, onConfirm }: ConfirmDialogProps) => {
	const [isLoading, startTransition] = useTransition();

	function performAction() {
		startTransition(async () => {
			const data = await onConfirm();
			if (data.error) {
				toast.error(data.message);
			} else {
				toast.success(data.message);
			}
		});
	}

	return (
		<AlertDialog open={isLoading ? true : undefined}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction disabled={isLoading} onClick={performAction}>
						<LoadingTextSwap isLoading={isLoading}>Continue</LoadingTextSwap>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

function LoadingTextSwap({
	isLoading,
	children,
}: {
	isLoading: boolean;
	children: ReactNode;
}) {
	return (
		<div className="grid items-center justify-items-center">
			<div
				className={cn(
					"col-start-1 col-end-2 row-start-1 row-end-2",
					isLoading ? "invisible" : "visible"
				)}
			>
				{children}
			</div>
			<div
				className={cn(
					"col-start-1 col-end-2 row-start-1 row-end-2 text-center",
					isLoading ? "visible" : "invisible"
				)}
			>
				<Loader2Icon className="animate-spin" />
			</div>
		</div>
	);
}
