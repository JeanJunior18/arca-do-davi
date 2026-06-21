import { AdminGiftForm } from '@/components/forms/admin-gift-form';
import { SectionContainer } from '@/components/ui/SectionContainer';

export default function AdminGiftsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionContainer title="Adicionar presente" subtitle="Cadastra um novo item na lista de presentes do Davi.">
        <AdminGiftForm />
      </SectionContainer>
    </main>
  );
}
