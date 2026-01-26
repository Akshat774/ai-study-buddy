import { summarizeNotes } from "@/lib/groq-client";

export async function POST(request: Request) {
  console.log("[summarize-notes] API endpoint called");

  try {
    const body = await request.json();
    const notes = body.notes || "";
    const subject = body.subject || "General";
    const examType = body.examType || "Board Exam";

    console.log("[summarize-notes] Received notes of length:", notes.length);

    if (!notes || notes.trim().length === 0) {
      return Response.json(
        { error: "Notes content is required" },
        { status: 400 },
      );
    }

    // Generate summary using Groq
    console.log("[summarize-notes] Calling Groq API...");
    const summary = await summarizeNotes(notes, subject, examType);

    console.log("[summarize-notes] Generated summary successfully");
    return Response.json({ success: true, summary });
  } catch (error) {
    console.error("[summarize-notes] Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
