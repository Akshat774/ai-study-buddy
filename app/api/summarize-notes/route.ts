export async function POST(request: Request) {
  console.log("[summarize-notes] API endpoint called");

  try {
    const body = await request.json();
    const notes = body.notes || "";
    const subject = body.subject || "";
    const examType = body.examType || "";

    console.log("[summarize-notes] Received notes of length:", notes.length);

    if (!notes || notes.trim().length === 0) {
      return Response.json(
        { error: "Notes content is required" },
        { status: 400 },
      );
    }

    // For now, generate a summary from the notes using a simple algorithm
    // In production, this would call the Groq API
    const lines = notes.split("\n").filter((l) => l.trim().length > 0);
    const keyPoints = lines
      .slice(0, Math.min(5, lines.length))
      .map((l) => "- " + l.trim());

    const summary = `# Summary of Your Notes

## Key Concepts
${keyPoints.join("\n")}

## Important Points
Based on ${subject || "your subject"} for ${examType || "exams"}:
- Study these concepts thoroughly
- Practice related questions
- Review before exams

## Practice Questions
1. Define the main concepts from your notes
2. Explain the key relationships
3. Apply concepts to real-world scenarios

## Memory Tips
- Create flashcards for key terms
- Use mnemonic devices for complex processes
- Group related concepts together

## Common Mistakes to Avoid
- Don't memorize without understanding
- Don't skip the fundamentals
- Don't neglect practice problems`;

    console.log(
      "[summarize-notes] Generated summary of length:",
      summary.length,
    );
    return Response.json({ success: true, summary });
  } catch (error) {
    console.error("[summarize-notes] Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
