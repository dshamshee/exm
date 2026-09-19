import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { candidateTable } from "@/db/schema/candidate";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PROFILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_SIGNATURE_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Validate an uploaded file's type and size.
 */
function validateFile(
  file: File,
  fieldName: string,
  maxSize: number
): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Invalid file type for ${fieldName}. Allowed: JPEG, PNG, WebP.`;
  }
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return `${fieldName} file exceeds maximum size of ${maxMB}MB.`;
  }
  return null;
}

/**
 * PATCH /api/candidate/upload
 *
 * Upload candidate profile picture and/or signature.
 * Accepts multipart/form-data with fields:
 *   - candidateId (required)
 *   - profile (optional image file)
 *   - signature (optional image file)
 */
export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();

    // --- Validate candidateId ---
    const candidateId = formData.get("candidateId");
    if (!candidateId || typeof candidateId !== "string") {
      return NextResponse.json(
        { success: false, error: "candidateId is required" },
        { status: 400 }
      );
    }

    // Check candidate exists
    const [existing] = await db
      .select({ id: candidateTable.id })
      .from(candidateTable)
      .where(eq(candidateTable.id, candidateId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    // --- Extract files ---
    const profileFile = formData.get("profile") as File | null;
    const signatureFile = formData.get("signature") as File | null;

    if (!profileFile && !signatureFile) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one file (profile or signature) is required",
        },
        { status: 400 }
      );
    }

    // --- Validate files ---
    if (profileFile) {
      const err = validateFile(profileFile, "profile", MAX_PROFILE_SIZE);
      if (err) {
        return NextResponse.json(
          { success: false, error: err },
          { status: 400 }
        );
      }
    }

    if (signatureFile) {
      const err = validateFile(signatureFile, "signature", MAX_SIGNATURE_SIZE);
      if (err) {
        return NextResponse.json(
          { success: false, error: err },
          { status: 400 }
        );
      }
    }

    // --- Upload to Cloudinary (in parallel if both provided) ---
    const updateFields: Record<string, string> = {};

    const uploads: Promise<void>[] = [];

    if (profileFile) {
      uploads.push(
        (async () => {
          const buffer = Buffer.from(await profileFile.arrayBuffer());
          const result = await uploadToCloudinary(buffer, {
            preset: "profile",
            candidateId,
          });
          updateFields.profile = result.secure_url;
        })()
      );
    }

    if (signatureFile) {
      uploads.push(
        (async () => {
          const buffer = Buffer.from(await signatureFile.arrayBuffer());
          const result = await uploadToCloudinary(buffer, {
            preset: "signature",
            candidateId,
          });
          updateFields.signature = result.secure_url;
        })()
      );
    }

    await Promise.all(uploads);

    // --- Update candidate record ---
    const [updated] = await db
      .update(candidateTable)
      .set(updateFields)
      .where(eq(candidateTable.id, candidateId))
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          profile: updated.profile,
          signature: updated.signature,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error uploading candidate image:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
