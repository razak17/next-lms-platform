"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { AvatarImagePreview } from "@/components/avatar-preview";
import { FileUploader } from "@/components/file-uploader";
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
import { updateUser } from "../../../shared/actions/usersactions/users";

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

	const { uploadFiles, progresses, isUploading } = useUploadFile(
		"imageUploader",
		{
			defaultUploadedFiles: [],
		}
	);

	const handleUpload = useCallback(async () => {
		if (!selectedFile) return;

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
			onSuccess?.();
			onClose();
			setSelectedFile(null);
		} catch (error) {
			console.error("Error uploading profile image:", error);
			toast.error("Failed to upload profile picture");
		}
	}, [selectedFile, uploadFiles, user, onSuccess, onClose]);

	const handleClose = useCallback(() => {
		if (isUploading) return;
		onClose();
	}, [isUploading, onClose]);

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Update Profile Picture
					</DialogTitle>
					<DialogDescription>
						Upload a new profile picture. Supported formats: JPG, PNG, WebP.
						Maximum size: 4MB.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
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

					<div className="space-y-4">
						<div className="text-muted-foreground text-sm font-medium">
							New Picture
						</div>

						{!selectedFile ? (
							<FileUploader
								className="flex h-38 flex-col items-center justify-center"
								value={[]}
								onValueChange={(files) => {
									const filesArray = files as File[];
									if (filesArray.length > 0) {
										const file = filesArray[0];

										if (file.size > 4 * 1024 * 1024) {
											toast.error("File size exceeds 4MB limit");
											return;
										}
										setSelectedFile(file);
									}
								}}
								maxFiles={1}
								maxSize={4 * 1024 * 1024}
								progresses={progresses}
								disabled={isUploading}
								preview={false}
							/>
						) : (
							<div className="space-y-4">
								<AvatarImagePreview
									file={selectedFile}
									progress={progresses[selectedFile.name]}
									isUploading={isUploading}
									onRemove={() => {
										setSelectedFile(null);
									}}
								/>
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
