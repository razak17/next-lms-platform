import { OTPVerificationForm } from "../../_components/otp-verification-form";
import { redirect } from "next/navigation"; // Import redirect

interface OTPVerificationPageProps {
	searchParams: Promise<{ email?: string }>;
}

export default async function OTPVerificationPage({
	searchParams,
}: OTPVerificationPageProps) {
	const { email } = await searchParams;

	if (!email) {
		redirect("/admin/register");
	}

	return <OTPVerificationForm email={email} />;
}
