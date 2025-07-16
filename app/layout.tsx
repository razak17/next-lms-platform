import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
	variable: "--font-figtree",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "E-Learning Platform",
	description: "An E-Learning Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${figtree.variable} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
