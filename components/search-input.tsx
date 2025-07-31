"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = ({ placeholder }: { placeholder?: string }) => {
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
		<div className="relative">
			<Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
			<Input
				onChange={(e) => setValue(e.target.value)}
				value={value}
				className="rounded-md pl-9 shadow-sm md:w-40 lg:w-[350px]"
				placeholder={placeholder ?? "Search"}
			/>
		</div>
	);
};
