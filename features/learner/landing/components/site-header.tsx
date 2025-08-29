import { siteConfig } from "@/data/site";
import { User } from "@/db/schema";
import { MainNav } from "@/features/learner/shared/layouts/main-nav";
import { MobileNav } from "@/features/learner/shared/layouts/mobile-nav";
import { AuthDropdown } from "../../shared/layouts/auth-dropdown";

interface SiteHeaderProps {
	user?: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
	return (
		<header className="bg-background sticky top-0 z-50 w-full border-b">
			<div className="container mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
				<MainNav items={siteConfig.mainNav} />
				<MobileNav items={siteConfig.mainNav} user={user} />
				<div className="flex items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						<AuthDropdown user={user} />
					</nav>
				</div>
			</div>
		</header>
	);
}
