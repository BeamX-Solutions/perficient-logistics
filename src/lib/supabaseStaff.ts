import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Staff sign in at /admin/events, so unlike the public client this one keeps its session,
// under its own storage key so it never touches the public, session-less client.
export const staffSupabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: 'ps-staff-auth' },
      })
    : null;
