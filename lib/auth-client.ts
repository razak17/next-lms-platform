import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, learner } from "./permissions";

export const authClient = createAuthClient({
	baseURL: process.env.BASE_URL as string,
	plugins: [
		adminClient({
			ac,
			roles: {
				admin,
				learner,
			},
			defaultRole: "learner",
		}),
	],
});
