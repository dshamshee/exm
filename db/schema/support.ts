import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const supportTicketTable = pgTable("support_ticket", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  fathers_name: text("fathers_name").notNull(),
  dob: date("dob").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  issue_category: text("issue_category").notNull(),
  message: text("message").notNull(),
  status: text("status").default("PENDING").notNull(),
  created_at: timestamp("created_at", { mode: "date", withTimezone: true }).default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at", { mode: "date", withTimezone: true }).default(sql`NOW()`).notNull(),
});
