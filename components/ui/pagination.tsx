"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	className?: string;
}

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	className,
}: PaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPageUrl = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		return `?${params.toString()}`;
	};

	const handlePageChange = (page: number) => {
		router.push(createPageUrl(page));
	};

	const createPageButton = (pageNumber: number) => (
		<Button
			key={pageNumber}
			size="sm"
			variant={pageNumber === currentPage ? "default" : "outline"}
			onClick={() => handlePageChange(pageNumber)}
			disabled={pageNumber === currentPage}
			className={pageNumber === currentPage ? "bg-primary text-white" : ""}
		>
			{pageNumber}
		</Button>
	);

	const pageButtons = [];

	// Always show first page
	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) {
			pageButtons.push(createPageButton(i));
		}
	} else {
		pageButtons.push(createPageButton(1));

		// Left side ellipsis
		if (currentPage > 4) {
			pageButtons.push(
				<span key="start-ellipsis" className="text-muted-foreground px-2">
					…
				</span>
			);
		}

		// Pages around current
		for (
			let i = Math.max(2, currentPage - 2);
			i <= Math.min(totalPages - 1, currentPage + 2);
			i++
		) {
			if (i !== 1 && i !== totalPages) {
				pageButtons.push(createPageButton(i));
			}
		}

		// Right side ellipsis
		if (currentPage < totalPages - 3) {
			pageButtons.push(
				<span key="end-ellipsis" className="text-muted-foreground px-2">
					…
				</span>
			);
		}

		// Always show last page
		if (totalPages > 1) {
			pageButtons.push(createPageButton(totalPages));
		}
	}

	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className={cn("flex items-center justify-between", className)}>
			<div className="text-muted-foreground text-sm">
				Showing {startItem}-{endItem} of {totalItems} items
			</div>

			<div className="flex items-center gap-2">
				{/* Previous Button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage <= 1}
				>
					<ArrowLeft className="h-4 w-4" />
					Previous
				</Button>

				{/* Page Numbers */}
				<div className="flex items-center gap-1">{pageButtons}</div>

				{/* Next Button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
				>
					Next
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
