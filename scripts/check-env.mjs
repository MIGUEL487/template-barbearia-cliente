import http from "node:https";

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_BARBERSHOP_ID",
];

console.log("\n==========================================");
console.log(" VERIFICAÇÃO DE AMBIENTE: CLIENTE");
console.log("==========================================\n");

let hasError = false;

for (const key of requiredVars) {
  const val = process.env[key];
  if (!val || val.includes("dummy") || val.includes("SEU_") || val.trim() === "") {
    console.error(`❌ [ERRO] ${key} não configurada ou com valor inválido.`);
    hasError = true;
  } else {
    console.log(`✅ [OK]   ${key}`);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl && !supabaseUrl.includes("dummy")) {
  try {
    const url = new URL(supabaseUrl);
    console.log(`\nTestando conectividade com ${url.origin}...`);
    const req = http.get(`${url.origin}/auth/v1/health`, (res) => {
      console.log(`✅ [OK]   Conexão com Supabase respondendo (Status: ${res.statusCode})`);
      process.exit(hasError ? 1 : 0);
    });
    req.on("error", (err) => {
      console.error(`❌ [ERRO] Falha ao conectar ao Supabase: ${err.message}`);
      process.exit(1);
    });
  } catch (e) {
    console.error(`❌ [ERRO] URL inválida: ${supabaseUrl}`);
    process.exit(1);
  }
} else {
  console.log("\n⚠️  Supabase URL não definida ou em fallback. Configure o .env.local para testar a conexão.");
  process.exit(hasError ? 1 : 0);
}
