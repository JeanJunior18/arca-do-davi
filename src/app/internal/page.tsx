import Link from 'next/link';

import { Card } from '@/components/ui/Card';
import { SectionContainer } from '@/components/ui/SectionContainer';

const screens = [
  { href: '/internal/gifts', title: 'Presentes', description: 'Adicionar item na lista de presentes.' },
  { href: '/internal/photos', title: 'Fotos', description: 'Adicionar foto na galeria do Davi.' },
];

export default function InternalIndexPage() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionContainer title="Área interna" subtitle="Escolha o que você quer gerenciar.">
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          {screens.map((screen) => (
            <Link key={screen.href} href={screen.href}>
              <Card className="h-full transition-shadow hover:shadow-card-hover">
                <h3 className="font-display text-lg text-primary-700">{screen.title}</h3>
                <p className="mt-1 font-body text-sm text-ink-soft">{screen.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
}
