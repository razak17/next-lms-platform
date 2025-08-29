"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { InvoiceForm } from "./invoice-form";
import { Invoice, User } from "@/db/schema";

interface InvoiceDialogProps {
	trigger: React.ReactNode;
	learners: User[];
	invoice?: Invoice;
}

export function InvoiceDialog({
	invoice,
	trigger,
	learners,
}: InvoiceDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => setOpen(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						{invoice ? "Update" : "Add New"} Invoice
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-center">
						Fill in the details below to {invoice ? "update" : "create a new"}{" "}
						invoice.
					</DialogDescription>
				</DialogHeader>
				<InvoiceForm
					invoice={invoice}
					learners={learners}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
