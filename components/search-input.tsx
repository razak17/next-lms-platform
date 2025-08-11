"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export const SearchInput = ({
	placeholder,
	className = "",
}: {
	placeholder?: string;
	className?: string;
}) => {
	const [value, setValue] = useState("");
	const debouncedValue = useDebounce(value);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentCategoryId = searchParams.get("categoryId");

	useEffect(() => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					categoryId: currentCategoryId,
					title: debouncedValue,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);

		router.push(url);
	}, [debouncedValue, currentCategoryId, router, pathname]);

	return (
		<div className="relative flex flex-col justify-center items-center">
			<Search className="absolute top-3 left-3 h-5 w-5 text-slate-600" />
			<Input
				onChange={(e) => setValue(e.target.value)}
				value={value}
				className={cn(
					"rounded-md pl-10 py-5 shadow-sm md:w-40 lg:w-[350px]",
					className
				)}
				placeholder={placeholder ?? "Search"}
			/>
		</div>
	);
};
