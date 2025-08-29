import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Invoice, User } from "@/db/schema";
import { getErrorMessage } from "@/lib/handle-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createInvoice, updateInvoice } from "../actions/invoices";
import {
	CreateInvoiceSchema,
	createInvoiceSchema,
} from "../validations/invoices";

interface InvoiceFormProps {
	invoice?: Invoice;
	learners: User[];
	onSuccess?: () => void;
}

export function InvoiceForm({
	invoice,
	learners,
	onSuccess,
}: InvoiceFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const form = useForm<CreateInvoiceSchema>({
		resolver: zodResolver(createInvoiceSchema),
		defaultValues: {
			learnerId: invoice?.learnerId || "",
			amount: invoice?.amount || "",
			dueDate: invoice?.dueDate
				? new Date(invoice.dueDate).toISOString().split("T")[0]
				: "",
			status: invoice?.status || "pending",
			details: invoice?.details || "",
		},
	});

	const invoiceStatusOptions = [
		{ value: "pending", label: "Pending" },
		{ value: "paid", label: "Paid" },
		{ value: "overdue", label: "Overdue" },
	];

	async function onSubmit(values: CreateInvoiceSchema) {
		setIsLoading(true);
		try {
			const invoiceData = {
				...values,
				dueDate: values.dueDate ? new Date(values.dueDate) : null,
			};
			const action = invoice
				? updateInvoice.bind(null, invoice.id)
				: createInvoice;
			const data = await action(invoiceData);
			if (data.error) {
				toast.error(data.error);
				return;
			}
			toast.success(`Invoice ${invoice ? "updated" : "created"} successfully!`);
			if (onSuccess) {
				onSuccess();
			}
			router.refresh();
		} catch (error) {
			console.error("Error creating invoice:", error);
			toast.error(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-6">
					<div className="grid gap-4">
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="learnerId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Select Learner *</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{learners.map((learner, i) => (
													<SelectItem key={i} value={learner.id}>
														{learner.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Enter Amount *</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due Date *</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status *</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{invoiceStatusOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="details"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Payment Details *</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							{invoice
								? `${isLoading ? "Updating" : "Update"} Invoice${isLoading ? "..." : ""}`
								: `${isLoading ? "Creating" : "Create"} Invoice${isLoading ? "..." : ""}`}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
