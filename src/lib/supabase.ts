import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const DEFAULT_BARBERSHOP_ID = "11111111-1111-1111-1111-111111111111";

export function getMissingClientEnvVars(): string[] {
  const missing: string[] = [];
  if (!supabaseUrl || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(supabaseUrl)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(process.env.NEXT_PUBLIC_BARBERSHOP_ID || "")) missing.push("NEXT_PUBLIC_BARBERSHOP_ID");
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
