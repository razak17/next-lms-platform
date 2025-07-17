interface HeadingProps {
	title: string;
	description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
	return (
		<div className="flex flex-col gap-1">
			<h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
			<p className="text-muted-foreground text-sm">{description}</p>
		</div>
	);
};
