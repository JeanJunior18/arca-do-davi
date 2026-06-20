import { eventConfig } from '@/config/event.config';

export function FooterSection() {
  return (
    <footer className="w-full bg-primary-700 px-6 py-10 text-center">
      <p className="mx-auto max-w-md font-script text-2xl text-accent-foreground italic">
        “{eventConfig.bibleVerse.text}”
      </p>
      <p className="mt-2 font-body text-xs font-semibold uppercase tracking-wide text-primary-100">
        {eventConfig.bibleVerse.reference}
      </p>
      <p className="mt-6 font-body text-xs text-primary-200">
        Com amor, pela chegada de {eventConfig.childName} 💚
      </p>
    </footer>
  );
}
