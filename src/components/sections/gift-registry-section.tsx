import Image from 'next/image';

import { CopyPixKey } from '@/components/gift/copy-pix-key';
import { GiftGallery } from '@/components/gift/gift-gallery';
import { Card } from '@/components/ui/Card';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { eventConfig } from '@/config/event.config';
import { giftItems } from '@/data/keepsake-data';

export function GiftRegistrySection() {
  const allItems = giftItems;

  return (
    <SectionContainer
      id="presentes"
      title="Lista de presentes"
      subtitle="O carinho de quem lembrou do Davi nesse dia."
    >
      <p className="mb-8 max-w-xl text-center font-body text-sm italic text-ink-soft">
        Registro de como ficou a lista de presentes do Davi depois da festa.
      </p>

      <div className="flex w-full flex-col gap-8">
        <Card whimsyAccent className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-display text-lg text-primary-700">Pix presente</h3>
          <p className="font-body text-sm text-ink-soft">Contribua com qualquer valor.</p>
          <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-primary-100/60 bg-white">
            <Image
              src={eventConfig.pix.qrCodeImageUrl}
              alt="QR code Pix"
              fill
              className="object-contain p-2"
              sizes="160px"
            />
          </div>
          <CopyPixKey pixKey={eventConfig.pix.key} />
        </Card>

        {allItems.length > 0 && <GiftGallery items={allItems} />}
      </div>
    </SectionContainer>
  );
}
