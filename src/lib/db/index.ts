import { relationSchemas, tableSchemas } from "./schema";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const schema = {
	...tableSchemas,
	...relationSchemas,
};

console.log(Bun.version);

const sqlite = new Database("sqlite.db");
export const db = drizzle({
	client: sqlite,
	schema,
});
