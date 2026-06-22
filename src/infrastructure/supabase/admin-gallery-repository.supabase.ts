import type { SupabaseClient } from '@supabase/supabase-js';

import type { GalleryPhoto } from '@/domain/entities/gallery-photo';
import type { BabyAgeStage } from '@/domain/enums/baby-age-stage';
import type { AdminGalleryRepository } from '@/domain/repositories/admin-gallery-repository';

import { imageExtension, uploadImageToMedia } from './upload-image';

interface GalleryPhotoRow {
  id: string;
  age_label: BabyAgeStage;
  image_url: string;
  display_order: number;
}

function toGalleryPhoto(row: GalleryPhotoRow): GalleryPhoto {
  return {
    id: row.id,
    ageLabel: row.age_label,
    imageUrl: row.image_url,
    displayOrder: row.display_order,
  };
}

export class SupabaseAdminGalleryRepository implements AdminGalleryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async createPhoto(input: {
    ageLabel: BabyAgeStage;
    displayOrder: number;
    image: File;
  }): Promise<GalleryPhoto> {
    const id = crypto.randomUUID();
    const imageUrl = await uploadImageToMedia(
      this.client,
      `gallery/${id}.${imageExtension(input.image)}`,
      input.image,
    );

    const { data, error } = await this.client
      .from('gallery_photos')
      .insert({
        id,
        age_label: input.ageLabel,
        image_url: imageUrl,
        display_order: input.displayOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return toGalleryPhoto(data as GalleryPhotoRow);
  }

  async getNextDisplayOrder(): Promise<number> {
    const { data, error } = await this.client
      .from('gallery_photos')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? data.display_order + 1 : 0;
  }
}
