'use server';

import { createGiftItem } from '@/application/use-cases/create-gift-item.use-case';
import type { GiftCategory } from '@/domain/enums/gift-category';
import { SupabaseAdminGiftRepository } from '@/infrastructure/supabase/admin-gift-repository.supabase';
import { createSecretServerClient } from '@/infrastructure/supabase/secret-server-client';

export interface AdminGiftActionResult {
  success: boolean;
  message?: string;
}

export async function createGiftItemAction(
  _prevState: AdminGiftActionResult | null,
  formData: FormData,
): Promise<AdminGiftActionResult> {
  try {
    const repository = new SupabaseAdminGiftRepository(createSecretServerClient());

    await createGiftItem(repository, {
      name: String(formData.get('name') ?? ''),
      description: formData.get('description')?.toString() || undefined,
      category: formData.get('category') as GiftCategory,
      sizeLabel: formData.get('sizeLabel')?.toString() || undefined,
      quantityNeeded: Number(formData.get('quantityNeeded') ?? 1),
      purchaseUrl: formData.get('purchaseUrl')?.toString() || undefined,
      image: formData.get('image') as File,
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Erro inesperado.' };
  }
}
