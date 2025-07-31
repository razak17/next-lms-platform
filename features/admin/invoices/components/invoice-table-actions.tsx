import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Invoice, User } from "@/db/schema";
import { deleteInvoice } from "@/features/admin/invoices/actions/invoices";
import { Pencil, Trash2 } from "lucide-react";
import { InvoiceDialog } from "./invoice-dialog";

export function InvoiceTableActions({
	userId,
	invoice,
	learners,
}: {
	userId: string;
	invoice: Invoice;
	learners: User[];
}) {
	return (
		<div className="flex gap-2">
			<InvoiceDialog
				userId={userId}
				invoice={invoice}
				trigger={
					<Button
						variant="ghost"
						className="h-4 w-8 p-4 text-blue-600 hover:bg-blue-100"
					>
						<Pencil />
					</Button>
				}
				learners={learners}
			/>
			<ConfirmDialog onConfirm={deleteInvoice.bind(null, invoice.id)}>
				<Button
					variant="ghost"
					className="h-4 w-8 p-4 text-red-700 hover:bg-red-100"
				>
					<Trash2 />
				</Button>
			</ConfirmDialog>
		</div>
	);
}
