import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user)
			return Response.json(
				{ success: false, error: 'User not found!' },
				{ status: 401 },
			);

		const { data: prevUrl } = await supabase
			.from('profile')
			.select('pfpUrl')
			.eq('user_id', user.id)
			.single();

		if (!file)
			return Response.json(
				{ success: false, error: 'No file provided!' },
				{ status: 400 },
			);

		const buffer = Buffer.from(await file.arrayBuffer());
		const fileName = `${Date.now()}-${file.name}`;
		const filePath = `uploads/${fileName}`;

		const { data, error } = await supabase.storage
			.from('profilePhotos')
			.upload(filePath, buffer, { contentType: file.type, upsert: false });

		if (error) {
			return Response.json({ success: false, error: error }, { status: 500 });
		}

		const { data: urlData } = supabase.storage
			.from('profilePhotos')
			.getPublicUrl(filePath);

		const { data: updateData, error: updateError } = await supabase
			.from('profile')
			.update({ pfpUrl: filePath })
			.eq('user_id', user.id);

		if (updateError)
			return Response.json(
				{ success: false, error: updateError },
				{ status: 500 },
			);

		if (prevUrl) {
			await supabase.storage.from('profilePhotos').remove(prevUrl.pfpUrl);
		}

		return Response.json({ success: true, url: urlData.publicUrl });
	} catch (error) {
		return Response.json({ success: false, error: error }, { status: 500 });
	}
};

export const GET = async (request: Request) => {
	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user)
			return Response.json(
				{ success: false, error: 'User does not exist!' },
				{ status: 401 },
			);

		const { data: profileData, error: profileError } = await supabase
			.from('profile')
			.select('pfpUrl')
			.eq('user_id', user.id)
			.single();

		if (profileError)
			return Response.json(
				{ success: false, error: profileError.message },
				{ status: 500 },
			);

		const { data } = await supabase.storage
			.from('profilePhotos')
			.getPublicUrl(profileData.pfpUrl);

		return Response.json({ success: true, publicUrl: data.publicUrl });
	} catch (error) {
		return Response.json(
			{ success: false, error: error || 'Internal Server Error' },
			{ status: 500 },
		);
	}
};
