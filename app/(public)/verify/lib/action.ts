"use server";

import { db } from "@/db";
import { candidateTable, examDetailsTable } from "@/db/schema/candidate";
import { eq, and, ilike } from "drizzle-orm";

export async function verifyCandidateAction(name: string, fathersName: string, dob: string) {
  try {
    if (!name?.trim() || !fathersName?.trim() || !dob?.trim()) {
      return { success: false as const, message: "Name, Father's Name, and Date of Birth are required" };
    }

    const candidates = await db
      .select({
        id: candidateTable.id,
        name: candidateTable.name,
        roll: candidateTable.roll,
        fathersName: candidateTable.fathers_name,
        category: candidateTable.category,
        dob: candidateTable.dob,
        gender: candidateTable.gender,
        eligiblity: candidateTable.eligiblity,
        profile: candidateTable.profile,
        signature: candidateTable.signature,
        examName: examDetailsTable.name,
        examPost: examDetailsTable.post,
        examDate: examDetailsTable.date,
        examTime: examDetailsTable.time,
        examReporting: examDetailsTable.reporting,
        examCenter: examDetailsTable.center,
      })
      .from(candidateTable)
      .leftJoin(examDetailsTable, eq(candidateTable.exam_id, examDetailsTable.id))
      .where(
        and(
          ilike(candidateTable.name, name.trim()),
          ilike(candidateTable.fathers_name, fathersName.trim()),
          eq(candidateTable.dob, dob)
        )
      );

    if (candidates.length === 0) {
      return { success: false as const, message: "No candidate found with the provided Name and Date of Birth" };
    }

    return { success: true as const, data: candidates[0] };
  } catch (error) {
    console.error("verifyCandidateAction error", error);
    return { success: false as const, message: "Failed to verify candidate. Please try again." };
  }
}
