import { describe, expect, it } from 'vitest';

import type { Rsvp } from '@/domain/entities/rsvp';
import type { RsvpRepository } from '@/domain/repositories/rsvp-repository';

import { confirmAttendance } from './confirm-attendance.use-case';

class FakeRsvpRepository implements RsvpRepository {
  public created: Array<{ guestName: string; companionCount: number; whatsappNumber: string }> = [];

  async create(input: {
    guestName: string;
    companionCount: number;
    whatsappNumber: string;
  }): Promise<Rsvp> {
    this.created.push(input);
    return { id: 'fake-id', createdAt: new Date().toISOString(), ...input };
  }

  async listAll(): Promise<Rsvp[]> {
    return [];
  }
}

describe('confirmAttendance', () => {
  it('cria o rsvp quando o input é válido', async () => {
    const repository = new FakeRsvpRepository();

    const result = await confirmAttendance(repository, {
      guestName: 'Maria',
      companionCount: 2,
      whatsappNumber: '(11) 91234-5678',
    });

    expect(result.guestName).toBe('Maria');
    expect(repository.created).toHaveLength(1);
  });

  it('rejeita whatsapp fora do formato esperado', async () => {
    const repository = new FakeRsvpRepository();

    await expect(
      confirmAttendance(repository, {
        guestName: 'Maria',
        companionCount: 0,
        whatsappNumber: '11912345678',
      }),
    ).rejects.toThrow();
  });

  it('rejeita guestName com menos de 2 caracteres', async () => {
    const repository = new FakeRsvpRepository();

    await expect(
      confirmAttendance(repository, {
        guestName: 'M',
        companionCount: 0,
        whatsappNumber: '(11) 91234-5678',
      }),
    ).rejects.toThrow();
  });
});
