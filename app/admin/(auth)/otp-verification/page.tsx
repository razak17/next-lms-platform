import { OTPVerificationForm } from "../_components/otp-verification-form";
import { redirect } from "next/navigation"; // Import redirect

export default async function OTPVerificationPage({
	searchParams,
}: {
	searchParams: Promise<{
		email?: string;
	}>;
}) {
	const { email } = await searchParams;

	if (!email) {
		redirect("/admin/register");
	}

	return <OTPVerificationForm email={email} />;
}
