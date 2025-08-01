"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateTrackSchema, createTrackSchema } from "../validations/tracks";
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
import { createTrack, updateTrack } from "../actions/tracks";
import { getErrorMessage } from "@/lib/handle-error";
import { Track } from "@/db/schema/track";
import { Files } from "@/components/files";

interface TrackFormProps {
	userId: string;
	track?: Track;
	onSuccess?: () => void;
}

export function TrackForm({ userId, track, onSuccess }: TrackFormProps) {
	console.warn("DEBUGPRINT[1101]: track-form.tsx:34: track=", track?.image);
	const [isLoading, setIsLoading] = useState(false);
	const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
		"imageUploader",
		{
			defaultUploadedFiles: track?.image ? [track?.image] : [],
		}
	);

	const router = useRouter();
	const form = useForm<CreateTrackSchema>({
		resolver: zodResolver(createTrackSchema),
		defaultValues: {
			name: track?.name || "",
			price: track?.price || "",
			duration: track?.duration || "",
			instructor: track?.instructor || "",
			description: track?.description || "",
		},
	});

	async function onSubmit(values: CreateTrackSchema) {
		setIsLoading(true);
		try {
			const uploaded = await uploadFiles(values.image ?? []);
			let imageToSave = null;
			if (uploaded && uploaded.length > 0) {
				imageToSave = uploaded[0];
			} else if (track && track.image) {
				imageToSave = track.image;
			}
			const action = track ? updateTrack.bind(null, track.id) : createTrack;
			const data = await action({
				...values,
				image: imageToSave,
				userId,
			});
			if (data.error) {
				toast.error(data.message || "Failed to create track");
				return;
			}
			toast.success(data.message || "Track created successfully");
			if (onSuccess) {
				onSuccess();
			}
			router.refresh();
		} catch (error) {
			console.error("Error creating track:", error);
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Track Name</FormLabel>
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
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input {...field} onChange={field.onChange} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<FormField
								control={form.control}
								name="duration"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Duration</FormLabel>
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
								name="instructor"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Instructor</FormLabel>
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
								name="image"
								render={({ field }) => (
									<div className="space-y-4">
										<FormItem>
											<FormLabel>Picture</FormLabel>
											<FormControl>
												<FileUploader
													className="flex h-38 flex-col items-center justify-center"
													value={field.value ?? []}
													onValueChange={field.onChange}
													maxFiles={1}
													maxSize={4 * 1024 * 1024}
													progresses={progresses}
													disabled={isUploading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
										{!field.value?.length && uploadedFiles.length > 0 ? (
											<Files files={uploadedFiles} />
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
							{track
								? `${isLoading ? "Updating" : "Update"} Track`
								: `${isLoading ? "Creating" : "Create"} Track`}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
