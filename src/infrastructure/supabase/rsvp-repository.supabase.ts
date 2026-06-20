import type { SupabaseClient } from '@supabase/supabase-js';

import type { Rsvp } from '@/domain/entities/rsvp';
import type { RsvpRepository } from '@/domain/repositories/rsvp-repository';

interface RsvpRow {
  id: string;
  guest_name: string;
  companion_count: number;
  whatsapp_number: string;
  created_at: string;
}

function toRsvp(row: RsvpRow): Rsvp {
  return {
    id: row.id,
    guestName: row.guest_name,
    companionCount: row.companion_count,
    whatsappNumber: row.whatsapp_number,
    createdAt: row.created_at,
  };
}

export class SupabaseRsvpRepository implements RsvpRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(input: {
    guestName: string;
    companionCount: number;
    whatsappNumber: string;
  }): Promise<Rsvp> {
    // `rsvps` não tem policy de SELECT pra `anon` (de propósito — ver domain-model.md
    // regra #5), então não dá pra encadear `.select()` no insert: o Postgres exige que
    // a linha inserida passe por uma policy de SELECT pra satisfazer o RETURNING, e
    // lançaria "new row violates row-level security policy". Por isso o insert é
    // "fire and forget" e a entity é montada a partir do input, sem ida ao banco.
    const { error } = await this.client.from('rsvps').insert({
      guest_name: input.guestName,
      companion_count: input.companionCount,
      whatsapp_number: input.whatsappNumber,
    });

    if (error) throw error;

    return {
      id: crypto.randomUUID(),
      guestName: input.guestName,
      companionCount: input.companionCount,
      whatsappNumber: input.whatsappNumber,
      createdAt: new Date().toISOString(),
    };
  }

  async listAll(): Promise<Rsvp[]> {
    const { data, error } = await this.client.from('rsvps').select();
    if (error) throw error;
    return (data as RsvpRow[]).map(toRsvp);
  }
}
