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
import { cn } from "@/lib/utils";

import { PasswordInput } from "@/components/password-input";
import { resetPasswordSchema } from "@/features/shared/validations/auth";
import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { Loader2, LockKeyhole, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const token = searchParams.get("token") as string;

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
		setIsLoading(true);

		const { error } = await authClient.resetPassword({
			newPassword: values.password,
			token,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password reset successfully");
			router.push(redirects.toLogin);
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-center text-2xl font-semibold">Reset Password</h2>
				<p className="px-8 text-center text-sm">
					Create a new password to access your account.
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid gap-6">
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<LockKeyhole
													aria-hidden="true"
													className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2"
												/>
												<PasswordInput
													placeholder="Password"
													className="bg-secondary pl-9"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<LockKeyhole
													aria-hidden="true"
													className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2"
												/>
												<PasswordInput
													placeholder="Confirm Password"
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
							{isLoading ? "Resetting Password..." : "Reset Password"}
							<ChevronRight className="ml-2 size-5" />
						</Button>
					</div>
					<div className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link
							href={redirects.toSignup}
							className="text-sidebar underline-offset-4 hover:underline"
						>
							Sign up
						</Link>
					</div>
				</form>
			</Form>
		</div>
	);
}
