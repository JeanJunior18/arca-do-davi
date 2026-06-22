import type { GalleryPhoto } from '@/domain/entities/gallery-photo';
import type { BabyAgeStage } from '@/domain/enums/baby-age-stage';

export interface AdminGalleryRepository {
  createPhoto(input: {
    ageLabel: BabyAgeStage;
    displayOrder: number;
    image: File;
  }): Promise<GalleryPhoto>;
  getNextDisplayOrder(): Promise<number>;
}
