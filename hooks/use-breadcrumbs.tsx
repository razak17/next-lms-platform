"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
	title: string;
	link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
	"/admin/dashboard": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Overview", link: "/admin/dashboard" }
  ],
	"/admin/invoices": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Invoices", link: "/admin/invoices" },
  ],
	"/admin/learners": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Learners", link: "/admin/Learners" },
  ],
	"/admin/tracks": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Tracks", link: "/admin/Tracks" },
  ],
	"/admin/courses": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Courses", link: "/admin/Courses" },
  ],
	"/admin/report": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Report", link: "/admin/Report" },
  ],
	"/admin/profile": [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Profile", link: "/admin/profile" },
  ],
	// Add more custom mappings as needed
};

export function useBreadcrumbs() {
	const pathname = usePathname();

	const breadcrumbs = useMemo(() => {
		// Check if we have a custom mapping for this exact path
		if (routeMapping[pathname]) {
			return routeMapping[pathname];
		}

		// If no exact match, fall back to generating breadcrumbs from the path
		const segments = pathname.split("/").filter(Boolean);
		return segments.map((segment, index) => {
			const path = `/${segments.slice(0, index + 1).join("/")}`;
			return {
				title: segment.charAt(0).toUpperCase() + segment.slice(1),
				link: path,
			};
		});
	}, [pathname]);

	return breadcrumbs;
}
