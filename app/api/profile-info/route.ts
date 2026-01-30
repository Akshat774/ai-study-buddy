import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
	try {
		const body = await request.json();

		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user)
			return Response.json(
				{ success: false, error: 'User Not Found.' },
				{ status: 401 },
			);

		const { fullName, targetExam, currentClass, strengths, weaknesses } = body;

		const { data, error } = await supabase
			.from('profile')
			.upsert({
				user_id: user.id,
				name: fullName,
				target: targetExam,
				class: currentClass,
				strengths: strengths,
				weakness: weaknesses,
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error)
			return Response.json(
				{
					success: false,
					error: error.message || 'An unexpected error occurred!',
				},
				{ status: 500 },
			);

		return Response.json({ success: true, data });
	} catch (error: any) {
		return Response.json(
			{ success: false, error: error.message || 'Internal Server Error' },
			{ status: 500 },
		);
	}
};

export const GET = async () => {
	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user)
			return Response.json(
				{ success: false, error: 'Not Authorized' },
				{ status: 401 },
			);

		const { data, error } = await supabase
			.from('profile')
			.select('name, target, class, strengths, weakness')
			.eq('user_id', user.id)
			.single();

		if (error)
			return Response.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);

		return Response.json({ success: true, data });
	} catch (error) {
		return Response.json(
			{ success: false, error: error || 'Internal Server Error' },
			{ status: 500 },
		);
	}
};
