import { createClient } from '@supabase/supabase-js';

// Read from Vite env at build/runtime
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Single shared client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
