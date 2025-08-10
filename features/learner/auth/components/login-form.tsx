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
import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { sendVerificationOtp, signIn } from "@/features/shared/actions/auth";
import { loginSchema } from "@/features/shared/validations/auth";
import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { ChevronRight, Loader2, LockKeyhole, Mail } from "lucide-react";
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

	const signInWithGoogle = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: redirects.toDashboard,
		});
	};

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true);

		const { success, statusCode, message } = await signIn(
			values.email,
			values.password
		);

		if (success) {
			toast.success(message);
			router.push(redirects.toDashboard);
		} else {
			if (statusCode === 403) {
				const { success: otpSuccess } = await sendVerificationOtp(values.email);

				if (otpSuccess) {
					toast.success(
						`${message} Please check your email for your verification code.`
					);
					router.push(
						`${redirects.toVerify}?email=${encodeURIComponent(values.email)}`
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
			<h2 className="text-center text-2xl font-semibold">
				Login to continue your learning journey
			</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid gap-4">
						<div className="mt-6 flex flex-col gap-2">
							<Button
								variant="outline"
								className="text-sidebar w-full"
								type="button"
								onClick={signInWithGoogle}
							>
								<Icons.google className="size-4" />
								<span>Login with Google</span>
							</Button>
						</div>
						<div className="text-center text-sm">
							<span className="relative z-10">or</span>
						</div>
						<div className="grid gap-4">
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
							<Link
								href={`${redirects.toForgotPassword}`}
								className="text-sidebar mr-auto text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</Link>
						</div>
						<Button
							type="submit"
							className="w-full rounded-sm"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							{isLoading ? "Logging in..." : "Login"}
							<ChevronRight className="ml-2 size-5" />
						</Button>
						<div className="text-center text-sm">
							<Link
								href={`${redirects.toSignup}`}
								className="text-sidebar hover:text-sidebar/80 underline underline-offset-4"
							>
								Need to create an account? <span>Sign up</span>
							</Link>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
