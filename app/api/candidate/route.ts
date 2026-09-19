import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidateTable } from "@/db/schema/candidate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isArray = Array.isArray(body);
    const items = isArray ? body : [body];

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Candidate list cannot be empty" },
        { status: 400 }
      );
    }

    const required = ["name", "roll"];

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      for (const field of required) {
        if (item[field] === undefined || item[field] === null || item[field] === "") {
          return NextResponse.json(
            { success: false, error: `Missing required field '${field}' at index ${i}` },
            { status: 400 }
          );
        }
      }

      // Validate date format (YYYY-MM-DD) only when dob is provided
      if (item.dob && !/^\d{4}-\d{2}-\d{2}$/.test(item.dob)) {
        return NextResponse.json(
          { success: false, error: `Invalid dob format at index ${i}. Use YYYY-MM-DD` },
          { status: 400 }
        );
      }
    }

    const recordsToInsert = items.map((item) => ({
      exam_id: item.exam_id || null,
      name: item.name,
      roll: item.roll,
      fathers_name: item.fathers_name || null,
      address: item.address || null,
      phone: item.phone || null,
      category: item.category || null,
      email: item.email || null,       // null for unique key when empty
      dob: item.dob || null,
      gender: item.gender || null,
      eligiblity: item.eligiblity || null,
      signature: item.signature || null,
      profile: item.profile || null,
    }));

    const inserted = await db
      .insert(candidateTable)
      .values(recordsToInsert)
      .returning();

    return NextResponse.json(
      {
        success: true,
        count: inserted.length,
        data: isArray ? inserted : inserted[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error inserting candidate(s):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const records = await db.select().from(candidateTable);
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
