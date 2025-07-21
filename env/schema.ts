import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		ENV: z.enum(["development", "testing", "production"]),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		DB_URL: z.string().min(1),
		DB_TYPE: z.string().min(1),
		// DB_HOST: z.string().min(1),
		// DB_USER: z.string().min(1),
		// DB_PASSWORD: z.string().min(1),
		// DB_NAME: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		EMAIL_SENDER_NAME: z.string().min(1),
		EMAIL_SENDER_ADDRESS: z.string().min(1),
	},
	experimental__runtimeEnv: process.env,
});
