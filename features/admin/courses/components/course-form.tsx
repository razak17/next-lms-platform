"use client";

import {
	AvatarImagePreview,
	AvatarUploadedFiles,
} from "@/components/avatar-preview";
import { FileUploader } from "@/components/file-uploader";
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
import { Course, Track } from "@/db/schema";
import { useUploadFile } from "@/hooks/use-upload-file";
import { getErrorMessage } from "@/lib/handle-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCourse, updateCourse } from "../actions/courses";
import { CreateCourseSchema, createCourseSchema } from "../validations/courses";

interface CourseFormProps {
	tracks: Track[];
	course?: Course;
	onSuccess?: () => void;
}

export function CourseForm({ tracks, course, onSuccess }: CourseFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
		"imageUploader",
		{
			defaultUploadedFiles: course?.image ? [course?.image] : [],
		}
	);

	const router = useRouter();
	const form = useForm<CreateCourseSchema>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: {
			title: course?.title || "",
			trackId: course?.trackId || "",
			description: course?.description || "",
		},
	});

	async function onSubmit(values: CreateCourseSchema) {
		setIsLoading(true);
		try {
			const uploaded = await uploadFiles(values.image ?? []);
			let imageToSave = null;
			if (uploaded && uploaded.length > 0) {
				imageToSave = uploaded[0];
			} else if (course && course.image) {
				imageToSave = course.image;
			}
			const action = course ? updateCourse.bind(null, course.id) : createCourse;
			const data = await action({
				...values,
				image: imageToSave,
			});
			if (data.error) {
				toast.error(data.message || "Failed to create course");
				return;
			}
			toast.success(data.message || "Course created successfully");
			if (onSuccess) {
				onSuccess();
			}
			router.refresh();
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
										<FormLabel>Title *</FormLabel>
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
										<FormLabel>Track *</FormLabel>
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
												{tracks?.map((track, i) => (
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
													preview={false}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
										{field.value?.length ? (
											<div className="space-y-4">
												{field.value.map((file) => {
													return (
														<div
															key={file.lastModified}
															className="flex flex-col items-center gap-4"
														>
															<AvatarImagePreview
																file={file}
																progress={progresses[file.name]}
																isUploading={isUploading}
																onRemove={() => {
																	field.onChange(
																		field.value?.filter((f) => f !== file)
																	);
																}}
															/>
														</div>
													);
												})}
											</div>
										) : null}
										{!field.value?.length && uploadedFiles.length > 0 ? (
											<AvatarUploadedFiles uploadedFiles={uploadedFiles} />
										) : null}
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
											<FormLabel>Description *</FormLabel>
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
							{course
								? `${isLoading ? "Updating" : "Update"} Course${isLoading ? "..." : ""}`
								: `${isLoading ? "Creating" : "Create"} Course${isLoading ? "..." : ""}`}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
