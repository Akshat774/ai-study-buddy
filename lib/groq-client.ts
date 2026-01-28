import { generateText, streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

/**
 * Initialize Groq client with API key
 * Uses @ai-sdk/groq under the hood
 */

export interface GroqOptions {
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
}

const GROQ_MODEL = 'llama-3.1-8b-instant';

/**
 * Generate text using Groq API
 * Use this for non-streaming responses (summaries, short answers, etc.)
 */
export async function generateWithGroq(
	prompt: string,
	options: GroqOptions = {},
): Promise<string> {
	try {
		const {
			temperature = 0.7,
			maxTokens = 2000,
			topP = 1,
			frequencyPenalty = 0,
			presencePenalty = 0,
		} = options;

		const result = await generateText({
			model: groq(GROQ_MODEL),
			prompt,
			temperature,
			topP,
			frequencyPenalty: frequencyPenalty === 0 ? undefined : frequencyPenalty,
			presencePenalty: presencePenalty === 0 ? undefined : presencePenalty,
		});

		return result.text;
	} catch (error) {
		console.error('[Groq] Error generating text:', error);
		throw new Error(
			`Failed to generate response: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Stream text from Groq API
 * Use this for long responses where you want streaming updates
 */
export async function streamWithGroq(
	prompt: string,
	onChunk: (chunk: string) => void,
	options: GroqOptions = {},
): Promise<void> {
	try {
		const {
			temperature = 0.7,
			maxTokens = 2000,
			topP = 1,
			frequencyPenalty = 0,
			presencePenalty = 0,
		} = options;

		const stream = await streamText({
			model: groq(GROQ_MODEL),
			prompt,
			temperature,
			topP,
			frequencyPenalty: frequencyPenalty === 0 ? undefined : frequencyPenalty,
			presencePenalty: presencePenalty === 0 ? undefined : presencePenalty,
		});

		for await (const chunk of stream.textStream) {
			onChunk(chunk);
		}
	} catch (error) {
		console.error('[Groq] Error streaming text:', error);
		throw new Error(
			`Failed to stream response: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Generate a comprehensive study plan using Groq
 */
export async function generateStudyPlan(
	subject: string,
	exam: string,
	days: string,
	difficulty: string,
	topics: string,
): Promise<string> {
	const dayCount = parseInt(days) || 30;

	const prompt = `Act as a professional Academic Success Coach. Your task is to generate a comprehensive, high-density study plan and timetable.

STUDENT PROFILE:
- Subject: ${subject}
- Exam: ${exam}
- Topics to cover: ${topics}
- Duration: ${dayCount} days
- Daily Commitment: ${difficulty} hours per day

STRUCTURAL CONSTRAINTS (CRITICAL FOR UI PARSING):
- Use "## 1. OVERVIEW" for the introductory summary.
- Use "## 2. TOPIC-WISE STUDY APPROACH" for the strategy section.
- Use "## 3. DAILY ROUTINE" as the primary anchor for the schedule.
- Use "## 4. RESOURCES AND MOCK TESTS" for the final logistics.

---
SECTION REQUIREMENTS:

## 1. OVERVIEW
Provide a detailed summary of the plan's methodology and the expected learning outcomes.

## 2. TOPIC-WISE STUDY APPROACH
For each of the ${topics} topics, provide:
- **Importance**: Exam weightage.
- **Core Strategy**: How to tackle the theory vs. the numericals.
- **Learning Objectives**: Specific goals for this topic.

## 3. DAILY ROUTINE
Each day strictly must have their own routine and must not be excluded, repetition of the same routine is not allowed
For EACH day of the ${dayCount} days, you must provide (using "### Day [Number]" headers):
### Day [Number]: [Specific Topic]
- **Time Management & Break Schedule**: A slot-by-slot breakdown of the ${difficulty} hours, incorporating the Pomodoro technique (e.g., 50 mins study / 10 mins break).
- **Tasks**: Explicit instructions and practice problem counts.
- **Success Metric**: What the student must master before sleep.

## 4. RESOURCES AND MOCK TESTS
- **Study Resources Required**: List specific textbooks, YouTube channels, and online databases relevant to ${subject}.
- **Mock Test Schedule**: A specific calendar of when to take full-length vs. sectional tests.
- **Final Revision Strategy**: Instructions for the final 48 hours.

INSTRUCTIONS:
- Be verbose. Do not summarize.
- Ensure every day is accounted for individually.
- Maintain strict Markdown headers (## and ###) for parsing compatibility.
- Do not skip a number of days in the day by day routine and have a detailed plan for the day, if the topics are too less for the amount of days mentioned tell the user so, and do not write anything for the days after that, but do not summarize a group of days to a few words
- In case the number of topics is too small for the amount of days specified, refer to the syllabus of the exam they have mentioned and add topics related to the ones asked from the syllabus. The topics that the user has explicitly mentioned is to be used first and then the topics you might have chosen is to be used.

Generate the structured plan now:`;

	return generateWithGroq(prompt, {
		temperature: 0.8,
		maxTokens: 8000,
	});
}

/**
 * Solve a student's doubt with detailed explanation
 */
export async function solveDubt(
	question: string,
	subject: string,
	answerType: string,
): Promise<string> {
	let word_limit = '';
	let additionalNotes = '';

	switch (answerType) {
		case 'Short':
			word_limit = '100-200';
			break;
		case 'Medium':
			word_limit = '200-500';
			additionalNotes =
				'You do not need to focus on all topics equally and may choose which topics needs to be focused on.';
			break;
		case 'Long':
			word_limit = '500-1000';
			additionalNotes =
				'You do not need to focus on all topics equally and may choose which topics needs to be focused on. The topic should not feel under explained and should be communicated clearly.';
			break;
		case 'Detailed':
			word_limit = '1000+';
			additionalNotes =
				'You do not need to focus on all topics equally and may choose which topics needs to be focused on. The topic should not feel under explained and should be communicated clearly. Every topic must be completely understandable alone even if it need more explanation or you may reference your previous topics by clearly referencing them. The same point should not be repeated without valid reason. If your knowledge is limited  or is not updated you are to state so clearly. Feel free to change the topic names to better suit your explanation.';
			break;
		default:
			word_limit = '200-500';
	}

	const prompt = `Answer the question in a well-thought out method manner encompassing all the nuances that are important.

                    The answer is to be within ${word_limit} words with flexibility of 100 words. 

                    In the answer provide 8 sections:

                    1. Clear concept Explanation defining important terms as needed, comprising a baseline for the further points
                    2. Explain the importance of the concept in various feilds and mention their applications
                    3. A step-step explanation for the answer if needed else explain the concept in more detail including nusances
                    4. 2-3 practical examples
                    5. Common pitfalls and missconceptions that may be encountered
                    6. Short Concise Answer
                    7. Practice questions to test understanding
                    8. Related topics to study

                    Format the response using markdown with clear sections and bullet points for easy reading.
                    
                    ${additionalNotes}

                    The question is to be answered with respect to ${subject}.
                    The question is : "${question}"`;

	return generateWithGroq(prompt, { temperature: 0.8, maxTokens: 2500 });
}

/**
 * Summarize study notes intelligently
 */
export async function summarizeNotes(
	notes: string,
	subject: string,
	examType: string,
): Promise<string> {
	const prompt = `Intelligently summarize the following study notes for a student preparing for ${examType} exam in ${subject}.

Notes:
${notes}

Please provide:
1. Key concepts and definitions
2. Most important points highlighted
3. Relationships between concepts
4. Real-world applications
5. Exam-relevant practice tips
6. Common mistakes to avoid
7. Quick revision checklist

Format as structured markdown with sections and bullet points for quick reference.`;

	return generateWithGroq(prompt, {
		temperature: 0.7,
		maxTokens: 2000,
	});
}

/**
 * Extract key concepts from notes
 */
export async function extractKeyConceptsFromNotes(
	notes: string,
): Promise<string> {
	const prompt = `Extract and list all key concepts, definitions, and important terms from the following study notes. Format as a structured markdown list grouped by topic.

Notes:
${notes}

Provide:
1. Main concepts and definitions
2. Important formulas or theorems
3. Key relationships between concepts
4. Examples and applications`;

	return generateWithGroq(prompt, {
		temperature: 0.6,
		maxTokens: 1500,
	});
}
