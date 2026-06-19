import type { BabyAgeStage } from '@/domain/enums/baby-age-stage';

export interface GalleryPhoto {
  id: string;
  ageLabel: BabyAgeStage;
  imageUrl: string;
  displayOrder: number;
}
