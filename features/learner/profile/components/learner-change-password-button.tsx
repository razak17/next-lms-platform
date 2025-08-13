"use client";

import { Button } from "@/components/ui/button";
import { LearnerChangePasswordModal } from "@/features/learner/profile/components/learner-change-password-modal";
import { KeyRound } from "lucide-react";
import { useState } from "react";

export function LearnerChangePasswordButton() {
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

	return (
		<>
			<Button
				variant="outline"
				onClick={() => setShowChangePasswordModal(true)}
			>
				<KeyRound className="mr-2 h-4 w-4" />
				Change Password
			</Button>

			<LearnerChangePasswordModal
				isOpen={showChangePasswordModal}
				onClose={() => setShowChangePasswordModal(false)}
			/>
		</>
	);
}
