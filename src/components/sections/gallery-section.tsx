import { GalleryCarousel } from '@/components/sections/gallery-carousel';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { galleryPhotos } from '@/data/keepsake-data';

export function GallerySection() {
  const photos = [...galleryPhotos].sort((a, b) => a.displayOrder - b.displayOrder);

  if (photos.length === 0) {
    return null;
  }

  return (
    <SectionContainer id="galeria" title="Um ano de aventuras">
      <GalleryCarousel photos={photos} />
    </SectionContainer>
  );
}
