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
    const { data, error } = await this.client
      .from('rsvps')
      .insert({
        guest_name: input.guestName,
        companion_count: input.companionCount,
        whatsapp_number: input.whatsappNumber,
      })
      .select()
      .single();

    if (error) throw error;
    return toRsvp(data as RsvpRow);
  }

  async listAll(): Promise<Rsvp[]> {
    const { data, error } = await this.client.from('rsvps').select();
    if (error) throw error;
    return (data as RsvpRow[]).map(toRsvp);
  }
}
