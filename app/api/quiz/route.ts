import { NextRequest, NextResponse } from 'next/server';

// Mock quiz data store (in production, use Supabase)
interface Quiz {
	id: string;
	userId: string;
	day: number;
	subject: string;
	questions: Question[];
	score: number | null;
	completed: boolean;
	startedAt: Date | null;
	completedAt: Date | null;
}

interface Question {
	id: string;
	text: string;
	options: string[];
	correctAnswer: number;
	userAnswer: number | null;
}

let quizzes: Quiz[] = [];

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { action, userId, day, questions, score, completed } = body;

		if (action === 'create') {
			// Create a new quiz
			const newQuiz: Quiz = {
				id: Date.now().toString(),
				userId,
				day,
				subject: `Day ${day} Quiz`,
				questions: questions || [],
				score: null,
				completed: false,
				startedAt: new Date(),
				completedAt: null,
			};
			quizzes.push(newQuiz);
			return NextResponse.json({ success: true, quiz: newQuiz }, { status: 201 });
		}

		if (action === 'submit') {
			// Submit quiz answers and calculate score
			const quizId = body.quizId;
			const quiz = quizzes.find(q => q.id === quizId && q.userId === userId);

			if (!quiz) {
				return NextResponse.json(
					{ error: 'Quiz not found' },
					{ status: 404 }
				);
			}

			// Calculate score
			let correctAnswers = 0;
			quiz.questions.forEach((q, idx) => {
				if (body.answers && body.answers[idx] === q.correctAnswer) {
					correctAnswers++;
				}
			});

			const calculatedScore = Math.round(
				(correctAnswers / quiz.questions.length) * 100
			);

			quiz.score = calculatedScore;
			quiz.completed = true;
			quiz.completedAt = new Date();

			return NextResponse.json(
				{ success: true, score: calculatedScore, quiz },
				{ status: 200 }
			);
		}

		if (action === 'get') {
			// Get quiz by ID
			const quizId = body.quizId;
			const quiz = quizzes.find(q => q.id === quizId && q.userId === userId);

			if (!quiz) {
				return NextResponse.json(
					{ error: 'Quiz not found' },
					{ status: 404 }
				);
			}

			return NextResponse.json({ success: true, quiz });
		}

		if (action === 'list') {
			// Get all quizzes for user
			const userQuizzes = quizzes.filter(q => q.userId === userId);
			return NextResponse.json({ success: true, quizzes: userQuizzes });
		}

		return NextResponse.json(
			{ error: 'Invalid action' },
			{ status: 400 }
		);
	} catch (error) {
		console.error('Quiz API error:', error);
		return NextResponse.json(
			{ error: 'Failed to process quiz request' },
			{ status: 500 }
		);
	}
}
