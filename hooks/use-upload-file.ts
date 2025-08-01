import type { StoredFile } from "@/types";
import * as React from "react";
import { toast } from "sonner";
import type { AnyFileRoute, UploadFilesOptions } from "uploadthing/types";

import { type OurFileRouter } from "@/app/api/uploadthing/core";
import { getErrorMessage } from "@/lib/handle-error";
import { uploadFiles } from "@/lib/uploadthing";

interface UseUploadFileProps
	extends Pick<
		UploadFilesOptions<AnyFileRoute>,
		"headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
	> {
	defaultUploadedFiles?: StoredFile[];
}

export function useUploadFile(
	endpoint: keyof OurFileRouter,
	{ defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}
) {
	const [uploadedFiles, setUploadedFiles] =
		React.useState<StoredFile[]>(defaultUploadedFiles);
	const [progresses, setProgresses] = React.useState<Record<string, number>>(
		{}
	);
	const [isUploading, setIsUploading] = React.useState(false);

	async function uploadThings(files: File[]) {
		setIsUploading(true);
		try {
			const res = await uploadFiles(endpoint, {
				...props,
				files,
				onUploadProgress: ({ file, progress }) => {
					setProgresses((prev) => {
						return {
							...prev,
							[file.name]: progress,
						};
					});
				},
			});

			const formattedRes: StoredFile[] = res.map((file) => {
				return {
					id: file.key,
					name: file.name,
					url: file.ufsUrl,
				};
			});

			setUploadedFiles((prev) =>
				prev ? [...prev, ...formattedRes] : formattedRes
			);
			return formattedRes;
		} catch (err) {
			toast.error(getErrorMessage(err));
		} finally {
			setProgresses({});
			setIsUploading(false);
		}
	}

	return {
		uploadedFiles,
		progresses,
		uploadFiles: uploadThings,
		isUploading,
	};
}
