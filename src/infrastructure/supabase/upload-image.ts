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

export async function uploadRemoteImageToMedia(
  client: SupabaseClient,
  basePath: string,
  imageUrl: string,
): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Falha ao baixar imagem de ${imageUrl}: HTTP ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${basePath}.${ext}`;

  const { error } = await client.storage
    .from('media')
    .upload(path, buffer, { upsert: true, contentType });
  if (error) throw error;

  const { data } = client.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}
