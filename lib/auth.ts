import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, learner } from "./permissions";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
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
