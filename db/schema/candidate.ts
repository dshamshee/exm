import { date, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";


export const cast_category = pgEnum('cast_category', ['General', 'EBC', 'BC', 'SC', 'ST'])
export const eligiblity_status = pgEnum('eligiblity_status', ['ELIGIBLE', 'NOT_ELIGIBLE'])
export const gender_status = pgEnum('gender_status', ['MALE', 'FEMALE', 'OTHER'])
export const candidateTable = pgTable('candidate', {
    id: text().primaryKey().$defaultFn(() => createId()),
    exam_id: text("exam_id").references(() => examDetailsTable.id),
    name: text().notNull(),
    roll: text().unique().notNull(),
    fathers_name: text(),
    address: text(),
    phone: text(),
    category: cast_category(),
    email: text(),
    dob: date(),
    gender: gender_status(),
    eligiblity: eligiblity_status(),
    signature: text(),
    profile: text(),
    download_count: integer().default(0),
    download_at: timestamp("download_at", { mode: "date", withTimezone: true }),
    created_at: timestamp("created_at", { mode: "date", withTimezone: true }).default(sql`NOW()`).notNull(),
    updated_at: timestamp("updated_at", { mode: "date", withTimezone: true }).default(sql`NOW()`).notNull(),
})


export const examDetailsTable = pgTable('exam_details', {
    id: text().primaryKey().$defaultFn(() => createId()),
    name: text(),
    post: text(),
    date: date(),
    time: text(),
    reporting: text(),
    center: text(),
})
