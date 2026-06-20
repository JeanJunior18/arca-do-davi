'use client';

import type { ReactNode } from 'react';
import { useOptimistic, useState, useTransition } from 'react';

import { claimDiaperPackAction, claimRegistryItemAction } from '@/app/actions/gift.actions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type { GiftItem } from '@/domain/entities/gift-item';
import { GiftCategory } from '@/domain/enums/gift-category';
import { GiftStatus } from '@/domain/enums/gift-status';

export interface GiftCardProps {
  item: GiftItem;
}

interface GiftClaimStrategy {
  ctaLabel: string;
  claimedLabel: string;
  claim: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  renderExtraFields?: () => ReactNode;
}

const claimStrategyByCategory: Record<GiftCategory, GiftClaimStrategy> = {
  [GiftCategory.REGISTRY_ITEM]: {
    ctaLabel: 'Quero dar esse presente',
    claimedLabel: 'Já reservado, obrigado!',
    claim: claimRegistryItemAction,
  },
  [GiftCategory.DIAPER_PACK]: {
    ctaLabel: 'Reservar fraldas',
    claimedLabel: 'Obrigado pela reserva!',
    claim: claimDiaperPackAction,
    renderExtraFields: () => (
      <Input
        label="Quantidade"
        name="quantity"
        type="number"
        defaultValue={1}
        min={1}
        inputMode="numeric"
      />
    ),
  },
};

export function GiftCard({ item }: GiftCardProps) {
  const strategy = claimStrategyByCategory[item.category];
  const [confirmedItem, setConfirmedItem] = useState(item);
  const [optimisticItem, setOptimisticItem] = useOptimistic(confirmedItem);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isClaimed = optimisticItem.status !== GiftStatus.AVAILABLE;

  function handleSubmit(formData: FormData) {
    formData.set('giftItemId', item.id);
    setFeedback(null);

    startTransition(async () => {
      setOptimisticItem({ ...item, status: GiftStatus.CLAIMED });

      const result = await strategy.claim(formData);

      if (result.success) {
        setConfirmedItem({ ...item, status: GiftStatus.CLAIMED });
      } else {
        setFeedback(result.message ?? 'Não foi possível reservar esse item.');
      }
    });
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-primary-700">{item.name}</h3>
          {item.sizeLabel && (
            <Badge variant="outline" className="mt-1">
              {item.sizeLabel}
            </Badge>
          )}
        </div>
      </div>

      {item.description && <p className="font-body text-sm text-ink-soft">{item.description}</p>}

      {isClaimed ? (
        <p className="font-body text-sm font-semibold text-primary-700">{strategy.claimedLabel}</p>
      ) : (
        <form action={handleSubmit} className="flex flex-col gap-3">
          <Input label="Seu nome" name="guestName" placeholder="Digite seu nome" required minLength={2} />
          {strategy.renderExtraFields?.()}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Reservando…' : strategy.ctaLabel}
          </Button>
          {feedback && <p className="font-body text-sm text-secondary-700">{feedback}</p>}
        </form>
      )}
    </Card>
  );
}
