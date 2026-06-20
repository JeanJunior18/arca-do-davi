import type { SupabaseClient } from '@supabase/supabase-js';

import type { GiftClaim } from '@/domain/entities/gift-claim';
import type { GiftItem } from '@/domain/entities/gift-item';
import type { GiftCategory } from '@/domain/enums/gift-category';
import type { GiftStatus } from '@/domain/enums/gift-status';
import type {
  ClaimRegistryItemResult,
  GiftRepository,
} from '@/domain/repositories/gift-repository';

interface GiftItemRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: GiftCategory;
  size_label: string | null;
  quantity_needed: number;
  status: GiftStatus;
  created_at: string;
}

interface GiftClaimRow {
  id: string;
  gift_item_id: string;
  guest_name: string;
  guest_whatsapp: string | null;
  quantity_claimed: number;
  created_at: string;
}

function toGiftItem(row: GiftItemRow): GiftItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    sizeLabel: row.size_label,
    quantityNeeded: row.quantity_needed,
    status: row.status,
    createdAt: row.created_at,
  };
}

function toGiftClaim(row: GiftClaimRow): GiftClaim {
  return {
    id: row.id,
    giftItemId: row.gift_item_id,
    guestName: row.guest_name,
    guestWhatsapp: row.guest_whatsapp,
    quantityClaimed: row.quantity_claimed,
    createdAt: row.created_at,
  };
}

export class SupabaseGiftRepository implements GiftRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listItems(): Promise<GiftItem[]> {
    const { data, error } = await this.client.from('gift_items').select();
    if (error) throw error;
    return (data as GiftItemRow[]).map(toGiftItem);
  }

  async claimRegistryItem(input: {
    giftItemId: string;
    guestName: string;
    guestWhatsapp?: string;
  }): Promise<ClaimRegistryItemResult> {
    const { data, error } = await this.client.rpc('claim_gift_item', {
      p_gift_item_id: input.giftItemId,
      p_guest_name: input.guestName,
      p_guest_whatsapp: input.guestWhatsapp ?? null,
    });

    if (error) {
      if (error.message.includes('ALREADY_CLAIMED')) {
        return { success: false, reason: 'ALREADY_CLAIMED' };
      }
      throw error;
    }

    return { success: true, claim: toGiftClaim(data as GiftClaimRow) };
  }

  async claimDiaperPack(input: {
    giftItemId: string;
    guestName: string;
    guestWhatsapp?: string;
    quantity: number;
  }): Promise<GiftClaim> {
    // `gift_claims` não tem policy de SELECT pra `anon` (de propósito — identidade de
    // quem reservou nunca é exposta publicamente), então não dá pra encadear `.select()`
    // no insert: o Postgres exigiria que a linha passasse por uma policy de SELECT pra
    // satisfazer o RETURNING e lançaria "new row violates row-level security policy".
    const { error } = await this.client.from('gift_claims').insert({
      gift_item_id: input.giftItemId,
      guest_name: input.guestName,
      guest_whatsapp: input.guestWhatsapp ?? null,
      quantity_claimed: input.quantity,
    });

    if (error) throw error;

    return {
      id: crypto.randomUUID(),
      giftItemId: input.giftItemId,
      guestName: input.guestName,
      guestWhatsapp: input.guestWhatsapp ?? null,
      quantityClaimed: input.quantity,
      createdAt: new Date().toISOString(),
    };
  }
}
