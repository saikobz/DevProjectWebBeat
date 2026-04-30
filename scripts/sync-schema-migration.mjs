/**
 * Copies database/schema.sql into the Supabase initial migration file
 * so Option A (Dashboard) and Option B (CLI) stay aligned.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = resolve(root, "database", "schema.sql");
const dest = resolve(root, "supabase", "migrations", "20260430120000_initial_schema.sql");

if (!existsSync(src)) {
  console.error("Missing:", src);
  process.exit(1);
}

const header = `-- Generated from database/schema.sql — do not edit by hand.
-- Re-run: npm run db:sync-schema-migration

`;

const body = readFileSync(src, "utf8");
writeFileSync(dest, header + body.trimStart(), "utf8");
console.log("Wrote", dest);
