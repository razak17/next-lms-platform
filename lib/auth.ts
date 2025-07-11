import ResetPasswordEmail from "@/components/emails/reset-password";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { Resend } from "resend";
import { ac, admin, learner } from "./permissions";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			resend.emails.send({
				// from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
				from: 'onboarding@resend.dev',
				to: user.email,
				subject: "Reset your password",
				react: ResetPasswordEmail({
					username: user.name,
					resetUrl: url,
					userEmail: user.email,
				}),
			});
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		adminPlugin({
			ac,
			roles: {
				admin,
				learner,
			},
			adminRoles: ["admin"],
			defaultRole: "learner",
		}),
		nextCookies(), // make sure this is the last plugin in the array
	],
});
