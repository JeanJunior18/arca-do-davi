import type { SupabaseClient } from '@supabase/supabase-js';

export function imageExtension(image: File): string {
  if (image.type.includes('png')) return 'png';
  if (image.type.includes('webp')) return 'webp';
  return 'jpg';
}

export async function uploadImageToMedia(
  client: SupabaseClient,
  path: string,
  image: File,
): Promise<string> {
  const buffer = Buffer.from(await image.arrayBuffer());

  const { error } = await client.storage
    .from('media')
    .upload(path, buffer, { upsert: true, contentType: image.type });
  if (error) throw error;

  const { data } = client.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}
