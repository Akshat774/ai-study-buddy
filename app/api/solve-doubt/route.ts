import { solveDubt } from '@/lib/groq-client';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const question = body.question || '';
		const subject = body.subject || 'General';
		const answerType = body.answerType || 'Medium';

		console.log('[solve-doubt] Received request:', {
			question: question.substring(0, 100),
			subject,
			answerType,
		});

		if (!question || question.trim().length === 0) {
			return Response.json({ error: 'Question is required' }, { status: 400 });
		}

		// Generate answer using Groq
		console.log('[solve-doubt] Calling Groq API...');
		const answer = await solveDubt(question, subject, answerType);

		console.log('[solve-doubt] Generated answer successfully');
		return Response.json({ success: true, answer });
	} catch (error) {
		console.error('[solve-doubt] Error:', error);
		const msg = error instanceof Error ? error.message : String(error);
		return Response.json({ error: msg }, { status: 500 });
	}
}
