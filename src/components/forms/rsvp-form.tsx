'use client';

import { useActionState } from 'react';

import { confirmAttendanceAction } from '@/app/actions/rsvp.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function RsvpForm() {
  const [state, formAction, isPending] = useActionState(confirmAttendanceAction, null);

  if (state?.success) {
    return (
      <p className="font-body text-primary-700">
        Presença confirmada! Mal podemos esperar pra celebrar com você. 💚
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-3">
      <div className="md:flex-1">
        <Input label="Nome" name="guestName" placeholder="Digite seu nome" required minLength={2} />
      </div>
      <div className="md:flex-1">
        <Input
          label="Quantidade de acompanhantes"
          name="companionCount"
          type="number"
          defaultValue={0}
          min={0}
          inputMode="numeric"
        />
      </div>
      <div className="md:flex-1">
        <Input
          label="Whatsapp"
          name="whatsappNumber"
          placeholder="(00) 00000-0000"
          required
          pattern="^\(\d{2}\)\s?\d{4,5}-?\d{4}$"
        />
      </div>

      <div className="flex flex-col gap-2 md:pt-6">
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? 'Enviando…' : 'Confirmar presença ♡'}
        </Button>
        {state?.message && <p className="font-body text-sm text-secondary-700">{state.message}</p>}
      </div>
    </form>
  );
}
