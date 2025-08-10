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
import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { otpVerificationSchema } from "@/features/shared/validations/auth";
import { sendVerificationOtp } from "@/features/shared/actions/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function OTPVerificationForm({
	className,
	email,
	...props
}: React.ComponentProps<"div"> & { email: string }) {
	const [isLoading, setIsLoading] = useState(false);
	const [isResendingCode, setIsResendingCode] = useState(false);
	const [cooldown, setCooldown] = useState(60);

	const router = useRouter();
	const form = useForm<z.infer<typeof otpVerificationSchema>>({
		resolver: zodResolver(otpVerificationSchema),
		defaultValues: {
			code: "",
		},
	});

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (cooldown > 0) {
			timer = setInterval(() => {
				setCooldown((prev) => prev - 1);
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [cooldown]);

	async function resendVerificaiontOtp() {
		setIsResendingCode(true);
		const result = await sendVerificationOtp(email);
		if (result.success) {
			toast.success(result.message);
			setCooldown(60);
		} else {
			toast.error(result.message);
		}
		setIsResendingCode(false);
	}

	async function onSubmit(values: z.infer<typeof otpVerificationSchema>) {
		setIsLoading(true);

		const verifyResult = await authClient.emailOtp.verifyEmail({
			email,
			otp: values.code,
		});

		if (verifyResult.error) {
			toast.error(verifyResult.error.message);
		} else {
			toast.success("Your account has been verified.");
			router.push(redirects.adminToDashboard);
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
					<CardTitle className="text-xl">OTP Verification</CardTitle>
					<CardDescription className="px-8 text-center">
						Enter the verification code we sent to your {email}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6">
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="code"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Code</FormLabel>
												<FormControl>
													<Input type="text" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading || isResendingCode}
								>
									{isLoading && (
										<Loader2 className="mr-2 size-4 animate-spin" />
									)}
									{isLoading ? "Verifying..." : "Verify Account"}
								</Button>
							</div>
							<div className="text-center text-sm">
								Didn&apos;t receive code?{" "}
								<Button
									type="button"
									variant="link"
									onClick={resendVerificaiontOtp}
									disabled={isResendingCode || cooldown > 0}
									className="h-auto p-0 underline-offset-4 hover:underline"
								>
									{isResendingCode ? (
										<Loader2 className="size-4 animate-spin" />
									) : cooldown > 0 ? (
										`Resend code in ${cooldown}s`
									) : (
										"Resend code"
									)}
								</Button>
							</div>
							<div className="text-center text-sm">
								<Link
									href={`${redirects.adminToLogin}`}
									className="text-sidebar underline-offset-4 hover:underline"
								>
									Back to login
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
