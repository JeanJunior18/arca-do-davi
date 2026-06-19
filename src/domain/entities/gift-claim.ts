export interface GiftClaim {
  id: string;
  giftItemId: string;
  guestName: string;
  guestWhatsapp: string | null;
  quantityClaimed: number;
  createdAt: string;
}
