import { OTPVerificationForm } from "@/features/learner/auth/components/otp-verification-form";
import { redirects } from "@/lib/constants";
import { redirect } from "next/navigation";

interface OTPVerificationPageProps {
	searchParams: Promise<{ email?: string }>;
}

export default async function OTPVerificationPage({
	searchParams,
}: OTPVerificationPageProps) {
	const { email } = await searchParams;

	if (!email) {
		redirect(redirects.toSignup);
	}

	return <OTPVerificationForm email={email} />;
}
