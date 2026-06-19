import { describe, expect, it } from 'vitest';

import type { GuestbookMessage } from '@/domain/entities/guestbook-message';
import type { GuestbookRepository } from '@/domain/repositories/guestbook-repository';

import { leaveGuestbookMessage } from './leave-guestbook-message.use-case';

class FakeGuestbookRepository implements GuestbookRepository {
  async create(input: { guestName: string; message: string }): Promise<GuestbookMessage> {
    return { id: 'id', isApproved: true, createdAt: '', ...input };
  }

  async listApproved(): Promise<GuestbookMessage[]> {
    return [];
  }
}

describe('leaveGuestbookMessage', () => {
  it('cria a mensagem quando o input é válido', async () => {
    const repository = new FakeGuestbookRepository();

    const result = await leaveGuestbookMessage(repository, {
      guestName: 'Maria',
      message: 'Parabéns, Davi!',
    });

    expect(result.message).toBe('Parabéns, Davi!');
  });

  it('rejeita mensagem com mais de 500 caracteres', async () => {
    const repository = new FakeGuestbookRepository();

    await expect(
      leaveGuestbookMessage(repository, { guestName: 'Maria', message: 'a'.repeat(501) }),
    ).rejects.toThrow();
  });

  it('rejeita mensagem vazia', async () => {
    const repository = new FakeGuestbookRepository();

    await expect(
      leaveGuestbookMessage(repository, { guestName: 'Maria', message: '' }),
    ).rejects.toThrow();
  });
});
