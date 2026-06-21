'use client';

import { useActionState, useState } from 'react';

import { createGalleryPhotoAction } from '@/app/actions/admin-gallery.actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BabyAgeStage } from '@/domain/enums/baby-age-stage';

const ageStageOptions = [
  { value: BabyAgeStage.NEWBORN, label: 'Recém-nascido' },
  { value: BabyAgeStage.THREE_MONTHS, label: '3 meses' },
  { value: BabyAgeStage.SIX_MONTHS, label: '6 meses' },
  { value: BabyAgeStage.NINE_MONTHS, label: '9 meses' },
  { value: BabyAgeStage.ONE_YEAR, label: '1 ano' },
];

export function AdminPhotoForm() {
  const [state, formAction, isPending] = useActionState(createGalleryPhotoAction, null);
  const [formKey, setFormKey] = useState(0);
  const [prevState, setPrevState] = useState(state);

  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) setFormKey((key) => key + 1);
  }

  return (
    <Card whimsyAccent className="w-full max-w-2xl">
      <form key={formKey} action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
          <Select label="Fase" name="ageLabel" options={ageStageOptions} required />
          <Input
            label="Ordem de exibição"
            name="displayOrder"
            type="number"
            defaultValue={0}
            min={0}
            inputMode="numeric"
          />
        </div>

        <Input label="Imagem" name="image" type="file" accept="image/*" required />

        <div className="mt-2 flex flex-col items-center gap-2">
          <Button type="submit" disabled={isPending} className="w-full md:w-auto md:px-12">
            {isPending ? 'Salvando…' : 'Adicionar foto'}
          </Button>
          {state?.success && (
            <p className="font-body text-sm text-primary-700">Foto adicionada! ♡</p>
          )}
          {state?.success === false && (
            <p className="font-body text-sm text-secondary-700">{state.message}</p>
          )}
        </div>
      </form>
    </Card>
  );
}
