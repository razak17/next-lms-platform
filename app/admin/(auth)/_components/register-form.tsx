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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { redirects } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { signUp } from "@/server/auth";

import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { registerSchema } from "@/lib/validations/auth";
import { Loader2 } from "lucide-react";
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

	const genderOptions = [
		{ value: "male", label: "Male" },
		{ value: "femaile", label: "Female" },
		{ value: "other", label: "Other" },
	];

	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setIsLoading(true);

		const { email, password, firstName, lastName, gender } = values;

		const { success, message } = await signUp({
			email,
			password,
			firstName,
			lastName,
			gender,
			role: "admin",
		});

		if (success) {
			toast.success(
				`${message} Please check your email for your verification code.`
			);
			router.push(
				`${redirects.adminToVerify}?email=${encodeURIComponent(email)}`
			);
		} else {
			toast.error(message);
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
					<CardTitle className="text-xl">Admin Sign up</CardTitle>
					<CardDescription className="px-8 text-center">
						Create Your Account to Manage and Access the Dashboard Effortlessly
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6">
								<div className="grid gap-6">
									<div className="grid gap-4">
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input {...field} />
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
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input {...field} />
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
													<FormLabel>Gender</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl className="w-full">
															<SelectTrigger>
																<SelectValue />
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
										<FormField
											control={form.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Confirm Password</FormLabel>
													<FormControl>
														<PasswordInput {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading && (
											<Loader2 className="mr-2 size-4 animate-spin" />
										)}
										{isLoading ? "Signing up..." : "SIgn up"}
									</Button>
								</div>
								<div className="text-center text-sm">
									Already have an account?{" "}
									<Link
										href={`${redirects.adminToLogin}`}
										className="text-sidebar underline-offset-4 hover:underline"
									>
										Login
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
