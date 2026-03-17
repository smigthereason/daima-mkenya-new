// app/api/contact-submissions/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, updates } = body;

    if (!submissionId || !updates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Add repliedAt timestamp if status is being set to replied
    if (updates.status === "replied" && !updates.repliedAt) {
      updates.repliedAt = new Date().toISOString();
    }

    // Ensure all notes have _key properties
    if (updates.notes && Array.isArray(updates.notes)) {
      updates.notes = updates.notes.map((note: any) => {
        if (!note._key) {
          return {
            ...note,
            _key: Math.random().toString(36).substring(2, 10),
          };
        }
        return note;
      });
    }

    const result = await client.patch(submissionId).set(updates).commit();

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error updating contact submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
