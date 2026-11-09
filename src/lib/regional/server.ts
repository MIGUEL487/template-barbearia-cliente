import 'server-only';
import {cache} from 'react';
import {defaultRegion,parseProfile} from './profile';
/** Optional server-to-server integration. Never imports OpenPage database or auth credentials. */
export const getRegionalProfile=cache(async()=>{
 const slug=process.env.OPENPAGE_TENANT_SLUG;
 if(!slug)return defaultRegion;
 if(!/^[a-z0-9][a-z0-9_-]{1,100}$/.test(slug))throw new Error('Invalid OpenPage tenant slug');
 const endpoint=new URL(process.env.OPENPAGE_API_URL||'https://openheimer.vercel.app');
 const website=new URL(process.env.NEXT_PUBLIC_SITE_URL||'');
 if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password||website.protocol!=='https:')throw new Error('Regional integration requires HTTPS origins');
 const response=await fetch(new URL(`/api/public/sites/${encodeURIComponent(slug)}/region`,endpoint),{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw new Error(`Regional integration unavailable (${response.status})`);
 const profile=parseProfile(await response.json(),slug,website.origin);
 // Existing Supabase prices have no currency column. Explicitly confirm their unit before changing labels.
 if(profile.currency!==(process.env.OPENPAGE_CATALOG_CURRENCY||'BRL'))throw new Error('Catalog currency differs from OpenPage. Review prices before enabling the integration.');
 if(profile.timezone!==(process.env.OPENPAGE_BOOKING_TIMEZONE||'America/Sao_Paulo'))throw new Error('Booking backend timezone differs from OpenPage. Align the backend before enabling integration.');
 return profile;
});
