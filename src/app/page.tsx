import { FooterSection } from '@/components/sections/footer-section';
import { GallerySection } from '@/components/sections/gallery-section';
import { GiftRegistrySection } from '@/components/sections/gift-registry-section';
import { GuestbookSection } from '@/components/sections/guestbook-section';
import { HeroSection } from '@/components/sections/hero-section';
import { InfoCardsSection } from '@/components/sections/info-cards-section';
import { NavBar } from '@/components/sections/nav-bar';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <InfoCardsSection />
        <GiftRegistrySection />
        <GallerySection />
        <GuestbookSection />
        <FooterSection />
      </main>
    </>
  );
}
