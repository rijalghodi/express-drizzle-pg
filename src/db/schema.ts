import { randomUUID } from "crypto";
import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  name: varchar("name", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }),
  image: text("image"),
});

export const todosTable = pgTable("todo", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  status: boolean("status").notNull().default(false),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
});
