"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { redirects } from "@/lib/constants";
import { loginSchema } from "@/lib/validations/auth";
import { sendVerificationOtp, signIn } from "@/features/auth/actions/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true);

		const { success, statusCode, message } = await signIn(
			values.email,
			values.password
		);

		if (success) {
			toast.success(message);
			router.push(redirects.adminToDashboard);
		} else {
			if (statusCode === 403) {
				const { success: otpSuccess } = await sendVerificationOtp(values.email);

				if (otpSuccess) {
					toast.success(
						`${message} Please check your email for your verification code.`
					);
					router.push(
						`${redirects.adminToVerify}?email=${encodeURIComponent(values.email)}`
					);
				}
			} else {
				toast.error(message);
			}
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
					<CardTitle className="text-xl">Admin Login</CardTitle>
					<CardDescription className="px-8 text-center">
						Login to Manage and Access the Dashboard Effortlessly
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6">
								<div className="grid gap-6">
									<div className="grid gap-3">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<PasswordInput {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Link
											href={`${redirects.adminToForgotPassword}`}
											className="text-sidebar mr-auto text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</Link>
									</div>
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading && (
											<Loader2 className="mr-2 size-4 animate-spin" />
										)}
										{isLoading ? "Logging in..." : "Login"}
									</Button>
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<Link
										href={`${redirects.adminToSignup}`}
										className="text-sidebar underline-offset-4 hover:underline"
									>
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
