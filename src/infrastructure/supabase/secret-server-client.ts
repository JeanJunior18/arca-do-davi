// Usar SOMENTE dentro de app/internal/guest-log/. Esse client ignora RLS.
import { createClient } from '@supabase/supabase-js';

export function createSecretServerClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}
