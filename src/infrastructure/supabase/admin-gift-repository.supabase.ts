import type { SupabaseClient } from '@supabase/supabase-js';

import type { GiftItem } from '@/domain/entities/gift-item';
import { GiftCategory } from '@/domain/enums/gift-category';
import { GiftStatus } from '@/domain/enums/gift-status';
import type { AdminGiftRepository } from '@/domain/repositories/admin-gift-repository';

import { imageExtension, uploadImageToMedia } from './upload-image';

interface GiftItemRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: GiftCategory;
  size_label: string | null;
  quantity_needed: number;
  status: GiftStatus;
  created_at: string;
  purchase_url: string | null;
}

function toGiftItem(row: GiftItemRow): GiftItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    sizeLabel: row.size_label,
    quantityNeeded: row.quantity_needed,
    status: row.status,
    createdAt: row.created_at,
    purchaseUrl: row.purchase_url,
  };
}

export class SupabaseAdminGiftRepository implements AdminGiftRepository {
  constructor(private readonly client: SupabaseClient) {}

  async createItem(input: {
    name: string;
    description?: string;
    category: GiftCategory;
    sizeLabel?: string;
    quantityNeeded: number;
    purchaseUrl?: string;
    image: File;
  }): Promise<GiftItem> {
    const id = crypto.randomUUID();
    const imageUrl = await uploadImageToMedia(
      this.client,
      `gifts/${id}.${imageExtension(input.image)}`,
      input.image,
    );

    const { data, error } = await this.client
      .from('gift_items')
      .insert({
        id,
        name: input.name,
        description: input.description ?? null,
        image_url: imageUrl,
        category: input.category,
        size_label: input.sizeLabel ?? null,
        quantity_needed: input.quantityNeeded,
        status: GiftStatus.AVAILABLE,
        purchase_url: input.purchaseUrl ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return toGiftItem(data as GiftItemRow);
  }
}
