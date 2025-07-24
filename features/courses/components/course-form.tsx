"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateCourseSchema, createCourseSchema } from "../validations/courses";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFile } from "@/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { StoredFile } from "@/types";
import { createCourse } from "../actions/courses";
import { getErrorMessage } from "@/lib/handle-error";
import { Course, Track } from "@/db/schema";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from "@/components/ui/select";

interface CourseFormProps {
	userId: string;
	tracks?: Track[];
	course?: CreateCourseSchema;
	onSuccess?: () => void;
}

export function CourseForm({
	userId,
	tracks,
	course,
	onSuccess,
}: CourseFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { uploadFiles, progresses, isUploading } =
		useUploadFile("imageUploader");

	const router = useRouter();
	const form = useForm<CreateCourseSchema>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: course ?? {
			title: "",
			trackId: "",
			image: null,
			description: "",
		},
	});

	async function onSubmit(values: CreateCourseSchema) {
		setIsLoading(true);
		try {
			const uploaded = await uploadFiles(values.image ?? []);
			let imageToSave = null;
			if (uploaded && uploaded.length > 0) {
				imageToSave = uploaded[0];
			}
			const newCourse = await createCourse({
				...values,
				userId,
				image: JSON.stringify(imageToSave) as unknown as StoredFile,
			});
			if (newCourse.error) {
				setIsLoading(false);
				throw new Error(newCourse.error);
			}
			toast.success("Course created successfully");
      form.reset({ ...form.getValues(), image: [] });
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error("Error creating course:", error);
			toast.error(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-6">
					<div className="grid gap-4">
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="trackId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Track</FormLabel>
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
												{tracks.map((track, i) => (
													<SelectItem key={i} value={track.id}>
														{track.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<div className="space-y-4">
										<FormItem>
											<FormLabel>Picture</FormLabel>
											<FormControl>
												<FileUploader
													className="flex h-38 flex-col items-center justify-center"
													value={field.value ?? undefined}
													onValueChange={field.onChange}
													maxFiles={1}
													maxSize={4 * 1024 * 1024}
													progresses={progresses}
													disabled={isUploading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<div className="flex flex-col gap-2">
								<FormField
									control={form.control}
									name="description"
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
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							{isLoading ? "Creating Course..." : "Create Course"}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
