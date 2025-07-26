export const localConnection = {
	password: process.env.DB_PASSWORD!,
	user: process.env.DB_USER!,
	database: process.env.DB_NAME!,
	host: process.env.DB_HOST!,
	ssl: false,
};
