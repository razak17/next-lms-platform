import { NavItem } from "@/types";

export const mainNav: NavItem[] = [
	{
		title: "Home",
		url: "/",
	},
	{
		title: "Tracks",
		url: "/tracks",
	},
];

export const adminNav: NavItem[] = [
	{
		title: "Dashboard",
		url: "/admin/dashboard",
		icon: "dashboard",
	},
	{
		title: "Invoices",
		url: "/admin/invoices",
		icon: "invoices",
	},
	{
		title: "Learners",
		url: "/admin/learners",
		icon: "learners",
	},
	{
		title: "Tracks",
		url: "/admin/tracks",
		icon: "tracks",
	},
	{
		title: "Courses",
		url: "/admin/courses",
		icon: "tracks",
	},
	{
		title: "Report",
		url: "/admin/reports",
		icon: "dashboard",
	},
];

export const siteConfig = {
	name: "G-Client",
	description: "E-Learning Platform",
	url: "https://g-client.vercel.app",
	mainNav,
	adminNav,
};
