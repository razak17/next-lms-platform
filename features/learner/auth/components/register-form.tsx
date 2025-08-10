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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { genderOptions, redirects } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { signUp } from "@/features/shared/actions/auth";

import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { registerSchema } from "@/features/shared/validations/auth";
import { authClient } from "@/lib/auth/client";
import { ChevronRight, Loader2, LockKeyhole, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			gender: "male",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const signInWithGoogle = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: redirects.toDashboard,
		});
	};

	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setIsLoading(true);

		const { email, password, firstName, lastName, gender } = values;

		const { success, message } = await signUp({
			email,
			password,
			firstName,
			lastName,
			gender,
			role: "learner",
		});

		if (success) {
			toast.success(
				`${message} Please check your email for your verification code.`
			);
			router.push(`${redirects.toVerify}?email=${encodeURIComponent(email)}`);
		} else {
			toast.error(message);
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<h2 className="text-center text-2xl font-semibold">
				Sign up to get started
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
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<User
													aria-hidden="true"
													className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
												/>
												<Input
													placeholder="First Name"
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
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<User
													aria-hidden="true"
													className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
												/>
												<Input
													placeholder="Last Name"
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
								name="gender"
								render={({ field }) => (
									<FormItem>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-secondary w-full p-0 pr-2">
													<div className="relative pl-9">
														<User
															aria-hidden="true"
															className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
														/>
														<SelectValue />
													</div>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{genderOptions?.map((genderOption, i) => (
													<SelectItem key={i} value={genderOption.value}>
														{genderOption.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
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
							{isLoading ? "Signing up..." : "SIgn up"}
							<ChevronRight className="ml-2 size-5" />
						</Button>
						<div className="text-center text-sm">
							<Link
								href={`${redirects.toLogin}`}
								className="text-sidebar hover:text-sidebar/80 underline underline-offset-4"
							>
								Already have an account? <span>Login</span>
							</Link>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
