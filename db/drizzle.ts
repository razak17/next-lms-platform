import { localConnection } from "@/config/db";
import { env } from "@/config/schema";
import * as schema from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";

let connectionString = env.DB_URL!;

export const sql = neon(connectionString);

export const db =
	env.ENV === "development"
		? drizzlePostgres({ schema, connection: localConnection, logger: true })
		: drizzleNeon(sql, { schema, logger: true });
