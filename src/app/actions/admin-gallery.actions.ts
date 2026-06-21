'use server';

import { createGalleryPhoto } from '@/application/use-cases/create-gallery-photo.use-case';
import type { BabyAgeStage } from '@/domain/enums/baby-age-stage';
import { SupabaseAdminGalleryRepository } from '@/infrastructure/supabase/admin-gallery-repository.supabase';
import { createSecretServerClient } from '@/infrastructure/supabase/secret-server-client';

export interface AdminGalleryActionResult {
  success: boolean;
  message?: string;
}

export async function createGalleryPhotoAction(
  _prevState: AdminGalleryActionResult | null,
  formData: FormData,
): Promise<AdminGalleryActionResult> {
  try {
    const repository = new SupabaseAdminGalleryRepository(createSecretServerClient());

    await createGalleryPhoto(repository, {
      ageLabel: formData.get('ageLabel') as BabyAgeStage,
      displayOrder: Number(formData.get('displayOrder') ?? 0),
      image: formData.get('image') as File,
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Erro inesperado.' };
  }
}
