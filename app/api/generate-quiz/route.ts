import { NextRequest, NextResponse } from 'next/server';

// Quiz questions database - organized by topic and subject
const quizDatabase: Record<string, any> = {
	'physics': {
		'oscillation': [
			{
				id: 1,
				text: 'What is the restoring force in simple harmonic motion?',
				options: [
					'A force proportional to velocity',
					'A force proportional to displacement and opposite to it',
					'A constant force',
					'A force proportional to acceleration'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			},
			{
				id: 2,
				text: 'The period of a simple pendulum depends on:',
				options: [
					'The mass of the bob and amplitude',
					'The length of the string and acceleration due to gravity',
					'The amplitude and acceleration due to gravity',
					'Only the mass of the bob'
				],
				correctAnswer: 1,
				difficulty: 'easy'
			},
			{
				id: 3,
				text: 'At the mean position in SHM, the total energy is:',
				options: [
					'Maximum potential energy',
					'Maximum kinetic energy',
					'Equal to potential energy',
					'Zero'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			},
			{
				id: 4,
				text: 'The frequency of oscillation is inversely proportional to:',
				options: [
					'The amplitude',
					'The square root of mass',
					'The velocity',
					'The displacement'
				],
				correctAnswer: 1,
				difficulty: 'hard'
			},
			{
				id: 5,
				text: 'In damped oscillation, the amplitude decreases because:',
				options: [
					'The frequency increases',
					'Energy is dissipated due to friction',
					'The restoring force increases',
					'The mass of the object increases'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			}
		],
		'doppler effect': [
			{
				id: 1,
				text: 'The Doppler effect causes a change in:',
				options: [
					'The speed of sound',
					'The wavelength and frequency of sound',
					'The amplitude of sound',
					'The intensity of sound'
				],
				correctAnswer: 1,
				difficulty: 'easy'
			},
			{
				id: 2,
				text: 'When a source of sound moves towards an observer, the observed frequency:',
				options: [
					'Decreases',
					'Increases',
					'Remains the same',
					'First increases then decreases'
				],
				correctAnswer: 1,
				difficulty: 'easy'
			},
			{
				id: 3,
				text: 'The Doppler formula for frequency is valid when:',
				options: [
					'The source velocity equals the speed of sound',
					'The source velocity is much less than the speed of sound',
					'The observer is at rest',
					'The wavelength is constant'
				],
				correctAnswer: 1,
				difficulty: 'hard'
			},
			{
				id: 4,
				text: 'A stationary observer hears sound from a moving source. The observed wavelength:',
				options: [
					'Is independent of source motion',
					'Is longer when source moves away',
					'Is shorter when source moves towards observer',
					'Both B and C'
				],
				correctAnswer: 3,
				difficulty: 'hard'
			},
			{
				id: 5,
				text: 'The frequency shift due to Doppler effect is:',
				options: [
					'Proportional to amplitude',
					'Proportional to relative velocity',
					'Independent of wavelength',
					'Dependent on the medium density'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			}
		]
	},
	'mathematics': {
		'calculus': [
			{
				id: 1,
				text: 'The derivative of x³ is:',
				options: [
					'3x',
					'3x²',
					'x²',
					'3'
				],
				correctAnswer: 1,
				difficulty: 'easy'
			},
			{
				id: 2,
				text: 'What is the limit of sin(x)/x as x approaches 0?',
				options: [
					'0',
					'1',
					'Undefined',
					'Infinity'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			},
			{
				id: 3,
				text: 'The integral of e^x is:',
				options: [
					'e^(x+1)',
					'e^x + C',
					'x*e^x + C',
					'1/x'
				],
				correctAnswer: 1,
				difficulty: 'easy'
			},
			{
				id: 4,
				text: 'Using the chain rule, the derivative of sin(x²) is:',
				options: [
					'cos(x²)',
					'2x*cos(x²)',
					'x*cos(x)',
					'sin(2x)'
				],
				correctAnswer: 1,
				difficulty: 'hard'
			},
			{
				id: 5,
				text: 'The Fundamental Theorem of Calculus states:',
				options: [
					'Integration and differentiation are inverse operations',
					'All continuous functions are differentiable',
					'All functions have a derivative',
					'The area under a curve is always positive'
				],
				correctAnswer: 0,
				difficulty: 'hard'
			}
		],
		'algebra': [
			{
				id: 1,
				text: 'Solve: 2x + 5 = 13',
				options: [
					'x = 2',
					'x = 3',
					'x = 4',
					'x = 5'
				],
				correctAnswer: 2,
				difficulty: 'easy'
			},
			{
				id: 2,
				text: 'Factor: x² - 5x + 6',
				options: [
					'(x-2)(x-3)',
					'(x+2)(x+3)',
					'(x-1)(x-6)',
					'(x+1)(x-6)'
				],
				correctAnswer: 0,
				difficulty: 'easy'
			},
			{
				id: 3,
				text: 'The sum of roots of ax² + bx + c = 0 is:',
				options: [
					'b/a',
					'-b/a',
					'c/a',
					'a/b'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			},
			{
				id: 4,
				text: 'For a quadratic equation with discriminant = 0:',
				options: [
					'No real roots',
					'Two distinct real roots',
					'Two equal real roots',
					'Complex roots'
				],
				correctAnswer: 2,
				difficulty: 'medium'
			},
			{
				id: 5,
				text: 'Solve: |x - 3| = 5',
				options: [
					'x = 8 only',
					'x = -2 only',
					'x = 8 or x = -2',
					'x = 8 or x = 2'
				],
				correctAnswer: 2,
				difficulty: 'hard'
			}
		]
	},
	'chemistry': {
		'atomic structure': [
			{
				id: 1,
				text: 'How many electrons are in the 3d subshell when completely filled?',
				options: [
					'5',
					'10',
					'15',
					'20'
				],
				correctAnswer: 1,
				difficulty: 'easy'
			},
			{
				id: 2,
				text: 'The maximum number of electrons in the M shell is:',
				options: [
					'2',
					'8',
					'18',
					'32'
				],
				correctAnswer: 2,
				difficulty: 'medium'
			},
			{
				id: 3,
				text: 'Which quantum number determines the energy of an electron?',
				options: [
					'l (azimuthal)',
					'm (magnetic)',
					'n (principal)',
					's (spin)'
				],
				correctAnswer: 2,
				difficulty: 'medium'
			},
			{
				id: 4,
				text: 'Aufbau principle states that electrons fill:',
				options: [
					'All s orbitals first',
					'Orbitals of lowest energy first',
					'Highest energy orbitals first',
					'p orbitals before d orbitals'
				],
				correctAnswer: 1,
				difficulty: 'hard'
			},
			{
				id: 5,
				text: 'The spin quantum number can take values:',
				options: [
					'0, 1, 2, 3...',
					'+1/2 or -1/2',
					'-1, 0, +1',
					'Any real number'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			}
		]
	},
	'biology': {
		'genetics': [
			{
				id: 1,
				text: 'Mendel\'s law of segregation states:',
				options: [
					'Alleles segregate during gamete formation',
					'Chromosomes never separate',
					'All traits blend equally',
					'Dominant traits always express'
				],
				correctAnswer: 0,
				difficulty: 'easy'
			},
			{
				id: 2,
				text: 'In a testcross, an organism with dominant phenotype is crossed with:',
				options: [
					'A homozygous dominant individual',
					'A heterozygous individual',
					'A homozygous recessive individual',
					'Another dominant phenotype'
				],
				correctAnswer: 2,
				difficulty: 'medium'
			},
			{
				id: 3,
				text: 'A dihybrid cross between two heterozygous individuals produces a ratio of:',
				options: [
					'1:1',
					'3:1',
					'9:3:3:1',
					'1:2:1'
				],
				correctAnswer: 2,
				difficulty: 'hard'
			},
			{
				id: 4,
				text: 'DNA replication is:',
				options: [
					'Conservative',
					'Semi-conservative',
					'Dispersive',
					'Non-conservative'
				],
				correctAnswer: 1,
				difficulty: 'medium'
			},
			{
				id: 5,
				text: 'The genetic code is:',
				options: [
					'Overlapping',
					'Non-overlapping and universal',
					'Species-specific',
					'Always redundant'
				],
				correctAnswer: 1,
				difficulty: 'hard'
			}
		]
	}
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { topic, subject = 'physics', difficulty = 'medium' } = body;

		if (!topic) {
			return NextResponse.json(
				{ error: 'Topic is required' },
				{ status: 400 }
			);
		}

		// Convert to lowercase for matching
		const subjectKey = subject.toLowerCase();
		const topicKey = topic.toLowerCase();

		// Get questions from database
		let questions = quizDatabase[subjectKey]?.[topicKey] || [];

		// If no questions found, try to generate a fallback quiz
		if (questions.length === 0) {
			questions = generateFallbackQuiz(topic, subject);
		}

		// Filter by difficulty if specified
		let filteredQuestions = questions;
		if (difficulty !== 'all') {
			filteredQuestions = questions.filter((q: any) => q.difficulty === difficulty);
			
			// If not enough questions at specified difficulty, include easier ones
			if (filteredQuestions.length < 5) {
				const remaining = questions.filter((q: any) => q.difficulty !== difficulty);
				filteredQuestions.push(...remaining.slice(0, 5 - filteredQuestions.length));
			}
		}

		// Ensure at least 5 questions
		const finalQuestions = filteredQuestions.slice(0, Math.max(5, filteredQuestions.length));

		// Shuffle options for each question
		const shuffledQuestions = finalQuestions.map((q: any) => ({
			...q,
			options: shuffleArray([...q.options]),
			// Store original correct answer index
			correctAnswerText: q.options[q.correctAnswer]
		}));

		return NextResponse.json({
			success: true,
			questions: shuffledQuestions,
			count: shuffledQuestions.length,
			topic,
			subject
		});
	} catch (error) {
		console.error('Quiz generation error:', error);
		return NextResponse.json(
			{ error: 'Failed to generate quiz' },
			{ status: 500 }
		);
	}
}

// Fallback quiz generation for unknown topics
function generateFallbackQuiz(topic: string, subject: string) {
	return [
		{
			id: 1,
			text: `What is the primary focus of ${topic}?`,
			options: [
				`Understanding fundamental concepts of ${topic}`,
				`Memorizing definitions`,
				`Solving complex problems`,
				`Advanced applications`
			],
			correctAnswer: 0,
			difficulty: 'easy'
		},
		{
			id: 2,
			text: `Which of the following is an important aspect of ${topic}?`,
			options: [
				'Basic principles',
				'Practical applications',
				'Historical development',
				'All of the above'
			],
			correctAnswer: 3,
			difficulty: 'medium'
		},
		{
			id: 3,
			text: `How is ${topic} connected to ${subject}?`,
			options: [
				'No connection',
				'Fundamental relationship',
				'Related through applications',
				'Completely independent'
			],
			correctAnswer: 1,
			difficulty: 'medium'
		},
		{
			id: 4,
			text: `What is a key challenge in learning ${topic}?`,
			options: [
				'Understanding core concepts',
				'Applying knowledge to real problems',
				'Memorization',
				'Calculation skills'
			],
			correctAnswer: 0,
			difficulty: 'medium'
		},
		{
			id: 5,
			text: `Which skill is most important for mastering ${topic}?`,
			options: [
				'Critical thinking',
				'Problem-solving',
				'Conceptual understanding',
				'All of the above'
			],
			correctAnswer: 3,
			difficulty: 'hard'
		}
	];
}

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
