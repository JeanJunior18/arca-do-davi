import type { AdminGalleryRepository } from '@/domain/repositories/admin-gallery-repository';

export async function getNextGalleryDisplayOrder(
  repository: AdminGalleryRepository,
): Promise<number> {
  return repository.getNextDisplayOrder();
}
