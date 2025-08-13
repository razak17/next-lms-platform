import "dotenv/config";
import { Config, defineConfig } from "drizzle-kit";
import { localConnection } from "./config/db";
import { env } from "@/config/server";

export default defineConfig({
	schema: "./db/schema",
	out: "./db/migrations",
	dialect: env.DB_TYPE as Config["dialect"],
	strict: true,
	verbose: true,
	dbCredentials:
		env.ENV === "development" ? localConnection : { url: env.DB_URL! },
});
