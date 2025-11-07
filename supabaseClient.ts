// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get values from app.json extra
const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

// Throw error if missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '⚠️ Supabase URL or ANON KEY is missing! Make sure app.json "extra" contains SUPABASE_URL and SUPABASE_ANON_KEY'
  );
}

// Export the client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
