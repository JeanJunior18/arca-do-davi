import type { GalleryPhoto } from '@/domain/entities/gallery-photo';
import type { GalleryRepository } from '@/domain/repositories/gallery-repository';

export async function listGalleryPhotos(
  galleryRepository: GalleryRepository,
): Promise<GalleryPhoto[]> {
  return galleryRepository.listOrdered();
}
