import {writeFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Somente views públicas; sem service_role, escrita remota ou PII.
let snapshot={services:[],barbers:[]};
if(url&&key&&process.env.NEXT_PUBLIC_DEMO_MODE!=='true'){
 const db=createClient(url,key),id=process.env.NEXT_PUBLIC_BARBERSHOP_ID;
 if(!id)throw new Error('NEXT_PUBLIC_BARBERSHOP_ID obrigatório para snapshot');
 const [s,b]=await Promise.all([db.from('public_services').select('id,name,description,duration_minutes,price').eq('barbershop_id',id),db.from('public_barbers').select('id,name,bio,avatar_url').eq('barbershop_id',id)]);
 if(s.error||b.error)throw new Error('Falha ao carregar snapshot público');
 snapshot={services:s.data,barbers:b.data};
}
await writeFile('src/config/snapshot.json',JSON.stringify(snapshot));
