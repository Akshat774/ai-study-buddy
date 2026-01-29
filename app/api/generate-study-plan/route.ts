import { generateStudyPlan } from '@/lib/groq-client';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const subject = body.subject || 'Your Subject';
		const exam = body.exam || 'General Exam';
		const numDays = body.numDays || '30';
		const difficulty = body.difficulty || 'medium';
		const topicsLength = body.topicsLength || '5';

		if (!subject || !exam) {
			return Response.json(
				{ error: 'Subject and exam are required' },
				{ status: 400 },
			);
		}

		const plan = await generateStudyPlan(
			subject,
			exam,
			numDays,
			difficulty,
			topicsLength,
		);

		const studyPlanSubsections = parseStudyPlan(plan);

		return Response.json({ success: true, studyPlanSubsections });
	} catch (error) {
		console.error('[generate-study-plan] Error:', error);
		const msg = error instanceof Error ? error.message : String(error);
		return Response.json({ error: msg }, { status: 500 });
	}
}

interface StudyPlan {
	generalInfo: string;
	dailyRoutines: Array<{ dayNumber: number; title: string; content: string }>;
}

function parseStudyPlan(markdownInput: string): StudyPlan {
	// 1. Split the content to isolate the Daily Routine section
	const sections = markdownInput.split(/## 3\. DAILY ROUTINE/);

	if (sections.length < 2) {
		throw new Error('Invalid format: Daily Routine section not found.');
	}

	const beforeDaily = sections[0];
	// Split the rest into the routine and the final resources section
	const afterDailySplit = sections[1].split(/## 4\. RESOURCES AND MOCK TESTS/);

	const dailyContent = afterDailySplit[0];
	const resourcesContent = afterDailySplit[1] || '';

	// 2. Extract individual days using the ### Day [Number] header
	const dayRegex = /### Day (\d+):\s*([^\n]*)\n([\s\S]*?)(?=### Day \d+:|$)/g;
	const dailyRoutines: Array<{ dayNumber: number; title: string; content: string }> = [];

	let match;
	while ((match = dayRegex.exec(dailyContent)) !== null) {
		dailyRoutines.push({
			dayNumber: parseInt(match[1]),
			title: `Day ${match[1]}: ${match[2].trim() || 'Study'}`,
			content: match[3].trim(),
		});
	}

	// If regex didn't capture, fall back to simple split
	if (dailyRoutines.length === 0) {
		const daySegments = dailyContent
			.split(/### Day \d+:/)
			.filter((s) => s.trim() !== '');

		dailyRoutines.push(
			...daySegments.map((segment, idx) => ({
				dayNumber: idx + 1,
				title: `Day ${idx + 1}: Study`,
				content: segment.trim(),
			}))
		);
	}

	// 3. Construct General Info object (Overview + Strategy + Resources)
	const generalInfo = (
		beforeDaily +
		'## 4. RESOURCES AND MOCK TESTS' +
		resourcesContent
	).trim();

	return {
		generalInfo,
		dailyRoutines,
	};
}
