import { siteConfig } from "@/data/site";
import { User } from "@/db/schema";
import { MainNav } from "@/features/learner/shared/layouts/main-nav";
import { MobileNav } from "@/features/learner/shared/layouts/mobile-nav";

interface SiteHeaderProps {
	user?: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
	return (
		<header className="bg-background sticky top-0 z-50 w-full border-b">
			<div className="flex h-16 items-center">
				<MainNav items={siteConfig.mainNav} user={user} />
				<MobileNav items={siteConfig.mainNav} user={user} />
			</div>
		</header>
	);
}
