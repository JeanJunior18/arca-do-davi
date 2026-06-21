import { AdminPhotoForm } from '@/components/forms/admin-photo-form';
import { SectionContainer } from '@/components/ui/SectionContainer';

export default function AdminPhotosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionContainer title="Adicionar foto" subtitle="Cadastra uma nova foto na galeria do Davi.">
        <AdminPhotoForm />
      </SectionContainer>
    </main>
  );
}
