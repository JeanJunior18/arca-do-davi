import type { SupabaseClient } from '@supabase/supabase-js';

import type { Rsvp } from '@/domain/entities/rsvp';
import type { RsvpRepository, RsvpUpsertResult } from '@/domain/repositories/rsvp-repository';

interface RsvpRow {
  id: string;
  guest_name: string;
  companion_count: number;
  whatsapp_number: string;
  created_at: string;
}

interface UpsertRsvpRow {
  status: 'CREATED' | 'UPDATED' | 'ALREADY_EXISTS';
  guest_name: string;
  companion_count: number;
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

  async upsert(input: {
    guestName: string;
    companionCount: number;
    whatsappNumber: string;
    confirmUpdate: boolean;
  }): Promise<RsvpUpsertResult> {
    const { data, error } = await this.client.rpc('upsert_rsvp', {
      p_guest_name: input.guestName,
      p_companion_count: input.companionCount,
      p_whatsapp_number: input.whatsappNumber,
      p_confirm_update: input.confirmUpdate,
    });

    if (error) throw error;

    const row = (Array.isArray(data) ? data[0] : data) as UpsertRsvpRow;

    if (row.status === 'ALREADY_EXISTS') {
      return {
        status: 'ALREADY_EXISTS',
        guestName: row.guest_name,
        companionCount: row.companion_count,
      };
    }

    return { status: row.status };
  }

  async listAll(): Promise<Rsvp[]> {
    const { data, error } = await this.client.from('rsvps').select();
    if (error) throw error;
    return (data as RsvpRow[]).map(toRsvp);
  }
}
