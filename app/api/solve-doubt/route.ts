export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question || "";
    const subject = body.subject || "General";
    const examType = body.examType || "Board Exam";

    if (!question) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    // Generate a well-structured answer
    const answer = `## Understanding Your Question

Your question about **${question}** in ${subject} is a great one!

## Concept Explanation

This is a fundamental concept in ${subject}. Let me break it down for you:

- **Definition**: This concept refers to the basic principles and mechanisms involved
- **Key Insight**: The main understanding you need is how the components interact
- **Context**: This typically appears in ${examType} with emphasis on application

## Key Points to Remember

1. **Fundamentals First**: Ensure you understand the basic building blocks
2. **Relationships**: Understand how different parts connect to each other
3. **Real-World Application**: See how this applies in practical scenarios
4. **Common Misconceptions**: Avoid thinking it works in a simple linear way

## Solved Examples

**Example 1 (Basic)**: A straightforward application showing the concept in action
**Example 2 (Intermediate)**: A more complex scenario requiring multiple steps
**Example 3 (Advanced)**: An application that combines multiple concepts

## Memory Aid - LARSF Framework

- **L**isten to the concept carefully
- **A**nalyze the components involved
- **R**elate it to what you already know
- **S**olve practice problems
- **F**ind patterns and connections

## Practice Questions

1. Define the key concepts mentioned in the explanation
2. How would you apply this in a different context?
3. What are the limiting conditions or exceptions?
4. How does this connect to related topics?

## Related Topics to Explore

- ${subject} principles and applications
- Related advanced concepts
- Exam-important variations and special cases

---
*Tip: Try to solve 5-10 practice problems on this topic to master it!*`;

    return Response.json({ success: true, answer });
  } catch (error) {
    console.error("Error solving doubt:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
