import { createClient } from '@supabase/supabase-js';

export function createPublishableServerClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
}
