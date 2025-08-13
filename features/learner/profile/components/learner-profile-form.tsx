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
import { learnerProfileSchema } from "@/features/learner/profile/validations/profile";
import { updateUser } from "@/features/shared/actions/users";
import { genderOptions } from "@/lib/constants";
import { getErrorMessage } from "@/lib/handle-error";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { z } from "zod";

export function LearnerProfileForm({ user }: { user: User }) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const form = useForm<z.infer<typeof learnerProfileSchema>>({
		resolver: zodResolver(learnerProfileSchema),
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

	async function onSubmit(values: z.infer<typeof learnerProfileSchema>) {
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
				image: user.image,
			});

			if ("error" in updatedUser) {
				toast.error(updatedUser.error);
				return;
			}
			toast.success("Profile updated successfully");
			router.refresh();
		} catch (error) {
			console.error("Error updating user profile:", error);
			toast.error(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<div className="grid gap-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter your first name" />
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
										<Input {...field} placeholder="Enter your last name" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
												<SelectValue placeholder="Select your gender" />
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
										<Input
											disabled
											{...field}
											placeholder="Your email address"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
												placeholder: "Enter your phone number",
											}}
											inputStyle={{
												width: "100%",
												height: "40px",
												fontSize: "14px",
												borderRadius: "6px",
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
										<Input {...field} placeholder="Enter your location" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder="Tell us a bit about yourself..."
										className="min-h-[100px]"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							form.reset();
						}}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading || !form.formState.isDirty}>
						{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
						{`${isLoading ? "Saving" : "Save"} Changes${isLoading ? "..." : ""}`}
					</Button>
				</div>
			</form>
		</Form>
	);
}
