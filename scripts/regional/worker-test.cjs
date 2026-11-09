const {Miniflare,convertV4MiniflareOptions}=require('miniflare'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const bundle=`/tmp/openpage-regional-worker-test-${process.pid}.js`;require('esbuild').buildSync({entryPoints:['worker/regional.ts'],bundle:true,format:'esm',outfile:bundle});
 const profile={version:1,slug:'fixture-shop',name:'Fixture',locale:'en',currency:'USD',timezone:'America/New_York',palette:{primary:'#49352b'},websiteOrigin:'https://customer.test'};
 let requests=0;const options={modules:true,compatibilityDate:'2026-10-26',script:fs.readFileSync(bundle,'utf8'),bindings:{OPENPAGE_TENANT_SLUG:'fixture-shop',OPENPAGE_API_URL:'https://openheimer.vercel.app',OPENPAGE_SITE_ORIGIN:'https://customer.test',OPENPAGE_CATALOG_CURRENCY:'USD',OPENPAGE_BOOKING_TIMEZONE:'America/New_York'},outboundService:async request=>{requests++;assert.equal(new URL(request.url).pathname,'/api/public/sites/fixture-shop/region');assert.equal(request.headers.get('cookie'),null);assert.equal(request.headers.get('authorization'),null);return Response.json(profile);},serviceBindings:{ASSETS:()=>new Response('asset')}};
 const worker=new Miniflare(convertV4MiniflareOptions(options));
 try{let response=await worker.dispatchFetch('https://customer.test/__openpage/region');assert.equal(response.status,200);assert.equal((await response.json()).currency,'USD');assert.equal(requests,1);
 response=await worker.dispatchFetch('https://wrong.test/__openpage/region');assert.equal(response.status,503);assert.equal(requests,1);
 response=await worker.dispatchFetch('https://customer.test/__openpage/region',{method:'POST'});assert.equal(response.status,405);
 await worker.setOptions(convertV4MiniflareOptions({...options,bindings:{...options.bindings,OPENPAGE_CATALOG_CURRENCY:'BRL'}}));response=await worker.dispatchFetch('https://customer.test/__openpage/region');assert.equal(response.status,503);
 await worker.setOptions(convertV4MiniflareOptions({...options,bindings:{...options.bindings,OPENPAGE_TENANT_SLUG:''}}));response=await worker.dispatchFetch('https://customer.test/__openpage/region');assert.equal(response.status,204);
 response=await worker.dispatchFetch('https://customer.test/');assert.equal(await response.text(),'asset');
 console.log('Worker runtime: regional proxy, origin pinning, no credential forwarding, currency mismatch, disabled integration and asset passthrough passed.');
 }finally{await worker.dispose();fs.unlinkSync(bundle);}
})().catch(e=>{console.error(e);process.exit(1);});
