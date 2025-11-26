const URL_FROM_ENV = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY_FROM_ENV = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasEnvVars = !!URL_FROM_ENV && !!KEY_FROM_ENV;

export const SUPABASE_URL = URL_FROM_ENV as string;
export const SUPABASE_ANON_KEY = KEY_FROM_ENV as string;