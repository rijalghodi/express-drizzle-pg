import { randomUUID } from "crypto";
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  name: varchar("name", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }),
  image: text("image"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const todosTable = pgTable("todo", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  status: boolean("status").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  deletedAt: timestamp("deleted_at"),
});

export const verificationTokensTable = pgTable("verification_token", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 500 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(), // 'email_verification' | 'password_reset'
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
