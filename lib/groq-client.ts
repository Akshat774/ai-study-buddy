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

	const prompt = `You are an expert exam preparation coach. Create an EXTREMELY DETAILED and COMPREHENSIVE ${dayCount}-day study plan for a student preparing for the ${exam} exam in ${subject}.

CRITICAL REQUIREMENTS:
- Difficulty Level: ${difficulty.toUpperCase()} (Easy = lighter load, Medium = standard, Hard = intensive)
- Number of Topics: ${topics}
- Total Days Available: ${dayCount} days
- Subject: ${subject}
- Exam: ${exam}

CREATE A DETAILED PLAN WITH THE FOLLOWING STRUCTURE:

## 1. EXECUTIVE SUMMARY
- Brief overview of the entire plan
- Key milestones
- Expected coverage

## 2. WEEK-BY-WEEK BREAKDOWN
For each week, include:
- Week number and dates
- Focus areas for that week
- Primary topics
- Learning objectives
- Study hours per day
- Key activities

## 3. DETAILED DAY-BY-DAY SCHEDULE
For EACH DAY (create for all ${dayCount} days):
- Date/Day number
- Topics to study (with specific chapters/sections if applicable)
- Time allocation (morning, afternoon, evening)
- Practice problems (quantity and difficulty)
- Key concepts to memorize
- Real-world applications
- Common mistakes to avoid
- Quick revision points

## 4. TOPIC-WISE STUDY APPROACH
For each of the ${topics} topics:
- Topic name
- Why it's important for ${exam}
- Learning objectives
- Best resources
- Core concepts
- Practice tips
- Expected time needed

## 5. STUDY RESOURCES REQUIRED
- Books and textbooks
- Online resources and videos
- Practice problem sets
- Mock tests
- Reference materials
- Supplementary materials

## 6. REVISION STRATEGY
- Spaced repetition schedule
- Key concepts to review
- Weekly revision targets
- Monthly cumulative review
- Last-minute revision (final 7 days)
- Revision checklists

## 7. MOCK TEST SCHEDULE
- When to take mock tests
- Which topics to focus in each mock
- Performance tracking
- Analysis of weak areas
- Improvement strategies

## 8. DAILY STUDY TIPS BY DIFFICULTY
- Morning routine recommendations
- Focus duration and breaks
- Evening review process
- Sleep and health tips
- Motivation strategies

## 9. TIME MANAGEMENT
- Optimal study hours per day: ${difficulty === 'hard' ? '6-8 hours' : difficulty === 'medium' ? '4-6 hours' : '3-4 hours'}
- Break schedule
- Study peak hours
- Buffer days for review
- Rest days if any

## 10. PROGRESS TRACKING
- Weekly milestones
- Self-assessment checkpoints
- Performance metrics
- Areas to focus if behind schedule

## 11. EXAM DAY PREPARATION
- Final revision points
- Exam strategy
- Time management during exam
- Important formulas/facts to remember
- Confidence boosters

## 12. RESOURCE ALLOCATION BY TOPIC
For each topic, specify:
- Days dedicated
- Study hours
- Practice problems count
- Mock test focus
- Difficulty progression

## ADDITIONAL IMPORTANT SECTIONS:
- Weak area identification and recovery plan
- How to handle exam anxiety
- Group study vs solo study recommendations
- Technology tools to use
- Nutrition and fitness tips during preparation
- Handling distractions
- Building conceptual clarity vs rote learning

INSTRUCTIONS FOR RESPONSE:
- Be EXTREMELY SPECIFIC with dates and times
- Include concrete numbers (e.g., "Solve 25 problems" not "Solve some problems")
- Provide actionable daily tasks
- Use clear formatting with headers and bullet points
- Make it practical and implementable
- Include scientific study techniques (Pomodoro, spaced repetition, etc.)
- Adapt recommendations based on difficulty level: ${difficulty}
- Focus on ${exam} exam requirements
- Tailor content to ${subject} subject matter

Create this plan now with maximum detail and practical applicability:`;

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
