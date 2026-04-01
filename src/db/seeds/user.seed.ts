import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";

const users = [
  {
    email: "rijalghodi.dev@gmail.com",
    password: "1234qwer",
    firstName: "Rijal",
    lastName: "Ghodi",
    role: "admin",
  },
];

export async function seedUsers(db: NodePgDatabase<typeof schema>) {
  console.log("🌱 Seeding user table...");
  await db
    .insert(schema.usersTable)
    .values(users)
    .onConflictDoNothing({ target: schema.usersTable.email });
  console.log(`✅ Inserted ${users.length} users.`);
}
