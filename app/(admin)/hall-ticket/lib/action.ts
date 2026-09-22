"use server";
import { db } from "@/db";
import { candidateTable, examDetailsTable } from "@/db/schema/candidate";
import { eq } from "drizzle-orm";

/**
 * Fetches a single candidate with their linked exam details,
 * assembled into the shape the HallTicket component expects.
 * Called on button click to navigate/render the hall ticket.
 */
export async function getCandidateHallTicketAction(candidateId: string) {
  try {
    const [candidate] = await db
      .select()
      .from(candidateTable)
      .where(eq(candidateTable.id, candidateId));

    if (!candidate) {
      return { success: false as const, message: "Candidate not found" };
    }

    if (!candidate.exam_id) {
      return { success: false as const, message: "No exam linked to this candidate" };
    }

    const [exam] = await db
      .select()
      .from(examDetailsTable)
      .where(eq(examDetailsTable.id, candidate.exam_id));

    if (!exam) {
      return { success: false as const, message: "Exam details not found" };
    }

    const data = {
      collegeName: "SANT SANDHYA DAS MAHILA COLLEGE",
      centerAddress: "Barh, Patna",
      negativeMarking: false,
      instructions: [
        "Don't carry any electronic gadgets",
        "Candidates must reach the examination centre 30 minutes before the exam",
        "Bring a valid photo ID along with this hall ticket",
        "Use of unfair means will result in cancellation of candidature",
        "Candidates must carry their own pen, pencil, and eraser",
      ],
      candidate: {
        name: candidate.name,
        roll: candidate.roll,
        fathers_name: candidate.fathers_name,
        category: candidate.category,
        dob: candidate.dob,
        gender: "Male", // TODO: add gender column to candidateTable schema
        profile: candidate.profile ?? undefined,
        signature: candidate.signature ?? undefined,
      },
      exam: {
        name: exam.name ?? "",
        post: exam.post ?? "",
        date: exam.date ?? "",
        time: exam.time ?? "",
        reporting: exam.reporting ?? "",
        center: exam.center ?? "",
      },
    };

    return { success: true as const, data };
  } catch (error) {
    console.error("getCandidateHallTicketAction error", error);
    return { success: false as const, message: "Failed to fetch hall ticket data" };
  }
}
