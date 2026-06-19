import type { GiftCategory } from '@/domain/enums/gift-category';
import type { GiftStatus } from '@/domain/enums/gift-status';

export interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: GiftCategory;
  sizeLabel: string | null;
  quantityNeeded: number;
  status: GiftStatus;
  createdAt: string;
}
