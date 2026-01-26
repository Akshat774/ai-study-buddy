import { generateStudyPlan } from "@/lib/groq-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subject = body.subject || "Your Subject";
    const exam = body.exam || "General Exam";
    const numDays = body.numDays || "30";
    const difficulty = body.difficulty || "medium";
    const topicsLength = body.topicsLength || "5";

    console.log("[generate-study-plan] Received request:", {
      subject,
      exam,
      numDays,
      difficulty,
      topicsLength,
    });

    if (!subject || !exam) {
      return Response.json(
        { error: "Subject and exam are required" },
        { status: 400 },
      );
    }

    // Generate study plan using Groq
    console.log("[generate-study-plan] Calling Groq API...");
    const plan = await generateStudyPlan(
      subject,
      exam,
      numDays,
      difficulty,
      topicsLength,
    );

    console.log("[generate-study-plan] Generated study plan successfully");
    return Response.json({ success: true, plan });
  } catch (error) {
    console.error("[generate-study-plan] Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
