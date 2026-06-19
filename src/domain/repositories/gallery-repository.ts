import type { GalleryPhoto } from '@/domain/entities/gallery-photo';

export interface GalleryRepository {
  listOrdered(): Promise<GalleryPhoto[]>;
}
