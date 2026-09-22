"use server";

import { db } from "@/db";
import { candidateTable, examDetailsTable } from "@/db/schema/candidate";
import { eq } from "drizzle-orm";

export async function getCandidateAction() {
  try {
    const candidates = await db
      .select({
        id: candidateTable.id,
        name: candidateTable.name,
        roll: candidateTable.roll,
        phone: candidateTable.phone,
        email: candidateTable.email,
        category: candidateTable.category,
        fathersName: candidateTable.fathers_name,
        address: candidateTable.address,
        dob: candidateTable.dob,
        gender: candidateTable.gender,
        eligiblity: candidateTable.eligiblity,
        profile: candidateTable.profile,
        signature: candidateTable.signature,
        examId: candidateTable.exam_id,
        downloadCount: candidateTable.download_count,
        downloadAt: candidateTable.download_at,
        examName: examDetailsTable.name,
        examPost: examDetailsTable.post,
        examDate: examDetailsTable.date,
        examTime: examDetailsTable.time,
        examReporting: examDetailsTable.reporting,
        examCenter: examDetailsTable.center,
      })
      .from(candidateTable)
      .leftJoin(examDetailsTable, eq(candidateTable.exam_id, examDetailsTable.id));

    return { success: true as const, data: candidates };
  } catch (error) {
    console.error("getCandidateAction error", error);
    return { success: false as const, message: "Failed to fetch candidates" };
  }
}

export async function getExamsAction() {
  try {
    const exams = await db
      .select({
        id: examDetailsTable.id,
        name: examDetailsTable.name,
      })
      .from(examDetailsTable);

    return { success: true as const, data: exams };
  } catch (error) {
    console.error("getExamsAction error", error);
    return { success: false as const, message: "Failed to fetch exams" };
  }
}

