import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getMissingClientEnvVars(): string[] {
  const missing: string[] = [];
  if (!supabaseUrl || supabaseUrl.trim() === "" || supabaseUrl.includes("dummy")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseAnonKey || supabaseAnonKey.trim() === "" || supabaseAnonKey.includes("dummy")) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (!process.env.NEXT_PUBLIC_BARBERSHOP_ID || process.env.NEXT_PUBLIC_BARBERSHOP_ID.trim() === "") {
    missing.push("NEXT_PUBLIC_BARBERSHOP_ID");
  }
  return missing;
}

export function getBarbershopId(): string {
  const id = process.env.NEXT_PUBLIC_BARBERSHOP_ID;
  if (!id) {
    throw new Error(
      "NEXT_PUBLIC_BARBERSHOP_ID não configurada no .env.local. Cada instalação de barbearia deve especificar o ID do tenant."
    );
  }
  return id;
}

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    console.error("FATAL: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.");
  }
}

// Inicializa cliente Supabase
export const supabase = createClient(
  supabaseUrl || "https://unconfigured-project.supabase.co",
  supabaseAnonKey || "unconfigured-key"
);
