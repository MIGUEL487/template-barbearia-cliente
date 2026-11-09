import {parseProfile} from '../src/lib/regional/profile';
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const url=new URL(request.url);
  if(url.pathname!=='/__openpage/region')return env.ASSETS.fetch(request);
  if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
  if(!env.OPENPAGE_TENANT_SLUG)return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});
  try{
   const slug=env.OPENPAGE_TENANT_SLUG;
   if(!/^[a-z0-9][a-z0-9_-]{1,100}$/.test(slug))throw new Error('Invalid slug');
   const api=new URL(env.OPENPAGE_API_URL),site=new URL(env.OPENPAGE_SITE_ORIGIN);
   if(api.protocol!=='https:'||api.username||api.password||site.protocol!=='https:'||url.origin!==site.origin)throw new Error('Invalid configured origin');
   const response=await fetch(new URL(`/api/public/sites/${encodeURIComponent(slug)}/region`,api),{redirect:'manual',signal:AbortSignal.timeout(5000),headers:{Accept:'application/json'}});
   if(!response.ok||Number(response.headers.get('content-length'))>16384)throw new Error('Profile unavailable');
   // Bound even a chunked response before parsing.
   const reader=response.body?.getReader();if(!reader)throw new Error('Empty profile');
   const chunks:Uint8Array[]=[];let size=0;
   for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();throw new Error('Profile too large');}chunks.push(value);}
   const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
   const profile=parseProfile(JSON.parse(new TextDecoder().decode(bytes)),slug,site.origin);
   if(profile.currency!==env.OPENPAGE_CATALOG_CURRENCY||profile.timezone!==env.OPENPAGE_BOOKING_TIMEZONE)throw new Error('Catalog/backend regional unit mismatch');
   return Response.json(profile,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  }catch{
   console.error(JSON.stringify({event:'regional_profile_unavailable'}));
   return Response.json({error:'Regional configuration unavailable',configured:true},{status:503,headers:{'Cache-Control':'no-store'}});
  }
 }
} satisfies ExportedHandler<Env>;
