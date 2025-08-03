"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@/features/admin/auth/validations/auth";
import { Icons } from "@/components/icons";

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
			router.push("/admin/login");
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<div className="flex w-full items-center justify-center">
					<Icons.logo className="h-12 w-24" aria-hidden="true" />
				</div>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Admin Reset Password</CardTitle>
					<CardDescription className="px-8 text-center">
						Enter your new password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6">
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input {...field} type="password" />
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
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input {...field} type="password" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										"Reset Password"
									)}
								</Button>
							</div>
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link
									href="/admin/register"
									className="text-sidebar underline-offset-4 hover:underline"
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
