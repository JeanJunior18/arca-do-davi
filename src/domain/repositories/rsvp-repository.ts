import type { Rsvp } from '@/domain/entities/rsvp';

export interface RsvpRepository {
  create(input: {
    guestName: string;
    companionCount: number;
    whatsappNumber: string;
  }): Promise<Rsvp>;
  listAll(): Promise<Rsvp[]>; // só deve ser chamado por código que usa service role
}
