import { RsvpForm } from '@/components/forms/rsvp-form';
import { SectionContainer } from '@/components/ui/SectionContainer';

export function RsvpSection() {
  return (
    <SectionContainer
      id="presenca"
      title="Confirme sua presença"
      subtitle="Sua presença tornará esse dia ainda mais especial!"
    >
      <RsvpForm />
    </SectionContainer>
  );
}
