import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import type { StoredFile } from "@/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function AvatarImagePreview({
	file,
	progress,
	isUploading = false,
	onRemove,
}: {
	file: File | null;
	progress?: number;
	isUploading?: boolean;
	onRemove: () => void;
}) {
	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative">
				<Avatar className="h-24 w-24 rounded-full">
					{file ? (
						<AvatarImage src={URL.createObjectURL(file)} alt={file.name} />
					) : (
						<AvatarFallback className="text-sidebar-accent-foreground rounded-full text-6xl">
							U
						</AvatarFallback>
					)}
				</Avatar>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
					onClick={onRemove}
					disabled={isUploading}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Remove file</span>
				</Button>
			</div>
			{file && (
				<div className="text-center">
					<p className="text-sm font-medium">{file.name}</p>
					<p className="text-muted-foreground text-xs">
						{formatBytes(file.size)}
					</p>
				</div>
			)}
			{progress ? <Progress value={progress} /> : null}
		</div>
	);
}

export function AvatarUploadedFiles({
	uploadedFiles,
}: {
	uploadedFiles: StoredFile[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Uploaded files</CardTitle>
				<CardDescription>View the uploaded files here</CardDescription>
			</CardHeader>
			<CardContent>
				{uploadedFiles.map((file, i) => (
					<div
						key={i}
						className="jusify-center flex w-full flex-col items-center"
					>
						<Avatar className="h-24 w-24 rounded-full">
							<AvatarImage src={file.url} alt={file.name} />
						</Avatar>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
