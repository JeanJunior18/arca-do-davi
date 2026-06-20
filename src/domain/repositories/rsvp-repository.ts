import type { Rsvp } from '@/domain/entities/rsvp';

export type RsvpUpsertResult =
  | { status: 'CREATED' }
  | { status: 'UPDATED' }
  | { status: 'ALREADY_EXISTS'; guestName: string; companionCount: number };

export interface RsvpRepository {
  upsert(input: {
    guestName: string;
    companionCount: number;
    whatsappNumber: string;
    confirmUpdate: boolean;
  }): Promise<RsvpUpsertResult>;
  listAll(): Promise<Rsvp[]>; // só deve ser chamado por código que usa service role
}
