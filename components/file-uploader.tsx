"use client";

import * as React from "react";
import Image from "next/image";
import { Cross2Icon, UploadIcon } from "@radix-ui/react-icons";
import Dropzone, {
	type DropzoneProps,
	type FileRejection,
} from "react-dropzone";
import { toast } from "sonner";

import { cn, formatBytes } from "@/lib/utils";
import { useControllableState } from "@/hooks/use-controllable-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
	value?: File[];
	onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
	onUpload?: (files: File[]) => Promise<void>;
	progresses?: Record<string, number>;
	accept?: DropzoneProps["accept"];
	maxSize?: DropzoneProps["maxSize"];
	maxFiles?: DropzoneProps["maxFiles"];
	multiple?: boolean;
	disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
	const {
		value: valueProp,
		onValueChange,
		onUpload,
		progresses,
		accept = { "image/*": [] },
		maxSize = 1024 * 1024 * 2,
		maxFiles = 1,
		multiple = false,
		disabled = false,
		className,
		...dropzoneProps
	} = props;

	const [files, setFiles] = useControllableState({
		prop: valueProp,
		onChange: onValueChange,
	});
	const onDrop = React.useCallback(
		(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
				toast.error("Cannot upload more than 1 file at a time");
				return;
			}

			if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
				toast.error(`Cannot upload more than ${maxFiles} files`);
				return;
			}

			const newFiles = acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			);

			const updatedFiles = files ? [...files, ...newFiles] : newFiles;

			setFiles(updatedFiles);

			if (rejectedFiles.length > 0) {
				rejectedFiles.forEach(({ file }) => {
					toast.error(`File ${file.name} was rejected`);
				});
			}

			if (
				onUpload &&
				updatedFiles.length > 0 &&
				updatedFiles.length <= maxFiles
			) {
				const target =
					updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

				toast.promise(onUpload(updatedFiles), {
					loading: `Uploading ${target}...`,
					success: () => {
						setFiles([]);
						return `${target} uploaded`;
					},
					error: `Failed to upload ${target}`,
				});
			}
		},

		[files, maxFiles, multiple, onUpload, setFiles]
	);

	function onRemove(index: number) {
		if (!files) return;
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
		onValueChange?.(newFiles);
	}

	// Revoke preview url when component unmounts
	React.useEffect(() => {
		return () => {
			if (!files) return;
			files.forEach((file) => {
				if (isFileWithPreview(file)) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

	return (
		<div className="relative flex flex-col gap-6 overflow-hidden">
			<Dropzone
				onDrop={onDrop}
				accept={accept}
				maxSize={maxSize}
				maxFiles={maxFiles}
				multiple={maxFiles > 1 || multiple}
				disabled={isDisabled}
			>
				{({ getRootProps, getInputProps, isDragActive }) => (
					<div
						{...getRootProps()}
						className={cn(
							"group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
							"ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
							isDragActive && "border-muted-foreground/50",
							isDisabled && "pointer-events-none opacity-60",
							className
						)}
						{...dropzoneProps}
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<div className="flex flex-col items-center justify-center gap-4 sm:px-5">
								<div className="rounded-full border border-dashed p-3">
									<UploadIcon
										className="text-muted-foreground size-7"
										aria-hidden="true"
									/>
								</div>
								<p className="text-muted-foreground font-medium">
									Drop the files here
								</p>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center gap-4 sm:px-5">
								<div className="rounded-full border border-dashed p-3">
									<UploadIcon
										className="text-muted-foreground size-6"
										aria-hidden="true"
									/>
								</div>
								<div className="space-y-px">
									<p className="text-muted-foreground text-sm font-medium">
										{maxFiles > 1
											? `Click or drag up to ${maxFiles === Infinity ? "multiple" : maxFiles} files`
											: "Click or drag a file "}
										to upload
									</p>
									<p className="text-muted-foreground/70 text-sm">
										Maximum upload size is {formatBytes(maxSize)}
									</p>
								</div>
							</div>
						)}
					</div>
				)}
			</Dropzone>
			{files?.length ? (
				<ScrollArea className="h-fit w-full px-3">
					<div className="max-h-48 space-y-4">
						{files?.map((file, index) => (
							<FileCard
								key={index}
								file={file}
								onRemove={() => onRemove(index)}
								progress={progresses?.[file.name]}
							/>
						))}
					</div>
				</ScrollArea>
			) : null}
		</div>
	);
}

interface FileCardProps {
	file: File;
	onRemove: () => void;
	progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
	return (
		<div className="relative flex items-center space-x-4">
			<div className="flex flex-1 space-x-4">
				{isFileWithPreview(file) ? (
					<Image
						src={file.preview}
						alt={file.name}
						width={48}
						height={48}
						loading="lazy"
						className="aspect-square shrink-0 rounded-md object-cover"
					/>
				) : null}
				<div className="flex w-full flex-col gap-2">
					<div className="space-y-px">
						<p className="text-foreground/80 line-clamp-1 text-sm font-medium">
							{file.name}
						</p>
						<p className="text-muted-foreground text-xs">
							{formatBytes(file.size)}
						</p>
					</div>
					{progress ? <Progress value={progress} /> : null}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-7"
					onClick={onRemove}
				>
					<Cross2Icon className="size-4" aria-hidden="true" />
					<span className="sr-only">Remove file</span>
				</Button>
			</div>
		</div>
	);
}

function isFileWithPreview(file: File): file is File & { preview: string } {
	return "preview" in file && typeof file.preview === "string";
}
