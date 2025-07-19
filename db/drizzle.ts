import * as schema from "@/db/schema";
import { neon, neonConfig } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";

let connectionString = process.env.DB_URL!;

if (process.env.ENV === "testing") {
	connectionString = "postgres://postgres:postgres@localhost:5432/main";
	neonConfig.fetchEndpoint = (host) => {
		const [protocol, port] =
			host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
		return `${protocol}://${host}:${port}/sql`;
	};
	const connectionStringUrl = new URL(connectionString);
	neonConfig.useSecureWebSocket =
		connectionStringUrl.hostname !== "db.localtest.me";
	neonConfig.wsProxy = (host) =>
		host === "db.localtest.me" ? `${host}:4444/v2` : `${host}/v2`;
}

export const sql = neon(connectionString);

export const db =
	process.env.ENV === "development"
		? drizzle({
				schema,
				connection: {
					password: process.env.DB_PASSWORD,
					user: process.env.DB_USER,
					database: process.env.DB_NAME,
					host: process.env.DB_HOST,
				},
			})
		: drizzleNeon(sql, { schema });
