import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload PDF to Supabase Storage
export async function uploadPDF(file: File, userId: string): Promise<{ path: string; url: string } | null> {
	try {
		const fileName = `${userId}/${Date.now()}-${file.name}`;
		const { data, error } = await supabase.storage
			.from('study-pdfs')
			.upload(fileName, file);

		if (error) throw error;

		// Get public URL
		const { data: publicUrl } = supabase.storage
			.from('study-pdfs')
			.getPublicUrl(fileName);

		return {
			path: data.path,
			url: publicUrl.publicUrl,
		};
	} catch (error) {
		console.error('PDF upload error:', error);
		return null;
	}
}

// Upload profile photo to Supabase Storage
export async function uploadProfilePhoto(
	file: File,
	userId: string
): Promise<{ path: string; url: string } | null> {
	try {
		const fileName = `${userId}/profile-${Date.now()}`;
		const { data, error } = await supabase.storage
			.from('profile-photos')
			.upload(fileName, file, { upsert: true });

		if (error) throw error;

		const { data: publicUrl } = supabase.storage
			.from('profile-photos')
			.getPublicUrl(fileName);

		return {
			path: data.path,
			url: publicUrl.publicUrl,
		};
	} catch (error) {
		console.error('Profile photo upload error:', error);
		return null;
	}
}

// Delete file from Supabase Storage
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
	try {
		const { error } = await supabase.storage
			.from(bucket)
			.remove([path]);

		if (error) throw error;
		return true;
	} catch (error) {
		console.error('File deletion error:', error);
		return false;
	}
}
