import { Card } from '@/components/ui/Card';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { guestbookMessages } from '@/data/keepsake-data';

export function GuestbookSection() {
  const messages = guestbookMessages;

  return (
    <SectionContainer
      id="mensagens"
      title="Mensagens para o Davi"
      subtitle="O carinho de quem celebrou esse dia com a gente."
    >
      {messages.length > 0 && (
        <div className="mt-10 grid w-full gap-4 md:grid-cols-2">
          {messages.map((message) => (
            <Card key={message.id}>
              <p className="font-body text-ink">{message.message}</p>
              <p className="mt-2 font-body text-xs font-semibold uppercase tracking-wide text-primary-600">
                {message.guestName}
              </p>
            </Card>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
