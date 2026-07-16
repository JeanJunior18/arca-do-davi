'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { GiftItem } from '@/data/keepsake-data';
import { GiftCategory } from '@/domain/enums/gift-category';
import { GiftStatus } from '@/domain/enums/gift-status';

export interface GiftCardProps {
  item: GiftItem;
}

const categoryLabel: Record<GiftCategory, string> = {
  [GiftCategory.REGISTRY_ITEM]: 'Lista de presentes',
  [GiftCategory.DIAPER_PACK]: 'Presente',
};

const statusLabel: Record<GiftStatus, string> = {
  [GiftStatus.AVAILABLE]: 'Não reservado',
  [GiftStatus.CLAIMED]: 'Presenteado, obrigado!',
  [GiftStatus.FULFILLED]: 'Completo, obrigado!',
};

function GiftThumbnail({ item, onOpen }: { item: GiftItem; onOpen: () => void }) {
  if (!item.imageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary-50 text-3xl text-primary-300">
        🎁
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ver foto de ${item.name} em tamanho grande`}
      className="relative block h-full w-full cursor-zoom-in"
    >
      <Image
        src={item.imageUrl}
        alt={item.name}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
    </button>
  );
}

export function GiftCard({ item }: GiftCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-3">
      <div className="relative -m-6 mb-0 aspect-square overflow-hidden rounded-t-2xl">
        <GiftThumbnail item={item} onOpen={() => setIsLightboxOpen(true)} />
        <Badge className="absolute top-3 left-3 shadow-card">{categoryLabel[item.category]}</Badge>
      </div>

      <div className="flex items-start justify-between gap-3 pt-1">
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

      <p className="font-body text-sm font-semibold text-primary-700">{statusLabel[item.status]}</p>

      {isLightboxOpen && item.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-lg text-primary-700"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- overlay de tamanho variável, sem necessidade de otimização do next/image */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="max-h-full max-w-full rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </Card>
  );
}
