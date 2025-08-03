import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle,
} from "@/components/ui/card";
import { User } from "@/db/schema";
import { UserProfileForm } from "./user-profile-form";

export function UserProfileDetails({ user }: { user: User }) {
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
					<Avatar className="h-42 w-42 rounded-full grayscale">
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
					<p>Change profile picture</p>
				</div>
				<div className="flex flex-col items-center gap-2 mt-4">
          <UserProfileForm user={user} />
        </div>
			</CardContent>
		</Card>
	);
}
