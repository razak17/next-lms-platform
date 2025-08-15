"use client";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Loader2,
	CreditCard,
	Mail,
	User as UserIcon,
	Users as UsersIcon,
	MapPin,
	GraduationCapIcon,
} from "lucide-react";
import {
	enrollmentSchema,
	EnrollmentFormData,
} from "../validations/enrollment";
import { User } from "@/db/schema/user";
import { genderOptions } from "@/lib/constants";
import { updateUser } from "@/features/shared/actions/users";
import { toast } from "sonner";
import "react-phone-input-2/lib/style.css";

interface Track {
	id: string;
	name: string;
	description: string;
	price: string | number;
	duration: string;
	instructor: string;
	image?: { url: string } | null;
	courses?: Array<{ id: string; title?: string; name?: string }>;
}

interface CheckoutFormProps {
	track: Track;
	user?: User;
}

export function CheckoutForm({ track, user }: CheckoutFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [promoApplied, setPromoApplied] = useState(false);
	const [discountAmount, setDiscountAmount] = useState(0);
	const router = useRouter();

	const form = useForm<EnrollmentFormData>({
		resolver: zodResolver(enrollmentSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			track: track?.name || "",
			gender: user?.gender || undefined,
			phone: user?.phone || "",
			location: user?.location || "",
			disabled: false,
		},
	});

	async function onSubmit(values: EnrollmentFormData) {
		setIsSubmitting(true);

		try {
			if (!user?.id) {
				toast.error("User not found. Please log in and try again.");
				return;
			}

			const updatedUser = await updateUser(user.id, {
				firstName: values.name.split(" ")[0] || "",
				lastName: values.name.split(" ").slice(1).join(" ") || "",
				email: values.email,
				gender: values.gender,
				phone: values.phone || null,
				location: values.location || null,
				bio: values.bio || null,
				image: user.image,
			});

			if ("error" in updatedUser) {
				toast.error(updatedUser.error);
				return;
			}

			toast.success("Information updated successfully!");

			router.push(`/tracks/${track.id}/purchase`);
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update information. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 lg:max-w-6xl">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Left Column - Form */}
						<div className="lg:col-span-2">
							<Card className="rounded-sm border-none shadow-lg">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-2xl">
										<UserIcon size={20} />
										Personal Information
									</CardTitle>
									<p className="text-muted-foreground text-sm">
										Please provide your details to complete the enrollment
										process.
									</p>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="relative">
														<UserIcon
															aria-hidden="true"
															className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
														/>
														<Input
															placeholder="Name"
															className="bg-secondary pl-9"
															disabled
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
															disabled
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
										name="track"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="relative">
														<GraduationCapIcon
															aria-hidden="true"
															className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
														/>
														<Input
															placeholder="Track"
															className="bg-secondary pl-9"
															disabled
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
																<UserIcon
																	aria-hidden="true"
																	className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
																/>
																<SelectValue placeholder="Select gender" />
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
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<PhoneInput
														placeholder="Phone Number"
														country="gh"
														value={field.value}
														onChange={(phone) => field.onChange(phone)}
														inputClass="!w-full !h-10 !border-input !bg-secondary !text-foreground"
														containerClass="!w-full"
														buttonClass="!bg-secondary !border-input"
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
												<FormControl>
													<div className="relative">
														<MapPin
															aria-hidden="true"
															className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
														/>
														<Input
															placeholder="Location"
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
										name="disabled"
										render={({ field }) => (
											<FormItem>
												<Select
													onValueChange={(value) => {
														field.onChange(value === "true");
													}}
													defaultValue={`${field.value}`}
												>
													<FormControl>
														<SelectTrigger className="bg-secondary w-full p-0 pr-2">
															<div className="relative pl-9">
																<UsersIcon
																	aria-hidden="true"
																	className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
																/>
																<SelectValue placeholder="Do you have a disability?" />
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="false">
															<span className="ml-2">No</span>
														</SelectItem>
														<SelectItem value="true">
															<span className="ml-2">Yes</span>
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="bio"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														rows={6}
														placeholder="Tell us about yourself"
														className="bg-secondary"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>

						<div className="lg:col-span-1">
							<h1 className="text-2xl font-bold md:text-3xl">
								Complete Payment
							</h1>
							<Card className="mt-6 overflow-hidden rounded-xs border-none shadow-lg">
								<CardContent className="flex flex-col gap-8 p-6">
									<h3 className="border-b pb-4 text-3xl font-semibold">
										${track.price} USD
									</h3>
									<div className="space-y-4">
										<div>
											<p className="text-muted-foreground mb-2 text-sm">
												Track
											</p>
											<p className="font-medium">{track.name}</p>
										</div>
										<div>
											<p className="text-muted-foreground mb-2 text-sm">
												Price
											</p>
											<p className="text-lg font-medium">${track.price} USD</p>
										</div>
									</div>

									<Button
										type="submit"
										size="lg"
										className="w-full rounded-sm py-6 font-semibold"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-5 w-5 animate-spin" />
												Updating Information...
											</>
										) : (
											<>
												<CreditCard className="mr-2 h-5 w-5" />
												Continue To Payment
											</>
										)}
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
