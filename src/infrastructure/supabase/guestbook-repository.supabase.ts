import type { SupabaseClient } from '@supabase/supabase-js';

import type { GuestbookMessage } from '@/domain/entities/guestbook-message';
import type { GuestbookRepository } from '@/domain/repositories/guestbook-repository';

interface GuestbookMessageRow {
  id: string;
  guest_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

function toGuestbookMessage(row: GuestbookMessageRow): GuestbookMessage {
  return {
    id: row.id,
    guestName: row.guest_name,
    message: row.message,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  };
}

export class SupabaseGuestbookRepository implements GuestbookRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(input: { guestName: string; message: string }): Promise<GuestbookMessage> {
    const { data, error } = await this.client
      .from('guestbook_messages')
      .insert({ guest_name: input.guestName, message: input.message })
      .select()
      .single();

    if (error) throw error;
    return toGuestbookMessage(data as GuestbookMessageRow);
  }

  async listApproved(): Promise<GuestbookMessage[]> {
    const { data, error } = await this.client
      .from('guestbook_messages')
      .select()
      .eq('is_approved', true);

    if (error) throw error;
    return (data as GuestbookMessageRow[]).map(toGuestbookMessage);
  }
}
