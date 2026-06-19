import type { SupabaseClient } from '@supabase/supabase-js';

import type { GalleryPhoto } from '@/domain/entities/gallery-photo';
import type { BabyAgeStage } from '@/domain/enums/baby-age-stage';
import type { GalleryRepository } from '@/domain/repositories/gallery-repository';

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

export class SupabaseGalleryRepository implements GalleryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listOrdered(): Promise<GalleryPhoto[]> {
    const { data, error } = await this.client
      .from('gallery_photos')
      .select()
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data as GalleryPhotoRow[]).map(toGalleryPhoto);
  }
}
