import { StaticImageData } from "next/image";
import { Icons } from "@/components/icons";
import { user } from "@/db/schema";

export type User = typeof user.$inferSelect;

export interface NavItem {
	title: string;
	url: string;
	disabled?: boolean;
	external?: boolean;
	shortcut?: [string, string];
	icon?: keyof typeof Icons;
	label?: string;
	description?: string;
	isActive?: boolean;
	items?: NavItem[];
}

export interface CardItem {
	title: string;
	value: string;
	change: string;
	changeDirection: "up" | "down";
	icon?: React.ReactNode;
}

export interface TrackCardItem {
	title: string;
	duration: string;
	description: string;
	image: StaticImageData;
	skills: string[];
	price?: number;
	isPopular?: boolean;
}
