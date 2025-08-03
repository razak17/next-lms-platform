"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { User } from "@/db/schema";
import { userProfileSchema } from "@/features/admin/users/validations/users";
import { genderOptions, redirects } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { z } from "zod";
import { updateUser } from "../actions/users";

export function UserProfileForm({ user }: { user: User }) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const form = useForm<z.infer<typeof userProfileSchema>>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			gender: user.gender || undefined,
			email: user.email || "",
			bio: user.bio || "",
			phone: user.phone || "",
			location: user.location || "",
		},
	});

	async function onSubmit(values: z.infer<typeof userProfileSchema>) {
		setIsLoading(true);

		try {
			const updatedUser = await updateUser(user.id, {
				firstName: values.firstName,
				lastName: values.lastName,
				gender: values.gender,
				email: values.email,
				bio: values.bio || null,
				phone: values.phone || null,
				location: values.location || null,
			});

			if ("error" in updatedUser) {
				toast.error(updatedUser.error);
				return;
			}
			toast.success("Profile updated successfully");
			router.push(redirects.adminToProfile);
		} catch (error) {
			console.error("Error updating user profile:", error);
			toast.error("Failed to update profile. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-x-8">
				<div className="grid gap-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
										<Input disabled {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<PhoneInput
											enableAreaCodeStretch
											autoFormat
											enableSearch
											disableSearchIcon
											autocompleteSearch
											countryCodeEditable={true}
											country={"gh"}
											value={field.value}
											onChange={field.onChange}
											inputProps={{
												name: field.name,
												onBlur: field.onBlur,
												required: false,
											}}
											inputStyle={{
												width: "100%",
												border: "1px solid #e7e5e4",
											}}
											containerStyle={{ width: "100%" }}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex w-full items-center justify-between gap-4">
						<Button
							type="button"
							variant="secondary"
							className="flex-1"
							onClick={() => {
								form.reset();
							}}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !form.formState.isDirty}
							className="flex-1"
						>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							{`${isLoading ? "Saving" : "Save"} Changes${isLoading ? "..." : ""}`}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
