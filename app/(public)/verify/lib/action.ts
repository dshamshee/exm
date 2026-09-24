"use server";

import { db } from "@/db";
import { candidateTable, examDetailsTable } from "@/db/schema/candidate";
import { supportTicketTable } from "@/db/schema/support";
import { eq, and, ilike, sql } from "drizzle-orm";
import { createSupportTicketSchema, type CreateSupportTicketInput } from "./schema";

export async function verifyCandidateAction(name: string, fathersName: string, dob: string, post: string) {
  try {
    if (!name?.trim() || !fathersName?.trim() || !dob?.trim() || !post?.trim()) {
      return { success: false as const, message: "Name, Father's Name, Date of Birth, and Post are required" };
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
      .leftJoin(examDetailsTable, eq(candidateTable.exam_id, examDetailsTable.id))
      .where(
        and(
          ilike(candidateTable.name, name.trim()),
          ilike(candidateTable.fathers_name, fathersName.trim()),
          eq(candidateTable.dob, dob),
          ilike(examDetailsTable.post, post.trim())
        )
      );

    if (candidates.length === 0) {
      return { success: false as const, message: "No candidate found with the provided details and selected Post" };
    }

    return { success: true as const, data: candidates[0] };
  } catch (error) {
    console.error("verifyCandidateAction error", error);
    return { success: false as const, message: "Failed to verify candidate. Please try again." };
  }
}

export async function getPostsAction() {
  try {
    const exams = await db
      .select({
        post: examDetailsTable.post,
      })
      .from(examDetailsTable);

    const postsSet = new Set<string>();
    exams.forEach((e) => {
      if (e.post?.trim()) {
        postsSet.add(e.post.trim());
      }
    });

    return { success: true as const, data: Array.from(postsSet) };
  } catch (error) {
    console.error("getPostsAction error", error);
    return { success: false as const, message: "Failed to fetch available posts" };
  }
}

export async function recordCandidateDownloadAction(candidateId: string) {
  try {
    if (!candidateId?.trim()) {
      return { success: false as const, message: "Candidate ID is required" };
    }

    const [updated] = await db
      .update(candidateTable)
      .set({
        download_count: sql`COALESCE(${candidateTable.download_count}, 0) + 1`,
        download_at: new Date(),
      })
      .where(eq(candidateTable.id, candidateId))
      .returning({
        id: candidateTable.id,
        downloadCount: candidateTable.download_count,
        downloadAt: candidateTable.download_at,
      });

    if (!updated) {
      return { success: false as const, message: "Candidate not found" };
    }

    return { success: true as const, data: updated };
  } catch (error) {
    console.error("recordCandidateDownloadAction error", error);
    return { success: false as const, message: "Failed to record hall ticket download" };
  }
}

export async function createSupportTicketAction(input: CreateSupportTicketInput) {
  try {
    const parsed = createSupportTicketSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input data";
      return { success: false as const, message: firstError };
    }

    const [ticket] = await db
      .insert(supportTicketTable)
      .values({
        name: parsed.data.name,
        fathers_name: parsed.data.fathersName,
        dob: parsed.data.dob,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        issue_category: parsed.data.issueCategory,
        message: parsed.data.message,
      })
      .returning();

    return { success: true as const, data: ticket };
  } catch (error) {
    console.error("createSupportTicketAction error", error);
    return { success: false as const, message: "Failed to submit support request. Please try again." };
  }
}
