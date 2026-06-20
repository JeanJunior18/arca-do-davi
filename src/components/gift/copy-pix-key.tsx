'use client';

import { useState } from 'react';

export interface CopyPixKeyProps {
  pixKey: string;
}

function CopyIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

// navigator.clipboard só existe em contexto seguro (https ou localhost) — ao
// acessar por http://IP-da-rede (testando em outro dispositivo), o navegador
// nem expõe a API. Esse fallback com textarea + execCommand cobre esse caso.
function copyWithFallback(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const succeeded = document.execCommand('copy');
  document.body.removeChild(textarea);
  return succeeded;
}

export function CopyPixKey({ pixKey }: CopyPixKeyProps) {
  const [feedback, setFeedback] = useState<'copied' | 'failed' | null>(null);

  async function handleCopy() {
    let succeeded = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(pixKey);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    if (!succeeded) {
      succeeded = copyWithFallback(pixKey);
    }

    setFeedback(succeeded ? 'copied' : 'failed');
    setTimeout(() => setFeedback(null), 1800);
  }

  const showTooltip = feedback !== null;

  return (
    <div className="relative inline-flex">
      <span
        role="status"
        aria-hidden={!showTooltip}
        className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 font-body text-xs font-semibold text-accent-foreground shadow-card transition-all duration-200 ${
          feedback === 'failed' ? 'bg-secondary-700' : 'bg-primary-700'
        } ${showTooltip ? 'opacity-100' : 'pointer-events-none translate-y-1 opacity-0'}`}
      >
        {feedback === 'failed' ? 'Não copiou, seleciona manualmente' : 'Copiado!'}
        <span
          className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
            feedback === 'failed' ? 'border-t-secondary-700' : 'border-t-primary-700'
          }`}
        />
      </span>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 font-body text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
      >
        {pixKey}
        <CopyIcon />
      </button>
    </div>
  );
}
