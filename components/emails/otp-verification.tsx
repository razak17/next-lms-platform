import * as React from "react";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
	Tailwind,
} from "@react-email/components";

interface OTPVerificationEmailProps {
	userEmail: string;
	otpCode: string;
}

const OTPVerificationEmail = (props: OTPVerificationEmailProps) => {
	const { userEmail, otpCode } = props;

	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Your verification code: {otpCode}</Preview>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
						{/* Header */}
						<Section className="mb-[32px] text-center">
							<Heading className="m-0 mb-[8px] text-[24px] font-bold text-gray-900">
								Verify Your Email Address
							</Heading>
							<Text className="m-0 text-[16px] text-gray-600">
								We've sent a verification code to {userEmail}
							</Text>
						</Section>

						{/* OTP Code */}
						<Section className="mb-[32px] text-center">
							<div className="inline-block rounded-[8px] border-[2px] border-dashed border-gray-300 bg-gray-50 p-[24px]">
								<Text className="m-0 text-[32px] font-bold tracking-[8px] text-gray-900">
									{otpCode}
								</Text>
							</div>
						</Section>

						{/* Instructions */}
						<Section className="mb-[32px]">
							<Text className="m-0 mb-[16px] text-[16px] text-gray-700">
								Enter this 6-digit code in the verification field to complete
								your email verification.
							</Text>
							<Text className="m-0 mb-[16px] text-[14px] text-gray-500">
								This code will expire in 10 minutes for security reasons.
							</Text>
							<Text className="m-0 text-[14px] text-gray-500">
								If you didn't request this verification, please ignore this
								email or contact our support team.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="border-t border-gray-200 pt-[24px]">
							<Text className="m-0 mb-[8px] text-center text-[12px] text-gray-400">
								© 2025 LMS Platform. All rights reserved.
							</Text>
							<Text className="m-0 text-center text-[12px] text-gray-400">
								123 Business Street, Accra, Ghana
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default OTPVerificationEmail;
