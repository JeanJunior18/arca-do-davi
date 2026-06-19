'use server';

import { confirmAttendance } from '@/application/use-cases/confirm-attendance.use-case';
import { createPublishableServerClient } from '@/infrastructure/supabase/publishable-server-client';
import { SupabaseRsvpRepository } from '@/infrastructure/supabase/rsvp-repository.supabase';

export interface RsvpActionResult {
  success: boolean;
  message?: string;
}

export async function confirmAttendanceAction(formData: FormData): Promise<RsvpActionResult> {
  try {
    const repository = new SupabaseRsvpRepository(createPublishableServerClient());

    await confirmAttendance(repository, {
      guestName: String(formData.get('guestName') ?? ''),
      companionCount: Number(formData.get('companionCount') ?? 0),
      whatsappNumber: String(formData.get('whatsappNumber') ?? ''),
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Erro inesperado.' };
  }
}
