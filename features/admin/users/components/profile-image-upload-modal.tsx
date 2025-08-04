"use client";

import { Camera, Loader2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/db/schema";
import { useUploadFile } from "@/hooks/use-upload-file";
import { cn } from "@/lib/utils";
import { updateUser } from "../actions/users";

interface ProfileImageUploadModalProps {
	user: User;
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function ProfileImageUploadModal({
	user,
	isOpen,
	onClose,
	onSuccess,
}: ProfileImageUploadModalProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	const { uploadFiles } = useUploadFile("imageUploader");

	
	const cleanupPreview = useCallback(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		setSelectedFile(null);
	}, [previewUrl]);

	
	useEffect(() => {
		if (!isOpen) {
			cleanupPreview();
		}
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [isOpen, cleanupPreview, previewUrl]);

	const validateAndSetFile = useCallback(
		(file: File) => {
			
			if (!file.type.startsWith("image/")) {
				toast.error("Please select a valid image file");
				return false;
			}

			
			if (file.size > 4 * 1024 * 1024) {
				toast.error("File size must be less than 4MB");
				return false;
			}

			
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}

			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			return true;
		},
		[previewUrl]
	);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		validateAndSetFile(file);
	};

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			validateAndSetFile(files[0]);
		}
	};

	const handleRemoveFile = useCallback(() => {
		cleanupPreview();
	}, [cleanupPreview]);

	const handleUpload = useCallback(async () => {
		if (!selectedFile) return;

		setIsUploading(true);
		try {
			
			const uploaded = await uploadFiles([selectedFile]);

			if (!uploaded || uploaded.length === 0) {
				toast.error("Failed to upload image");
				return;
			}

			
			const updatedUser = await updateUser(user.id, {
				firstName: user.firstName!,
				lastName: user.lastName!,
				gender: user.gender!,
				email: user.email,
				bio: user.bio,
				phone: user.phone,
				location: user.location,
				image: uploaded[0].url,
			});

			if ("error" in updatedUser) {
				toast.error(updatedUser.error);
				return;
			}

			toast.success("Profile picture updated successfully");
			cleanupPreview();
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error("Error uploading profile image:", error);
			toast.error("Failed to upload profile picture");
		} finally {
			setIsUploading(false);
		}
	}, [selectedFile, uploadFiles, user, cleanupPreview, onSuccess, onClose]);

	const handleClose = useCallback(() => {
		if (isUploading) return;
		cleanupPreview();
		onClose();
	}, [isUploading, cleanupPreview, onClose]);

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Camera className="h-5 w-5" />
						Update Profile Picture
					</DialogTitle>
					<DialogDescription>
						Upload a new profile picture. Supported formats: JPG, PNG, WebP.
						Maximum size: 4MB.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{}
					<div className="flex flex-col items-center gap-4">
						<div className="text-muted-foreground text-sm font-medium">
							Current Picture
						</div>
						<Avatar className="h-24 w-24 rounded-full">
							<AvatarImage
								src={user?.image ? user?.image : undefined}
								alt={user?.name}
							/>
							<AvatarFallback className="text-2xl">
								{user?.name
									? user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
					</div>

					{}
					<div className="space-y-4">
						<div className="text-muted-foreground text-sm font-medium">
							New Picture
						</div>

						{!selectedFile ? (
							<div
								className="relative"
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
							>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileSelect}
									className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
									disabled={isUploading}
								/>
								<div
									className={cn(
										"rounded-lg border-2 border-dashed p-8 text-center transition-colors",
										"hover:border-muted-foreground/50 hover:bg-muted/25",
										"flex flex-col items-center gap-3",
										isDragOver
											? "border-primary bg-primary/5 border-solid"
											: "border-muted-foreground/25"
									)}
								>
									<Upload
										className={cn(
											"h-8 w-8 transition-colors",
											isDragOver ? "text-primary" : "text-muted-foreground"
										)}
									/>
									<div>
										<p className="text-sm font-medium">
											{isDragOver
												? "Drop image here"
												: "Click to upload an image"}
										</p>
										<p className="text-muted-foreground text-xs">
											{isDragOver ? "" : "Or drag and drop"}
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								{}
								<div className="flex flex-col items-center gap-4">
									<div className="relative">
										<Avatar className="h-24 w-24 rounded-full">
											<AvatarImage src={previewUrl!} alt="Preview" />
										</Avatar>
										<Button
											type="button"
											variant="outline"
											size="icon"
											className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
											onClick={handleRemoveFile}
											disabled={isUploading}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium">{selectedFile.name}</p>
										<p className="text-muted-foreground text-xs">
											{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
								</div>

								{}
								<div className="relative">
									<input
										type="file"
										accept="image/*"
										onChange={handleFileSelect}
										className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
										disabled={isUploading}
									/>
									<Button
										type="button"
										variant="outline"
										className="w-full"
										disabled={isUploading}
									>
										Choose Different Image
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleUpload}
						disabled={!selectedFile || isUploading}
					>
						{isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isUploading ? "Uploading..." : "Upload & Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
