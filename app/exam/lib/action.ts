"use server";

import { db } from "@/db";
import { examDetailsTable } from "@/db/schema/candidate";

export async function getExamAction() {
  try {
    const exams = await db
      .select({
        id: examDetailsTable.id,
        name: examDetailsTable.name,
        post: examDetailsTable.post,
        date: examDetailsTable.date,
        time: examDetailsTable.time,
        reporting: examDetailsTable.reporting,
        center: examDetailsTable.center,
      })
      .from(examDetailsTable);

    return { success: true as const, data: exams };
  } catch (error) {
    console.error("getExamAction error", error);
    return { success: false as const, message: "Failed to fetch exam details" };
  }
}
