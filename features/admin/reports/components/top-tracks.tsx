"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Star } from "lucide-react";

interface TopTrack {
	id: string;
	name: string;
	price: number;
	rating: number;
	enrollments: number;
	revenue: number;
	instructor: string;
}

interface TopTracksProps {
	data: TopTrack[];
}

export function TopTracks({ data }: TopTracksProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Performing Tracks</CardTitle>
				<CardDescription>
					Most popular tracks by enrollment count
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{data.length === 0 ? (
						<div className="text-muted-foreground flex h-32 items-center justify-center">
							No track data available
						</div>
					) : (
						data.map((track, index) => (
							<div
								key={track.id}
								className="flex items-center justify-between space-x-4 border-b pb-3 last:border-b-0"
							>
								<div className="flex-1 space-y-1">
									<div className="flex items-center space-x-2">
										<span className="text-muted-foreground text-lg font-bold">
											#{index + 1}
										</span>
										<p className="leading-none font-medium">{track.name}</p>
									</div>
									<p className="text-muted-foreground text-sm">
										by {track.instructor}
									</p>
									<div className="flex items-center space-x-2">
										<div className="flex items-center space-x-1">
											<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
											<span className="text-xs">{track.rating}/5</span>
										</div>
										<Badge variant="outline" className="text-xs">
											{track.enrollments} enrollments
										</Badge>
									</div>
								</div>
								<div className="space-y-1 text-right">
									<p className="font-semibold">{formatPrice(track.price)}</p>
									<p className="text-sm font-medium text-green-600">
										{formatPrice(track.revenue)} revenue
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}
