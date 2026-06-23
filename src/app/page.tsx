import { FooterSection } from '@/components/sections/footer-section';
import { GallerySection } from '@/components/sections/gallery-section';
import { GiftRegistrySection } from '@/components/sections/gift-registry-section';
import { GuestbookSection } from '@/components/sections/guestbook-section';
import { HeroSection } from '@/components/sections/hero-section';
import { InfoCardsSection } from '@/components/sections/info-cards-section';
import { NavBar } from '@/components/sections/nav-bar';
import { RsvpSection } from '@/components/sections/rsvp-section';

// gift_items, rsvps e guestbook_messages precisam de dado fresco por
// request (CLAUDE.md) — sem isso o Next prerenderiza "/" como página
// estática e a Vercel serve o HTML do build pra todo mundo.
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <InfoCardsSection />
        <RsvpSection />
        <GiftRegistrySection />
        <GallerySection />
        <GuestbookSection />
        <FooterSection />
      </main>
    </>
  );
}
