import { listGalleryPhotos } from '@/application/use-cases/list-gallery-photos.use-case';
import { GalleryCarousel } from '@/components/sections/gallery-carousel';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { createPublishableServerClient } from '@/infrastructure/supabase/publishable-server-client';
import { SupabaseGalleryRepository } from '@/infrastructure/supabase/gallery-repository.supabase';

export async function GallerySection() {
  const repository = new SupabaseGalleryRepository(createPublishableServerClient());
  const photos = await listGalleryPhotos(repository);

  if (photos.length === 0) {
    return null;
  }

  return (
    <SectionContainer id="galeria" title="Um ano de aventuras">
      <GalleryCarousel photos={photos} />
    </SectionContainer>
  );
}
