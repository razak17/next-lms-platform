import "dotenv/config";
import { Config, defineConfig } from "drizzle-kit";
import { connectionString, localConnection } from "./env/db";
import { env } from "./env/schema";

export default defineConfig({
	schema: "./db/schema",
	out: "./db/migrations",
	dialect: env.DB_TYPE as Config["dialect"],
	strict: true,
	verbose: true,
	dbCredentials:
		env.ENV === "development" ? localConnection : { url: connectionString },
});
