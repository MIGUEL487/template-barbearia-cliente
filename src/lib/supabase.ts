import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const DEFAULT_BARBERSHOP_ID = "11111111-1111-1111-1111-111111111111";

export function getMissingClientEnvVars(): string[] {
  const missing: string[] = [];
  if (!supabaseUrl || supabaseUrl.trim() === "" || supabaseUrl.includes("dummy")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseAnonKey || supabaseAnonKey.trim() === "" || supabaseAnonKey.includes("dummy")) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return missing;
}

export function getBarbershopId(): string {
  return process.env.NEXT_PUBLIC_BARBERSHOP_ID || DEFAULT_BARBERSHOP_ID;
}

// Inicializa cliente Supabase
export const supabase = createClient(
  supabaseUrl || "https://unconfigured-project.supabase.co",
  supabaseAnonKey || "unconfigured-key"
);
