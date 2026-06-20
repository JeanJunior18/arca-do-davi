import { listGiftItems } from '@/application/use-cases/list-gift-items.use-case';
import { GiftCard } from '@/components/gift/gift-card';
import { Card } from '@/components/ui/Card';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { eventConfig } from '@/config/event.config';
import { createPublishableServerClient } from '@/infrastructure/supabase/publishable-server-client';
import { SupabaseGiftRepository } from '@/infrastructure/supabase/gift-repository.supabase';

export async function GiftRegistrySection() {
  const repository = new SupabaseGiftRepository(createPublishableServerClient());
  const { registryItems, diaperPacks } = await listGiftItems(repository);

  return (
    <SectionContainer
      id="presentes"
      title="Lista de presentes"
      subtitle="O melhor presente é ter você conosco! Mas, se quiser nos presentear, escolha como preferir:"
    >
      <div className="grid w-full gap-8">
        {registryItems.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registryItems.map((item) => (
              <GiftCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <Card whimsyAccent className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-display text-lg text-primary-700">Pix presente</h3>
          <p className="font-body text-sm text-ink-soft">Contribua com qualquer valor.</p>
          <p className="rounded-full bg-primary-50 px-4 py-2 font-body text-sm font-semibold text-primary-700">
            {eventConfig.pix.key}
          </p>
        </Card>

        {diaperPacks.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diaperPacks.map((item) => (
              <GiftCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
