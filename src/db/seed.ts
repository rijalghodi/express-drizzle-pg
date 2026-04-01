import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/db/schema";

import { seedUsers } from "./seeds/user.seed";

// ─── Register all seeders here ───────────────────────────────────────────────
const seeders = [
  { name: "Users", fn: seedUsers },
  // Add new seeders below as the project grows, e.g.:
  // { name: "Todo",  fn: seedTodo },
];
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle({ client: pool, schema });

  console.log("🚀 Starting database seed...\n");

  for (const seeder of seeders) {
    console.log(`▶ Running seeder: ${seeder.name}`);
    await seeder.fn(db);
    console.log();
  }

  await pool.end();
  console.log("🎉 All seeders completed successfully.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
