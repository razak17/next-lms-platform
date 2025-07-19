import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`;

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
