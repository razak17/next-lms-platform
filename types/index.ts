import { StaticImageData } from "next/image";
import { Icons } from "@/components/icons";

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
	image: StaticImageData | string;
	techStack: string[];
	instructor: string;
	price?: number;
	isPopular?: boolean;
}

export interface StoredFile {
	id: string;
	name: string;
	url: string;
}
