export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subject = body.subject || "Your Subject";
    const exam = body.exam || "General Exam";
    const numDays = Math.max(1, parseInt(body.days) || 7);
    const topicsInput = body.topics || "";
    const difficulty = body.difficulty || "medium";

    // Parse topics
    const topicsList = topicsInput
      ? topicsInput.split(",").map((t: string) => t.trim())
      : [];

    // Generate study plan
    const mockPlan = {
      overview: `${numDays}-day comprehensive study plan for ${subject} (${exam})`,
      daily_schedule: Array.from({ length: numDays }).map((_, dayIndex) => {
        const dayTopics = topicsList.slice(dayIndex * 2, (dayIndex + 1) * 2);
        return {
          day: dayIndex + 1,
          topics:
            dayTopics.length > 0
              ? dayTopics
              : [`Topic ${dayIndex * 2 + 1}`, `Topic ${dayIndex * 2 + 2}`],
          duration:
            difficulty === "hard"
              ? "4-5 hours"
              : difficulty === "medium"
                ? "3-4 hours"
                : "2-3 hours",
          revision: "20-30 minutes revision and practice",
          tips: `Focus on core concepts. Solve ${difficulty === "hard" ? "15-20" : "10-15"} practice problems.`,
        };
      }),
      key_resources: [
        "Standard Textbook",
        "Topic-wise Notes",
        "Practice Tests",
        "Previous Year Papers",
      ],
      study_tips: [
        "Active recall - test yourself daily",
        "Spaced repetition - review topics after 1 day, 3 days, 1 week",
        "Practice under timed conditions",
        "Group similar topics together",
        "Take breaks every 60 minutes",
      ],
      revision_strategy: "Weekly cumulative revision with mock tests",
    };

    return Response.json({ success: true, data: mockPlan });
  } catch (error) {
    console.error("Error in study plan API:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
