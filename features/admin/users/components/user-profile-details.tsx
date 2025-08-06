"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { User } from "@/db/schema";
import { Camera, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChangePasswordModal } from "./change-password-modal";
import { ProfileImageUploadModal } from "./profile-image-upload-modal";
import { UserProfileForm } from "./user-profile-form";

export function UserProfileDetails({ user }: { user: User }) {
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
	const router = useRouter();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="sr-only">Manage Profile</CardTitle>
				<CardDescription className="sr-only">
					Update your profile information and preferences
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center gap-4">
					<div className="relative">
						<Avatar className="h-42 w-42 rounded-full">
							<AvatarImage
								src={user?.image ? user?.image : undefined}
								alt={user?.name}
							/>
							<AvatarFallback className="text-sidebar-accent-foreground rounded-full text-6xl">
								{user?.name
									? user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
									: "U"}
							</AvatarFallback>
						</Avatar>
						<Button
							variant="outline"
							size="icon"
							className="absolute right-2 -bottom-2 h-12 w-12 rounded-full"
							onClick={() => setShowUploadModal(true)}
						>
							<Camera className="size-5" />
						</Button>
					</div>
					<Button
						variant="link"
						className="text-muted-foreground text-sm"
						onClick={() => setShowUploadModal(true)}
					>
						Change profile picture
					</Button>
					<Button
						variant="outline"
						className="mt-2"
						onClick={() => setShowChangePasswordModal(true)}
					>
						<KeyRound className="mr-2 h-4 w-4" />
						Change Password
					</Button>
				</div>
				<div className="mt-4 flex flex-col items-center gap-2">
					<UserProfileForm user={user} />
				</div>
			</CardContent>

			<ProfileImageUploadModal
				user={user}
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
				onSuccess={() => {
					router.refresh();
				}}
			/>

			<ChangePasswordModal
				isOpen={showChangePasswordModal}
				onClose={() => setShowChangePasswordModal(false)}
			/>
		</Card>
	);
}
