import OTPVerificationEmail from "@/components/emails/otp-verification";
import ResetPasswordEmail from "@/components/emails/reset-password";
import { env } from "@/config/schema";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, emailOTP } from "better-auth/plugins";
import { resend } from "../resend";
import { ac, admin, learner } from "./permissions";

const EMAIL_FROM = `${env.EMAIL_SENDER_NAME} <${env.EMAIL_SENDER_ADDRESS}>`;

export const auth = betterAuth({
	user: {
		additionalFields: {
			gender: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			phone: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			bio: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			location: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailVerification: {
		autoSignInAfterVerification: true,
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			resend.emails.send({
				from: EMAIL_FROM,
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
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string,
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
		emailOTP({
			sendVerificationOnSignUp: true,
			allowedAttempts: 5, // Allow 5 attempts before invalidating the OTP
			expiresIn: 600, //
			async sendVerificationOTP({ email, otp }) {
				resend.emails.send({
					from: EMAIL_FROM,
					to: email,
					subject: "Verify your account",
					react: OTPVerificationEmail({ userEmail: email, otpCode: otp }),
				});
			},
		}),
		nextCookies(), // make sure this is the last plugin in the array
	],
});
