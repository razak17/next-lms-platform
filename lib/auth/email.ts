import { env } from "@/env/schema";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const EMAIL_FROM = `${env.EMAIL_SENDER_NAME} <${env.EMAIL_SENDER_ADDRESS}>`;

export const sendEmail = ({
	from = EMAIL_FROM,
	to,
	subject,
	react,
}: {
	from?: string;
	to: string;
	subject: string;
	react: React.JSX.Element;
}) => {
	resend.emails.send({
		from,
		to,
		subject,
		react,
	});
};
