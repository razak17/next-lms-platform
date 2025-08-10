import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper: Only require certain fields depending on ENV
const common = {
	ENV: z.enum(["development", "testing", "production"]),
	BETTER_AUTH_SECRET: z.string().min(1),
	BETTER_AUTH_URL: z.string().min(1),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	RESEND_API_KEY: z.string().min(1),
	EMAIL_SENDER_NAME: z.string().min(1),
	EMAIL_SENDER_ADDRESS: z.string().min(1),
	UPSTASH_REDIS_REST_URL: z.string().min(1),
	UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
	LANDING_PAGE_ADMIN_ID: z.string().min(1),
};

export const env = createEnv({
	server: {
		...common,

		// Accept both, but only require one based on ENV:
		DB_URL: z.string().optional(),
		DB_TYPE: z.string().min(1),

		DB_HOST: z.string().optional(),
		DB_USER: z.string().optional(),
		DB_PASSWORD: z.string().optional(),
		DB_NAME: z.string().optional(),
	},
	// Optionally filter out process.env to avoid leaking
	experimental__runtimeEnv: process.env,
});

// Validation logic
if (env.ENV === "development") {
	if (!env.DB_HOST || !env.DB_USER || !env.DB_PASSWORD || !env.DB_NAME) {
		throw new Error(
			"Missing required DB connection pieces for local development."
		);
	}
} else {
	if (!env.DB_URL)
		throw new Error("DB_URL is required in production or testing.");
}
