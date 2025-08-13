import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, BookOpen, Users } from "lucide-react";

export default function EnrollmentSuccessPage({
  params,
}: {
  params: Promise<{ trackId: string }>
}) {
	return (
		<div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
			<Card className="w-full max-w-2xl shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-10 w-10 text-green-600" />
					</div>
					<CardTitle className="text-2xl font-bold text-green-600">
						Enrollment Successful!
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 text-center">
					<p className="text-muted-foreground text-lg">
						Congratulations! You have successfully enrolled in the track.
					</p>

					<div className="bg-muted/50 rounded-lg p-4">
						<h3 className="mb-2 font-semibold">What happens next?</h3>
						<div className="text-muted-foreground space-y-2 text-sm">
							<div className="flex items-center justify-center gap-2">
								<div className="bg-primary h-2 w-2 rounded-full" />
								<span>Check your email for enrollment confirmation</span>
							</div>
							<div className="flex items-center justify-center gap-2">
								<div className="bg-primary h-2 w-2 rounded-full" />
								<span>Access your courses in the dashboard</span>
							</div>
							<div className="flex items-center justify-center gap-2">
								<div className="bg-primary h-2 w-2 rounded-full" />
								<span>Start learning at your own pace</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button asChild size="lg">
							<Link href="/dashboard">
								<BookOpen className="mr-2 h-4 w-4" />
								Go to Dashboard
							</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link href="/tracks">
								<Users className="mr-2 h-4 w-4" />
								Browse More Tracks
							</Link>
						</Button>
					</div>

					<div className="border-t pt-4">
						<p className="text-muted-foreground text-sm">
							Need help? Contact our support team at{" "}
							<a
								href="mailto:support@azubi.africa"
								className="text-primary hover:underline"
							>
								support@azubi.africa
							</a>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
