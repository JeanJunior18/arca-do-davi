import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event.config';

function formatEventDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

const infoItems = [
  { label: 'Data', value: formatEventDate(eventConfig.eventDate) },
  { label: 'Horário', value: `${eventConfig.eventTime}h` },
  { label: 'Local', value: `${eventConfig.venueName}\n${eventConfig.venueAddress}` },
];

export function InfoCardsSection() {
  return (
    <section id="como-chegar" className="w-full px-6 py-10">
      <Card className="mx-auto flex max-w-xl flex-col gap-6 md:max-w-4xl md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-col gap-5 md:flex-row md:gap-10">
          {infoItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="font-body text-xs font-semibold uppercase tracking-wide text-primary-600">
                {item.label}
              </span>
              <span className="whitespace-pre-line font-body text-ink">{item.value}</span>
            </div>
          ))}
        </div>

        <a
          href={eventConfig.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-accent-foreground shadow-card transition-colors hover:bg-primary-700"
        >
          Ver localização
        </a>
      </Card>
    </section>
  );
}
