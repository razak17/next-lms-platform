import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function normalize(str: string) {
	return str === "/" ? "/" : str.replace(/\/$/, "");
}

export function isActiveUrl(pathname: string, url: string) {
	const normalizedPathname = normalize(pathname || "/");
	const normalizedItemUrl = normalize(url);
	const isActive = normalizedPathname === normalizedItemUrl;
	return isActive;
}

export function formatPrice(
	price: number | string,
	opts: Intl.NumberFormatOptions = {}
) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: opts.currency ?? "USD",
		notation: opts.notation ?? "compact",
		...opts,
	}).format(Number(price));
}

export function formatNumber(
	number: number | string,
	opts: Intl.NumberFormatOptions = {}
) {
	return new Intl.NumberFormat("en-US", {
		style: opts.style ?? "decimal",
		notation: opts.notation ?? "standard",
		minimumFractionDigits: opts.minimumFractionDigits ?? 0,
		maximumFractionDigits: opts.maximumFractionDigits ?? 2,
		...opts,
	}).format(Number(number));
}

export function formatDate(
	date: Date | string | number,
	opts: Intl.DateTimeFormatOptions = {}
) {
	return new Intl.DateTimeFormat("en-US", {
		month: opts.month ?? "short",
		day: opts.day ?? "numeric",
		year: opts.year ?? "numeric",
		...opts,
	}).format(new Date(date));
}

export function formatBytes(
	bytes: number,
	decimals = 0,
	sizeType: "accurate" | "normal" = "normal"
) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
		sizeType === "accurate"
			? (accurateSizes[i] ?? "Bytest")
			: (sizes[i] ?? "Bytes")
	}`;
}

export function formatId(id: string) {
	return `#${id.toString().padStart(4, "0")}`;
}

export function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
	);
}
