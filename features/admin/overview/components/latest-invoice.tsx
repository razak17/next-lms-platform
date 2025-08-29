import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Track, Purchase, User } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

const invoiceData = [
	{
		name: "Olivia Martin",
		email: "olivia.martin@email.com",
		avatar: "https://api.slingacademy.com/public/sample-users/1.png",
		fallback: "OM",
		amount: "$1,999.00",
	},
	{
		name: "Jackson Lee",
		email: "jackson.lee@email.com",
		avatar: "https://api.slingacademy.com/public/sample-users/2.png",
		fallback: "JL",
		amount: "$39.00",
	},
	{
		name: "Isabella Nguyen",
		email: "isabella.nguyen@email.com",
		avatar: "https://api.slingacademy.com/public/sample-users/3.png",
		fallback: "IN",
		amount: "$299.00",
	},
	{
		name: "William Kim",
		email: "will@email.com",
		avatar: "https://api.slingacademy.com/public/sample-users/4.png",
		fallback: "WK",
		amount: "$99.00",
	},
	{
		name: "Sofia Davis",
		email: "sofia.davis@email.com",
		avatar: "https://api.slingacademy.com/public/sample-users/5.png",
		fallback: "SD",
		amount: "$39.00",
	},
];

export function LatestInvoice({
	purchases,
}: {
	purchases?: {
		track: Track | null;
		purchase: Purchase;
		user: User | null;
	}[];
}) {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="border-b pb-4 text-2xl">Latest Invoice</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{purchases?.map((purchase, index) => (
						<div key={index} className="flex items-center">
							<Avatar className="h-9 w-9">
								<AvatarImage
									src={purchase.user?.image ? purchase.user?.image : undefined}
									alt="Avatar"
								/>
								<AvatarFallback>
									{purchase.user?.name?.charAt(0).toUpperCase() ||
										purchase.user?.email?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="ml-4 space-y-1">
								<p className="text-sm leading-none font-medium">
									{purchase.user?.name}
								</p>
								<p className="text-muted-foreground text-sm">
									{purchase.user?.email}
								</p>
							</div>
							<div className="ml-auto font-medium">
								{purchase.track?.price
									? formatPrice(purchase.track.price)
									: "Free"}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
