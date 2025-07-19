import { env } from "./schema";

export const connectionString =
	env.ENV === "testing"
		? "postgres://postgres:postgres@db.localtest.me:5432/main"
		: env.DB_URL!;

export const localConnection = {
	password: env.DB_PASSWORD!,
	user: env.DB_USER!,
	database: env.DB_NAME!,
	host: env.DB_HOST!,
	ssl: false,
};
