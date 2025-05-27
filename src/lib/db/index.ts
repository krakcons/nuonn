import { relationSchemas, tableSchemas } from "./schema";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const schema = {
	...tableSchemas,
	...relationSchemas,
};

const sqlite = new Database("./persist/sqlite.db");
export const db = drizzle({
	client: sqlite,
	schema,
});
