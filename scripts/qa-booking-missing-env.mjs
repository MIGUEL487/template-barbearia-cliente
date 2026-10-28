// Executar após build DEMO_MODE=false sem credenciais Supabase.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try {
 const p=await b.newPage();let requests=0;
 p.on('request',r=>{if(r.url().includes('supabase.co'))requests++});
 await p.goto('http://localhost:8787/agendar?debug=1');
 await p.getByText('O agendamento está temporariamente indisponível. Fale com a barbearia.').waitFor();
 const debug=await p.getByRole('complementary',{name:'Diagnóstico de agendamento'}).innerText();
 assert.match(debug,/Simulação: não/);assert.match(debug,/NEXT_PUBLIC_SUPABASE_URL/);assert.match(debug,/NEXT_PUBLIC_SUPABASE_ANON_KEY/);assert.match(debug,/NEXT_PUBLIC_BARBERSHOP_ID/);
 assert.equal(await p.getByText('Com quem você quer cortar? Equipe de exemplo.').count(),0);assert.equal(requests,0);
 await p.goto('http://localhost:8787/agendar');await p.waitForTimeout(500);
 assert.equal(await p.getByRole('complementary',{name:'Diagnóstico de agendamento'}).count(),0);
 console.log('Missing configuration stays live, shows friendly error, makes no requests, debug hidden without query.');
} finally {await b.close()}
