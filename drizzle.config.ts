import { Config, defineConfig } from "drizzle-kit";
import "dotenv/config";

const connectionString =
	process.env.ENV === "testing"
		? "postgres://postgres:postgres@db.localtest.me:5432/main"
		: process.env.DB_URL!;

const localDbCredentials = {
	password: process.env.DB_PASSWORD!,
	user: process.env.DB_USER!,
	database: process.env.DB_NAME!,
	host: process.env.DB_HOST!,
	ssl: false,
};

export default defineConfig({
	schema: "./db/schema",
	out: "./db/migrations",
	dialect: process.env.DB_TYPE as Config["dialect"],
	strict: true,
	verbose: true,
	dbCredentials:
		process.env.ENV === "development"
			? localDbCredentials
			: { url: connectionString },
});
