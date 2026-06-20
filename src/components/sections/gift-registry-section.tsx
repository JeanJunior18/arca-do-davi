import { listGiftItems } from '@/application/use-cases/list-gift-items.use-case';
import { GiftGallery } from '@/components/gift/gift-gallery';
import { Card } from '@/components/ui/Card';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { eventConfig } from '@/config/event.config';
import { createPublishableServerClient } from '@/infrastructure/supabase/publishable-server-client';
import { SupabaseGiftRepository } from '@/infrastructure/supabase/gift-repository.supabase';

export async function GiftRegistrySection() {
  const repository = new SupabaseGiftRepository(createPublishableServerClient());
  const { registryItems, diaperPacks } = await listGiftItems(repository);
  const allItems = [...registryItems, ...diaperPacks];

  return (
    <SectionContainer
      id="presentes"
      title="Lista de presentes"
      subtitle="O melhor presente é ter você conosco! Mas, se quiser nos presentear, escolha como preferir:"
    >
      <p className="mb-8 max-w-xl text-center font-body text-sm italic text-ink-soft">
        Os itens abaixo são só sugestões — fique livre pra reservar e comprar pelo link, ou
        presentear como preferir. Nenhuma obrigação, é só pra ajudar quem quiser dar uma ideia
        do que falta. Priorizamos brinquedos pedagógicos e educativos, que ajudam no
        desenvolvimento do Davi.
      </p>

      <div className="flex w-full flex-col gap-8">
        <Card whimsyAccent className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-display text-lg text-primary-700">Pix presente</h3>
          <p className="font-body text-sm text-ink-soft">Contribua com qualquer valor.</p>
          <p className="rounded-full bg-primary-50 px-4 py-2 font-body text-sm font-semibold text-primary-700">
            {eventConfig.pix.key}
          </p>
        </Card>

        {allItems.length > 0 && <GiftGallery items={allItems} />}
      </div>
    </SectionContainer>
  );
}
