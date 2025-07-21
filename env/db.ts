import { env } from "./schema";

export const localConnection = {
	password: env.DB_PASSWORD!,
	user: env.DB_USER!,
	database: env.DB_NAME!,
	host: env.DB_HOST!,
	ssl: false,
};
