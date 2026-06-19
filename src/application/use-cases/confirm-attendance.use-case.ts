import { z } from 'zod';

import type { Rsvp } from '@/domain/entities/rsvp';
import type { RsvpRepository } from '@/domain/repositories/rsvp-repository';

const confirmAttendanceInputSchema = z.object({
  guestName: z.string().min(2),
  companionCount: z.number().int().nonnegative(),
  whatsappNumber: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/),
});

export type ConfirmAttendanceInput = z.infer<typeof confirmAttendanceInputSchema>;

export async function confirmAttendance(
  rsvpRepository: RsvpRepository,
  input: ConfirmAttendanceInput,
): Promise<Rsvp> {
  const parsed = confirmAttendanceInputSchema.parse(input);
  return rsvpRepository.create(parsed);
}
