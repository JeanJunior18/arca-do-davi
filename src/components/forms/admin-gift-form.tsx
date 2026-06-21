'use client';

import { useActionState, useState } from 'react';

import { createGiftItemAction } from '@/app/actions/admin-gift.actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { GiftCategory } from '@/domain/enums/gift-category';

const categoryOptions = [
  { value: GiftCategory.REGISTRY_ITEM, label: 'Item de lista' },
  { value: GiftCategory.DIAPER_PACK, label: 'Pacote de fraldas' },
];

export function AdminGiftForm() {
  const [state, formAction, isPending] = useActionState(createGiftItemAction, null);
  const [formKey, setFormKey] = useState(0);
  const [prevState, setPrevState] = useState(state);

  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) setFormKey((key) => key + 1);
  }

  return (
    <Card whimsyAccent className="w-full max-w-2xl">
      <form key={formKey} action={formAction} className="flex flex-col gap-5">
        <Input label="Nome" name="name" placeholder="Nome do presente" required minLength={2} />
        <Textarea label="Descrição (opcional)" name="description" placeholder="Detalhes do presente" />

        <div className="flex flex-col gap-5 md:flex-row">
          <Select label="Categoria" name="category" options={categoryOptions} required />
          <Input label="Tamanho (só pra fraldas)" name="sizeLabel" placeholder="Ex: G, XG" />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <Input
            label="Quantidade necessária"
            name="quantityNeeded"
            type="number"
            defaultValue={1}
            min={1}
            inputMode="numeric"
          />
          <Input label="Link de compra (opcional)" name="purchaseUrl" type="url" placeholder="https://..." />
        </div>

        <Input label="Imagem" name="image" type="file" accept="image/*" required />

        <div className="mt-2 flex flex-col items-center gap-2">
          <Button type="submit" disabled={isPending} className="w-full md:w-auto md:px-12">
            {isPending ? 'Salvando…' : 'Adicionar presente'}
          </Button>
          {state?.success && (
            <p className="font-body text-sm text-primary-700">Presente adicionado! ♡</p>
          )}
          {state?.success === false && (
            <p className="font-body text-sm text-secondary-700">{state.message}</p>
          )}
        </div>
      </form>
    </Card>
  );
}
