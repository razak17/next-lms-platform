"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirects } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { forgotPasswordSchema } from "@/features/shared/validations/auth";
import { authClient } from "@/lib/auth/client";
import { ChevronRight, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
		setIsLoading(true);

		const { error } = await authClient.forgetPassword({
			email: values.email,
			redirectTo: `${redirects.toResetPassword}`,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password reset email sent");
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-center text-2xl font-semibold">Forgot Password</h2>
				<p className="px-8 text-center text-sm">
					Enter your email address to reset your password
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid gap-6">
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<Mail
													aria-hidden="true"
													className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
												/>
												<Input
													placeholder="Email"
													className="bg-secondary pl-9"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							{isLoading ? "Sending Email..." : "Send Reset Link"}
							<ChevronRight className="ml-2 size-5" />
						</Button>
					</div>
					<div className="text-center text-sm">
						<Link
							href={`${redirects.toLogin}`}
							className="text-sidebar underline"
						>
							Back to login
						</Link>
					</div>
				</form>
			</Form>
		</div>
	);
}
