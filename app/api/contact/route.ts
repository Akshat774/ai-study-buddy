import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, message, subject } = body;

		// Validate input
		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email address' },
				{ status: 400 }
			);
		}

		// In production, use Resend or SendGrid to send actual emails
		// Example with Resend:
		// const response = await fetch('https://api.resend.com/emails', {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
		//   },
		//   body: JSON.stringify({
		//     from: 'onboarding@resend.dev',
		//     to: 'your-email@example.com',
		//     subject: `New Contact: ${subject || 'Message'}`,
		//     html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
		//   }),
		// });

		// For now, log the message (production would send real email)
		console.log('Contact form submission:', {
			name,
			email,
			message,
			subject,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json(
			{
				success: true,
				message: 'Your message has been received. We will get back to you soon!',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Contact form error:', error);
		return NextResponse.json(
			{ error: 'Failed to send message. Please try again.' },
			{ status: 500 }
		);
	}
}
