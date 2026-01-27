import { solveDubt } from '@/lib/groq-client';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
	try {
		const supabase = await createClient();

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

		const answer = await solveDubt(question, subject, answerType);

		const {
			data: { session },
		} = await supabase.auth.getSession();
		console.log(session);

		const { error: insertError } = await supabase
			.from('Doubts')
			.insert({ question: question, answer: answer });
		console.log(insertError);

		if (insertError)
			return Response.json({ error: insertError.message }, { status: 400 });

		return Response.json({ success: true, answer });
	} catch (error) {
		console.error('[solve-doubt] Error:', error);
		const msg = error instanceof Error ? error.message : String(error);
		return Response.json({ error: msg }, { status: 500 });
	}
}
