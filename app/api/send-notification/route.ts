import { NextRequest, NextResponse } from 'next/server';

// Mock notifications store (in production, use Supabase)
let notifications: Array<{
	id: string;
	type: 'quiz' | 'achievement' | 'reminder' | 'info';
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
}> = [];

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { type, title, message, userId } = body;

		// Validate input
		if (!type || !title || !message) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const notification = {
			id: Date.now().toString(),
			type,
			title,
			message,
			timestamp: new Date(),
			read: false,
		};

		// In production, save to Supabase
		// await supabase.from('notifications').insert({ ...notification, userId })

		notifications.push(notification);

		return NextResponse.json(
			{ success: true, notification },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Notification error:', error);
		return NextResponse.json(
			{ error: 'Failed to send notification' },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		// Get unread count
		const unreadCount = notifications.filter(n => !n.read).length;

		return NextResponse.json({
			notifications: notifications.sort(
				(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			),
			unreadCount,
		});
	} catch (error) {
		console.error('Get notifications error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch notifications' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { notificationId, read } = body;

		const notification = notifications.find(n => n.id === notificationId);
		if (notification) {
			notification.read = read;
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Update notification error:', error);
		return NextResponse.json(
			{ error: 'Failed to update notification' },
			{ status: 500 }
		);
	}
}
