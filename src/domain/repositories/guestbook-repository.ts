import type { GuestbookMessage } from '@/domain/entities/guestbook-message';

export interface GuestbookRepository {
  create(input: { guestName: string; message: string }): Promise<GuestbookMessage>;
  listApproved(): Promise<GuestbookMessage[]>;
}
