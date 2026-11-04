# MAPA DO CÓDIGO — REDESIGN V3

Gerado automaticamente via buscas git grep na raiz do repositório.

## 1. fique à vontade / entre
```
docs/qa/design-inspection.json:356:      "text": "Entre. Fique à vontade.",
docs/qa/design-inspection.json:1095:       "text": "Entre.",
docs/qa/design-inspection.json:1646:      "text": "Entre. Fique à vontade.",
docs/qa/design-inspection.json:2280:       "text": "Entre.",
docs/qa/design-inspection.json:2838:      "text": "Entre. Fique à vontade.",
src/components/landing/sections.tsx:46:              Entre. Fique à <span className="headline-italic">vontade.</span>
```

## 2. ateliê monte sião / precisão e acabamento
```
Nenhuma ocorrência encontrada.
```

## 3. carregar mapa
```
scripts/qa-white-functional.mjs:5:await p.locator('#servicos').scrollIntoViewIfNeeded();await p.getByRole('button',{name:'Combos',exact:true}).click();await p.waitForFunction(()=>document.querySelectorAll('.service-item').length===1);await p.locator('.service-row').click();await p.getByRole('link',{name:'Agendar este serviço'}).click();await p.getByRole('button',{name:'Continuar',exact:true}).click();assert(await p.getByLabel(/Corte \+ barba/).isChecked());await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.getByLabel('Data',{exact:true}).fill('2026-12-15');await p.getByRole('button',{name:'14:00',exact:true}).click();await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Concluir simulação'}).click();await p.getByRole('heading',{name:'Tudo certo na simulação.'}).waitFor();await p.getByRole('link',{name:'Ver agendamento de exemplo'}).click();await p.getByRole('button',{name:'Cancelar exemplo',exact:true}).click();await p.getByRole('button',{name:'Confirmar simulação'}).click();await p.getByRole('heading',{name:'Cancelamento simulado'}).waitFor();assert.equal(remote,0);await p.goto('http://127.0.0.1:8787/?motion=off');await p.waitForLoadState('networkidle');await p.waitForTimeout(350);assert.equal(await p.locator('iframe').count(),0);await p.getByRole('button',{name:'Carregar mapa'}).click();assert.equal(await p.locator('iframe').count(),1);await p.getByRole('button',{name:'Animações: reduzidas'}).click();await p.waitForFunction(()=>localStorage.getItem('auto-stilo-motion')==='on');await p.screenshot({path:`./docs/design-branco/depois/controle-${width}.jpg`,type:'jpeg'});results.push({width,booking:true,cancel:true,filter:true,preselect:true,mapOnDemand:true,motionToggle:true,remote});await fs.writeFile('./docs/design-branco/functional.json',JSON.stringify(results,null,2));await c.close();}
src/components/landing/contact-map.tsx:3:export function ContactMap(){const [open,setOpen]=useState(false);return <div className="contact-map">{open?<iframe title="Localização da Barbearia Auto Stilo" src="https://www.google.com/maps?q=Rua+do+Tanque+395+Monte+Siao+MG&output=embed" referrerPolicy="no-referrer"/>:<button type="button" className="cta" onClick={()=>setOpen(true)}>Carregar mapa</button>}</div>}
```

## 4. maps / google / iframe
```
src/components/landing/contact-map.tsx:3:export function ContactMap(){const [open,setOpen]=useState(false);return <div className="contact-map">{open?<iframe title="Localização da Barbearia Auto Stilo" src="https://www.google.com/maps?q=Rua+do+Tanque+395+Monte+Siao+MG&output=embed" referrerPolicy="no-referrer"/>:<button type="button" className="cta" onClick={()=>setOpen(true)}>Carregar mapa</button>}</div>}
src/components/landing/sections.tsx:188:                  href="https://www.google.com/maps/search/?api=1&query=Barbearia+Auto+Stilo+Monte+Si%C3%A3o"
```

## 5. video elements
```
.gitignore:42:*.webm
docs/FOTOS-NECESSARIAS.md:13:| Vídeo “Uma visita à Auto Stilo” | `visita.mp4` e seu poster exclusivo | 0 |
docs/FOTOS-NECESSARIAS.md:14:| Vídeo “O cuidado durante o atendimento” | `em-atendimento.mp4` e seu poster exclusivo | 0 |
docs/bugs-visuais/antes/results.json:86:        "src": "http://127.0.0.1:8790/media/auto-stilo/visita.mp4",
docs/bugs-visuais/antes/results.json:97:        "src": "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/antes/results.json:215:          "src": "http://127.0.0.1:8790/media/auto-stilo/visita.mp4",
docs/bugs-visuais/antes/results.json:217:            "http://127.0.0.1:8790/media/auto-stilo/visita.mp4"
docs/bugs-visuais/antes/results.json:222:          "src": "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/antes/results.json:224:            "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4"
docs/bugs-visuais/antes/results.json:359:        "src": "http://127.0.0.1:8790/media/auto-stilo/visita.mp4",
docs/bugs-visuais/antes/results.json:370:        "src": "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/antes/results.json:488:          "src": "http://127.0.0.1:8790/media/auto-stilo/visita.mp4",
docs/bugs-visuais/antes/results.json:490:            "http://127.0.0.1:8790/media/auto-stilo/visita.mp4"
docs/bugs-visuais/antes/results.json:495:          "src": "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/antes/results.json:497:            "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4"
docs/bugs-visuais/antes/results.json:632:        "src": "http://127.0.0.1:8790/media/auto-stilo/visita.mp4",
docs/bugs-visuais/antes/results.json:643:        "src": "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/antes/results.json:761:          "src": "http://127.0.0.1:8790/media/auto-stilo/visita.mp4",
docs/bugs-visuais/antes/results.json:763:            "http://127.0.0.1:8790/media/auto-stilo/visita.mp4"
docs/bugs-visuais/antes/results.json:768:          "src": "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/antes/results.json:770:            "http://127.0.0.1:8790/media/auto-stilo/em-atendimento.mp4"
docs/bugs-visuais/depois/results.json:78:        "src": "http://127.0.0.1:8787/media/auto-stilo/visita.mp4",
docs/bugs-visuais/depois/results.json:89:        "src": "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/depois/results.json:159:          "src": "http://127.0.0.1:8787/media/auto-stilo/visita.mp4",
docs/bugs-visuais/depois/results.json:161:            "http://127.0.0.1:8787/media/auto-stilo/visita.mp4"
docs/bugs-visuais/depois/results.json:166:          "src": "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/depois/results.json:168:            "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4"
docs/bugs-visuais/depois/results.json:324:        "src": "http://127.0.0.1:8787/media/auto-stilo/visita.mp4",
docs/bugs-visuais/depois/results.json:335:        "src": "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/depois/results.json:405:          "src": "http://127.0.0.1:8787/media/auto-stilo/visita.mp4",
docs/bugs-visuais/depois/results.json:407:            "http://127.0.0.1:8787/media/auto-stilo/visita.mp4"
docs/bugs-visuais/depois/results.json:412:          "src": "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/depois/results.json:414:            "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4"
docs/bugs-visuais/depois/results.json:570:        "src": "http://127.0.0.1:8787/media/auto-stilo/visita.mp4",
docs/bugs-visuais/depois/results.json:581:        "src": "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/depois/results.json:651:          "src": "http://127.0.0.1:8787/media/auto-stilo/visita.mp4",
docs/bugs-visuais/depois/results.json:653:            "http://127.0.0.1:8787/media/auto-stilo/visita.mp4"
docs/bugs-visuais/depois/results.json:658:          "src": "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4",
docs/bugs-visuais/depois/results.json:660:            "http://127.0.0.1:8787/media/auto-stilo/em-atendimento.mp4"
docs/design-branco/cloudflare-assets.json:7:  "largestAsset": "video/pc-gsap-reverse.mp4",
docs/desktop-video-assets.json:2:  "pc-gsap.mp4": {
docs/desktop-video-assets.json:9:  "pc-gsap-reverse.mp4": {
docs/redesign/00-auditoria.md:132:  - `em-atendimento.mp4` (848 KB): Vídeo real curto do atendimento.
docs/redesign/00-auditoria.md:136:- `public/video/pc.mp4` e `mobile.mp4`: Vídeos externos genéricos de demonstração.
docs/redesign/00-auditoria.md:137:- Imagens e referências do arquivo `Auto_Stilo_Claude_Referencias.zip` (`video-referencia-lovable.webm`, frames `f01` a `f24`): pertencem a outra barbearia fictícia ("Mr. Mustache"). **Proibido reutilizar.**
docs/redesign/01-referencia.md:3:**Arquivo de Referência:** `referencias/video-referencia-lovable.webm` (95.55s, 1920x922, 24 frames em `referencias/frames/`)  
docs/redesign/evidencias/01-referencia/video-test.html:5:      <video id="vid" src="/video-referencia-lovable.webm" controls style="width:100%;height:auto;"></video>
docs/video-assets.json:2:  "mobile.mp4": {
docs/video-assets.json:9:  "mobile-reverse.mp4": {
docs/video-assets.json:16:  "pc.mp4": {
docs/video-assets.json:23:  "pc-reverse.mp4": {
scripts/analyze-frames.py:35:    out.write("ANÁLISE DE FRAMES DA REFERÊNCIA (video-referencia-lovable.webm)\n")
scripts/capture-baseline-screenshots.mjs:22:    '.mp4': 'video/mp4',
scripts/capture-hero-sculpture.mjs:22:    '.mp4': 'video/mp4',
scripts/compare-playwright.mjs:23:    '.mp4': 'video/mp4'
scripts/encode-hero-video.mjs:15:   const name=`${key}${desktop?'-gsap':''}${reverse?'-reverse':''}.mp4`,out=`public/video/${name}`;
scripts/inspect-video-and-frames.mjs:19:    '.webm': 'video/webm',
scripts/qa-creative-experience.mjs:22:    '.mp4': 'video/mp4',
scripts/qa-media.mjs:17:  assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.mp4')).length),0);
scripts/qa-white-functional.mjs:8:const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await c.newPage();await p.route('**/*.mp4',r=>r.abort());await p.goto('http://127.0.0.1:8787/?renderer=video');await p.waitForFunction(()=>document.querySelector('.cinematic')?.dataset.renderer==='canvas-fallback');await p.evaluate(()=>document.querySelector('.cinematic canvas').dataset.identity='retained');await p.setViewportSize({width:844,height:390});assert.equal(await p.locator('.cinematic canvas').getAttribute('data-identity'),'retained');results.push({forcedVideoErrorFallback:true,rotationKeepsCanvas:true});await fs.writeFile('./docs/design-branco/functional.json',JSON.stringify(results,null,2));await c.close();
src/components/landing/shop-videos.tsx:8:  const ref = useRef<HTMLVideoElement>(null);
src/components/landing/shop-videos.tsx:49:      <video ref={ref} width="360" height="640" playsInline muted={muted} loop preload="none"
src/components/landing/shop-videos.tsx:52:        <source src={`/media/auto-stilo/${name}.mp4`} type="video/mp4" />
src/lib/cinematic/desktop-player.ts:30:  video.src=`/video/pc-gsap${direction<0?'-reverse':''}.mp4`;video.load()
src/lib/cinematic/desktop-player.ts:57: if(video.canPlayType('video/mp4; codecs="avc1.640028"')){video.src='/video/pc-gsap.mp4';video.load()}else void fail()
src/lib/cinematic/video-player.ts:16: const listen=(v:HTMLVideoElement,event:string,fn:()=>void)=>{v.addEventListener(event,fn);removers.push(()=>v.removeEventListener(event,fn))}
src/lib/cinematic/video-player.ts:35: function setSource(i:number){const v=videos[i]!;if(!v.getAttribute('src')){v.src=`/video/${key}${i?'-reverse':''}.mp4`;v.load()}}
```

## 6. three.js imports
```
Nenhuma ocorrência encontrada.
```

## 7. gsap / ScrollTrigger / lenis
```
docs/AUDIT.md
docs/CUSTOMIZE.md
docs/DEPLOY-CLOUDFLARE.md
docs/DESIGN.md
docs/LIVE-BOOKING-AUDIT.md
docs/REPORT.md
docs/animation-plan.md
docs/design-branco/cloudflare-assets.json
docs/design-branco/depois/inteiro-1440.jpg
docs/design-branco/functional.json
docs/desktop-video-assets.json
docs/redesign/00-auditoria.md
docs/redesign/evidencias/05-multi-section-3d/relatorio_trajetoria_3d.md
docs/redesign3d/00-auditoria.md
docs/redesign3d/RELATORIO.md
package-lock.json
package.json
scripts/encode-hero-video.mjs
scripts/inspect-reference-site.mjs
scripts/qa-anchors.mjs
scripts/qa-creative-experience.mjs
scripts/qa-redesign3d-full.mjs
scripts/record-scroll-demo.mjs
scripts/verify-production-creative.mjs
src/components/landing/editorial.tsx
src/components/landing/hero.tsx
src/components/landing/motion.tsx
src/components/smooth-scroll.tsx
src/components/three/brand-sculpture.tsx
src/components/three/global-3d-scene.tsx
src/lib/cinematic/desktop-player.ts
src/lib/cinematic/scroll-engine.ts
```

## 8. 3D Loaders and Materials
```
docs/redesign3d/00-auditoria.md:9:- `src/components/three/global-3d-scene.tsx`: Componente atualmente ativo e montado em `src/app/page.tsx`. Importa `three`, `OBJLoader`, `gsap` e `ScrollTrigger`.
docs/redesign3d/00-auditoria.md:15:- O modelo atual é carregado via `OBJLoader` a partir de `/models/hair-clipper/hair-clipper.obj`.
docs/redesign3d/00-auditoria.md:51:- **Material Atual:** `MeshStandardMaterial` único aplicado a toda a malha:
docs/redesign3d/02-modelo.md:18:O modelo original foi decomposto em 20 peças individuais através de grafo de conectividade de faces, mapeadas para 6 materiais `MeshPhysicalMaterial`:
docs/redesign3d/RELATORIO.md:29:4. **Shaders Físicos PBR (MeshPhysicalMaterial):**
scripts/export-glb-playwright.mjs:93:      const bodyMat = new THREE.MeshStandardMaterial({
scripts/export-glb-playwright.mjs:102:      const chromeMat = new THREE.MeshStandardMaterial({
scripts/export-glb-playwright.mjs:111:      const steelBladeMat = new THREE.MeshStandardMaterial({
scripts/export-glb-playwright.mjs:120:      const leverMat = new THREE.MeshStandardMaterial({
scripts/export-glb-playwright.mjs:129:      const screwMat = new THREE.MeshStandardMaterial({
scripts/export-glb-playwright.mjs:138:      const slatMat = new THREE.MeshStandardMaterial({
scripts/export-photoreal-glb.mjs:16:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/export-photoreal-glb.mjs:118:      const objLoader = new THREE.OBJLoader();
scripts/export-photoreal-glb.mjs:121:      const trimmerMat = new THREE.MeshStandardMaterial({
scripts/generate-approval-stills.mjs:21:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
scripts/generate-approval-stills.mjs:100:      const loader = new THREE.GLTFLoader();
scripts/generate-contrast-plates.mjs:145:      const plasticMat = new THREE.MeshStandardMaterial({
scripts/generate-contrast-plates.mjs:153:      const chromeMat = new THREE.MeshStandardMaterial({
scripts/generate-contrast-plates.mjs:161:      const steelBladeMat = new THREE.MeshStandardMaterial({
scripts/generate-contrast-plates.mjs:169:      const screwMat = new THREE.MeshStandardMaterial({
scripts/inspect-obj-model.mjs:4:import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
scripts/inspect-obj-model.mjs:9:console.log('--- Analisando Hair Trimmer.obj com OBJLoader ---');
scripts/inspect-obj-model.mjs:10:const loader = new OBJLoader();
scripts/render-colored-pieces.mjs:28:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/render-colored-pieces.mjs:134:        const mat = new THREE.MeshStandardMaterial({
scripts/render-texture-angles.mjs:13:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/render-texture-angles.mjs:67:      const objLoader = new THREE.OBJLoader();
scripts/render-texture-angles.mjs:97:          child.material = new THREE.MeshStandardMaterial({
scripts/reorient-and-export-model.mjs:97:// 3. Physical Materials (MeshPhysicalMaterial) for authentic studio realism
scripts/reorient-and-export-model.mjs:98:const bodyMat = new THREE.MeshPhysicalMaterial({
scripts/reorient-and-export-model.mjs:110:const chromeMat = new THREE.MeshPhysicalMaterial({
scripts/reorient-and-export-model.mjs:122:const steelBladeMat = new THREE.MeshPhysicalMaterial({
scripts/reorient-and-export-model.mjs:134:const leverMat = new THREE.MeshPhysicalMaterial({
scripts/reorient-and-export-model.mjs:145:const screwMat = new THREE.MeshPhysicalMaterial({
scripts/reorient-and-export-model.mjs:155:const slatMat = new THREE.MeshPhysicalMaterial({
scripts/test-black-atlas.mjs:13:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/test-black-atlas.mjs:67:      const objLoader = new THREE.OBJLoader();
scripts/test-black-atlas.mjs:78:          child.material = new THREE.MeshPhysicalMaterial({
scripts/test-creased-smooth.mjs:13:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/test-creased-smooth.mjs:156:      const objLoader = new THREE.OBJLoader();
scripts/test-creased-smooth.mjs:168:          child.material = new THREE.MeshPhysicalMaterial({
scripts/test-dae.mjs:74:          child.material = new THREE.MeshPhysicalMaterial({
scripts/test-native-obj-texture.mjs:13:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/test-native-obj-texture.mjs:59:      const objLoader = new THREE.OBJLoader();
scripts/test-native-obj-texture.mjs:85:          child.material = new THREE.MeshStandardMaterial({
scripts/test-render-obj.mjs:57:        import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
scripts/test-render-obj.mjs:94:        const material = new THREE.MeshStandardMaterial({
scripts/test-render-obj.mjs:101:        const objLoader = new OBJLoader();
scripts/test-smooth-photoreal.mjs:13:  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
scripts/test-smooth-photoreal.mjs:72:      const objLoader = new THREE.OBJLoader();
scripts/test-smooth-photoreal.mjs:89:          child.material = new THREE.MeshPhysicalMaterial({
src/app/lab/3d/page.tsx:6:import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
src/app/lab/3d/page.tsx:116:    const loader = new GLTFLoader();
src/components/three/brand-sculpture.tsx:89:    const bladeMaterial = new THREE.MeshStandardMaterial({
src/components/three/brand-sculpture.tsx:101:    const ringMaterial = new THREE.MeshStandardMaterial({
src/components/three/brand-sculpture.tsx:114:    const coreMaterial = new THREE.MeshStandardMaterial({
src/components/three/global-3d-scene.tsx:5:import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
src/components/three/global-3d-scene.tsx:144:    const loader = new GLTFLoader();
src/components/three/hair-clipper.tsx:95:    const brushedSteel = new THREE.MeshStandardMaterial({
src/components/three/hair-clipper.tsx:102:    const upperLidMat = new THREE.MeshStandardMaterial({
src/components/three/hair-clipper.tsx:109:    const lowerBodyMat = new THREE.MeshStandardMaterial({
src/components/three/hair-clipper.tsx:116:    const violetAccentMat = new THREE.MeshStandardMaterial({
src/components/three/hair-clipper.tsx:123:    const brassMat = new THREE.MeshStandardMaterial({
```

## 9. border-radius / rounded nos estilos e componentes
```
src/app/agendar/booking.css:55:  border-radius: var(--radius-pill);
src/app/agendar/booking.css:81:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:91:  border-radius: var(--radius-xl);
src/app/agendar/booking.css:137:  border-radius: 6px;
src/app/agendar/booking.css:144:  border-radius: 50%;
src/app/agendar/booking.css:166:  border-radius: 50%;
src/app/agendar/booking.css:177:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:199:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:215:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:232:  border-radius: var(--radius-xl);
src/app/agendar/booking.css:239:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:257:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:266:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:293:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:312:  border-radius: var(--radius-xl);
src/app/agendar/booking.css:340:  border-radius: var(--radius-xl);
src/app/agendar/booking.css:446:  border-radius: 50%;
src/app/agendar/booking.css:470:  border-radius: 8px;
src/app/agendar/booking.css:499:  border-radius: var(--radius-xl);
src/app/agendar/booking.css:508:  border-radius: 50%;
src/app/agendar/booking.css:550:  border-radius: var(--radius-lg);
src/app/agendar/booking.css:568:  border-radius: var(--radius-2xl);
src/app/agendar/booking.css:583:  border-radius: 50%;
src/app/agendar/booking.css:603:    border-radius: var(--radius-xl);
src/app/globals.css:28:  border-radius: 3px;
src/app/globals.css:92:  border-radius: 8px;
src/app/globals.css:126:  border-radius: var(--radius-pill);
src/components/booking/live-management.tsx:165:          className="bg-surface rounded-[28px] p-8 space-y-4"
src/components/booking/live-management.tsx:183:              className="flex-1 bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
src/components/booking/live-management.tsx:187:              className="bg-accent hover:bg-accent-hover text-accent-contrast px-8 py-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
src/components/booking/live-management.tsx:203:              className={`p-4 rounded-[20px] text-xs flex items-center gap-2 ${
src/components/booking/live-management.tsx:221:            <span className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
src/components/booking/live-management.tsx:229:              className="bg-surface rounded-[28px] p-8 space-y-6"
src/components/booking/live-management.tsx:241:                    className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
src/components/booking/live-management.tsx:260:                <div className="bg-surface-2 rounded-[20px] p-4">
src/components/booking/live-management.tsx:265:                <div className="bg-surface-2 rounded-[20px] p-4">
src/components/booking/live-management.tsx:270:                <div className="sm:col-span-2 bg-surface-2 rounded-[20px] p-4">
src/components/booking/live-management.tsx:277:                <div className="sm:col-span-2 bg-surface-2 rounded-[20px] p-4">
src/components/booking/live-management.tsx:287:                    className="p-6 bg-surface-2 rounded-[24px] space-y-4"
src/components/booking/live-management.tsx:299:                        className="bg-surface rounded-full px-6 py-2 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none"
src/components/booking/live-management.tsx:305:                        className="bg-surface rounded-full px-6 py-2 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none"
src/components/booking/live-management.tsx:311:                        className="px-6 py-2 text-xs font-semibold text-text-muted hover:text-text rounded-full"
src/components/booking/live-management.tsx:317:                        className="bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
src/components/booking/live-management.tsx:331:                    className="bg-surface-2 hover:bg-surface-3 text-text px-6 py-2 rounded-full text-xs font-bold transition-colors"
src/components/booking/live-management.tsx:341:                    className="bg-danger/15 hover:bg-danger/25 text-danger px-6 py-2 rounded-full text-xs font-bold transition-colors"
src/components/booking/live-step-1.tsx:173:          className="inline-flex items-center gap-4 bg-surface hover:bg-surface-2 text-text px-8 py-4 rounded-full font-bold text-xs transition-all group"
src/components/booking/live-step-1.tsx:177:          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
src/components/booking/live-step-1.tsx:199:              className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-2 p-2 transition-all"
src/components/booking/live-step-1.tsx:202:              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-accent overflow-hidden font-serif text-2xl font-bold">
src/components/booking/live-step-2.tsx:166:        className="bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2 rounded-full font-bold text-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
src/components/booking/live-step-3.tsx:173:        className="bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2 rounded-full font-bold text-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
src/components/booking/live-step-4.tsx:155:      <div className="md:col-span-7 bg-surface rounded-[28px] p-8 space-y-6">
src/components/booking/live-step-4.tsx:158:          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-semibold">
src/components/booking/live-step-4.tsx:175:              className="w-full bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
src/components/booking/live-step-4.tsx:189:              className="w-full bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
src/components/booking/live-step-4.tsx:202:              className="w-full bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
src/components/booking/live-step-4.tsx:216:              className={`py-4 px-4 rounded-[20px] text-xs font-bold transition-all text-left flex flex-col ${
src/components/booking/live-step-4.tsx:231:              className={`py-4 px-4 rounded-[20px] text-xs font-bold transition-all text-left flex flex-col ${
src/components/booking/live-step-4.tsx:252:              className="mt-2 rounded accent-accent"
src/components/booking/live-step-4.tsx:264:              className="mt-2 rounded accent-accent"
src/components/booking/live-step-4.tsx:275:          className="w-full bg-accent hover:bg-accent-hover text-accent-contrast py-4 rounded-full font-bold text-sm transition-all disabled:opacity-40"
src/components/booking/live-step-4.tsx:283:      <div className="md:col-span-5 bg-surface-2 rounded-[28px] p-8 space-y-6">
src/components/booking/live-step-5.tsx:155:        className="bg-surface rounded-[32px] p-10 md:p-14 text-center space-y-6"
src/components/booking/live-step-5.tsx:161:          className="w-16 h-16 rounded-full bg-accent/15 text-accent mx-auto flex items-center justify-center"
src/components/booking/live-step-5.tsx:178:        <div className="bg-surface-2 rounded-[20px] p-4 text-xs font-mono">
src/components/booking/live-step-5.tsx:188:          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-semibold font-mono">
src/components/booking/live-step-5.tsx:200:            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-4 rounded-full font-bold text-xs transition-all active:scale-95"
src/components/booking/live-step-5.tsx:206:            className="w-full sm:w-auto bg-surface-2 hover:bg-surface-3 text-text px-6 py-4 rounded-full font-semibold text-xs transition-colors"
src/components/interface-motion.tsx:13:    const selector = '.admin-sidebar nav > a, .admin-mobile-brand, .admin-more > *, .admin-login form, .demo-success > *, [data-motion], h1, h2, .service-row, .team-member, .gallery-piece, .proof > *, .how-section li, .admin-content header, .admin-content article, .admin-content tbody tr, .metric-overview > div, .admin-content form, .admin-content .rounded-xl, .booking-shell > form, .choice, .booking-summary, .field-label, [role="dialog"], .admin-more';
src/components/interface-motion.tsx:32:        if (getComputedStyle(el).position === "fixed" || el.parentElement?.closest('[data-motion], .service-row, .team-member, .gallery-piece, .metric-overview > div, .choice, .admin-content form, .admin-content .rounded-xl')) return;
src/components/three/hair-clipper.tsx:134:    // Body Chassis (tapered cylinder/cone with rounded curves)
src/components/ui/badge.tsx:25:        "inline-flex items-center rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors",
src/components/ui/button.tsx:13:      "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] cursor-pointer";
src/components/ui/button.tsx:37:          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
src/components/ui/card.tsx:12:        "bg-surface text-text rounded-[28px] p-6 md:p-8 shadow-soft transition-all duration-300",
src/styles/interface-motion.css:15:.brand-logo { width:48px; height:48px; object-fit:contain; flex-shrink:0; border-radius:0; }
src/styles/landing.css:81:  border-radius: 8px;
src/styles/landing.css:545:  border-radius: 0;
src/styles/landing.css:691:  border-radius: 8px;
src/styles/landing.css:755:  border-radius: 8px;
src/styles/landing.css:775:  border-radius: 8px;
src/styles/landing.css:880:    border-radius: 0 0 20px 20px;
src/styles/landing.css:1119:    border-radius: 8px;
src/styles/landing.css:1208:.booking-live .rounded-full:where(button, a, input, select) {
src/styles/landing.css:1209:  border-radius: 8px;
src/styles/landing.css:1309:  border-radius: var(--radius-lg);
src/styles/landing.css:1335:  border-radius: var(--radius-lg);
src/styles/landing.css:1434:  border-radius: var(--radius-pill);
src/styles/landing.css:1440:  border-radius: 50%;
src/styles/landing.css:1478:  border-radius: var(--radius-lg);
src/styles/landing.css:1517:  border-radius: var(--radius-2xl);
src/styles/landing.css:1553:  border-radius: var(--radius-xl);
src/styles/landing.css:1626:  border-radius: var(--radius-2xl);
src/styles/landing.css:1706:  border-radius: var(--radius-2xl);
src/styles/landing.css:1729:  border-radius: var(--radius-pill);
src/styles/landing.css:1764:  border-radius: var(--radius-2xl);
src/styles/landing.css:1875:  border-radius: var(--radius-xl);
src/styles/landing.css:1888:  border-radius: var(--radius-lg);
src/styles/landing.css:1911:  border-radius: 50%;
src/styles/landing.css:1923:  border-radius: var(--radius-xl);
src/styles/landing.css:1967:  border-radius: var(--radius-pill);
src/styles/landing.css:1996:  border-radius: 50%;
src/styles/landing.css:2024:  border-radius: var(--radius-lg);
src/styles/landing.css:2051:  border-radius: var(--radius-2xl);
src/styles/landing.css:2070:  border-radius: var(--radius-xl);
src/styles/landing.css:2133:  border-radius: var(--radius-2xl);
src/styles/landing.css:2172:  border-radius: var(--radius-2xl);
src/styles/landing.css:2215:  border-radius: var(--radius-xl);
src/styles/landing.css:2293:  border-radius: var(--radius-2xl);
src/styles/site-tokens.css:97:  border-radius: 0 !important;
src/styles/site-tokens.css:224:  border-radius: var(--radius-subtle, 2px);
src/styles/site-tokens.css:238:  border-radius: var(--radius-subtle, 2px);
src/styles/site-tokens.css:297:  border-radius: var(--radius-subtle, 2px);
src/styles/site-tokens.css:405:  border-radius: var(--radius-subtle, 2px);
src/styles/site-tokens.css:428:  border-radius: var(--radius-subtle, 2px);
src/styles/site-tokens.css:459:  border-radius: 50%;
src/styles/site-tokens.css:476:  border-radius: 6px;
src/styles/site-tokens.css:485:  border-radius: 4px;
src/styles/site-tokens.css:508:  border-radius: 2px;
src/styles/site-tokens.css:617:  border-radius: 6px !important;
src/styles/site-tokens.css:658:  border-radius: 6px !important;
src/styles/site-tokens.css:703:  border-radius: 2px !important;
src/styles/site-tokens.css:715:  border-radius: 4px !important;
src/styles/site-tokens.css:746:  border-radius: 2px !important;
src/styles/site-tokens.css:753:  border-radius: 2px !important;
src/styles/site-tokens.css:766:  border-radius: 6px !important;
src/styles/site-tokens.css:838:  border-radius: 6px !important;
```

## 10. Arquivos de mídia em public/
```
public/3d/auto-stilo-trimmer.glb
public/apple-touch-icon.png
public/brand/auto-stilo/favicon-dark-128.png
public/brand/auto-stilo/favicon-dark-16.png
public/brand/auto-stilo/favicon-dark-32.png
public/brand/auto-stilo/favicon-dark-48.png
public/brand/auto-stilo/favicon-light-128.png
public/brand/auto-stilo/favicon-light-16.png
public/brand/auto-stilo/favicon-light-32.png
public/brand/auto-stilo/favicon-light-48.png
public/brand/auto-stilo/logo-on-dark.png
public/brand/auto-stilo/logo-on-light.png
public/frames/mobile/ezgif-frame-001-8de90aeb7c11.jpg
public/frames/mobile/ezgif-frame-002-cfcec2da29a4.jpg
public/frames/mobile/ezgif-frame-003-148eaf391598.jpg
public/frames/mobile/ezgif-frame-004-d1a175fb8ff8.jpg
public/frames/mobile/ezgif-frame-005-2d8fa86a339f.jpg
public/frames/mobile/ezgif-frame-006-747e8c4d4a74.jpg
public/frames/mobile/ezgif-frame-007-10302fd62997.jpg
public/frames/mobile/ezgif-frame-008-4235a71adb41.jpg
public/frames/mobile/ezgif-frame-009-b4459d102fbf.jpg
public/frames/mobile/ezgif-frame-010-d1de7cc4cbee.jpg
public/frames/mobile/ezgif-frame-011-4eed6492bc95.jpg
public/frames/mobile/ezgif-frame-012-e15459af6bc6.jpg
public/frames/mobile/ezgif-frame-013-e15459af6bc6.jpg
public/frames/mobile/ezgif-frame-014-4c48e147f7b2.jpg
public/frames/mobile/ezgif-frame-015-3289fb56cc25.jpg
public/frames/mobile/ezgif-frame-016-27dd5e19d967.jpg
public/frames/mobile/ezgif-frame-017-21996ca61723.jpg
public/frames/mobile/ezgif-frame-018-21996ca61723.jpg
public/frames/mobile/ezgif-frame-019-cf76f2835b79.jpg
public/frames/mobile/ezgif-frame-020-f3dfb2d5272d.jpg
public/frames/mobile/ezgif-frame-021-5e0a9c6fa528.jpg
public/frames/mobile/ezgif-frame-022-f02d5524f640.jpg
public/frames/mobile/ezgif-frame-023-f02d5524f640.jpg
public/frames/mobile/ezgif-frame-024-d26530e65a77.jpg
public/frames/mobile/ezgif-frame-025-2a765b827f05.jpg
public/frames/mobile/ezgif-frame-026-337fb412a716.jpg
public/frames/mobile/ezgif-frame-027-bf23e8600320.jpg
public/frames/mobile/ezgif-frame-028-bf23e8600320.jpg
public/frames/mobile/ezgif-frame-029-8a3ceea04c37.jpg
public/frames/mobile/ezgif-frame-030-015d9bf51ef0.jpg
public/frames/mobile/ezgif-frame-031-a72e234042d3.jpg
public/frames/mobile/ezgif-frame-032-3803ecab0ab3.jpg
public/frames/mobile/ezgif-frame-033-3803ecab0ab3.jpg
public/frames/mobile/ezgif-frame-034-e5611993ebdc.jpg
public/frames/mobile/ezgif-frame-035-59f44ef4fa5e.jpg
public/frames/mobile/ezgif-frame-036-0244f09f7f39.jpg
public/frames/mobile/ezgif-frame-037-f0e6cd5a8748.jpg
public/frames/mobile/ezgif-frame-038-f0e6cd5a8748.jpg
public/frames/mobile/ezgif-frame-039-9de24c0b59c2.jpg
public/frames/mobile/ezgif-frame-040-e589d93efe0c.jpg
public/frames/mobile/ezgif-frame-041-bcedace7158f.jpg
public/frames/mobile/ezgif-frame-042-9fdfaa3b6b64.jpg
public/frames/mobile/ezgif-frame-043-9fdfaa3b6b64.jpg
public/frames/mobile/ezgif-frame-044-352a8423ff5b.jpg
public/frames/mobile/ezgif-frame-045-19d2f7c20a87.jpg
public/frames/mobile/ezgif-frame-046-c97a2bb41f58.jpg
public/frames/mobile/ezgif-frame-047-fac8e23de2b6.jpg
public/frames/mobile/ezgif-frame-048-fac8e23de2b6.jpg
public/frames/mobile/ezgif-frame-049-eeac1aa1b283.jpg
public/frames/mobile/ezgif-frame-050-3e33d528a050.jpg
public/frames/mobile/ezgif-frame-051-80d57bb8c1cc.jpg
public/frames/mobile/ezgif-frame-052-16493d9cc864.jpg
public/frames/mobile/ezgif-frame-053-16493d9cc864.jpg
public/frames/mobile/ezgif-frame-054-3202a39282db.jpg
public/frames/mobile/ezgif-frame-055-516f4843174c.jpg
public/frames/mobile/ezgif-frame-056-83fe3d84b2a3.jpg
public/frames/mobile/ezgif-frame-057-b3afa50cd05f.jpg
public/frames/mobile/ezgif-frame-058-b3afa50cd05f.jpg
public/frames/mobile/ezgif-frame-059-ff9b0af34f84.jpg
public/frames/mobile/ezgif-frame-060-5923f996a914.jpg
public/frames/mobile/ezgif-frame-061-6684e0de2376.jpg
public/frames/mobile/ezgif-frame-062-6732802b73d4.jpg
public/frames/mobile/ezgif-frame-063-6732802b73d4.jpg
public/frames/mobile/ezgif-frame-064-5d4ea31a46e5.jpg
public/frames/mobile/ezgif-frame-065-86db6e3e1470.jpg
public/frames/mobile/ezgif-frame-066-6a79bbcaf5d1.jpg
public/frames/mobile/ezgif-frame-067-2ddca38d3f93.jpg
public/frames/mobile/ezgif-frame-068-2ddca38d3f93.jpg
public/frames/mobile/ezgif-frame-069-2e58da09f6f3.jpg
public/frames/mobile/ezgif-frame-070-6da915b888b0.jpg
public/frames/mobile/ezgif-frame-071-31c55c01f22f.jpg
public/frames/mobile/ezgif-frame-072-eb3ba7c80768.jpg
public/frames/mobile/ezgif-frame-073-eb3ba7c80768.jpg
public/frames/mobile/ezgif-frame-074-73105fd7730b.jpg
public/frames/mobile/ezgif-frame-075-0246e01b6d2f.jpg
public/frames/mobile/ezgif-frame-076-b37a1c16cfb5.jpg
public/frames/mobile/ezgif-frame-077-a173b23db0a9.jpg
public/frames/mobile/ezgif-frame-078-a173b23db0a9.jpg
public/frames/mobile/ezgif-frame-079-8b0ba1c10775.jpg
public/frames/mobile/ezgif-frame-080-f8247c158f86.jpg
public/frames/mobile/ezgif-frame-081-6a15d4bbf133.jpg
public/frames/mobile/ezgif-frame-082-bf62695a5b12.jpg
public/frames/mobile/ezgif-frame-083-bf62695a5b12.jpg
public/frames/mobile/ezgif-frame-084-97da18b8e29f.jpg
public/frames/mobile/ezgif-frame-085-9a98fcbb2b38.jpg
public/frames/mobile/ezgif-frame-086-7275f0bea8b3.jpg
public/frames/mobile/ezgif-frame-087-180d260b6e4e.jpg
public/frames/mobile/ezgif-frame-088-180d260b6e4e.jpg
public/frames/mobile/ezgif-frame-089-84fae19f3642.jpg
public/frames/mobile/ezgif-frame-090-30d81cc93ebf.jpg
public/frames/mobile/ezgif-frame-091-713319888e62.jpg
public/frames/mobile/ezgif-frame-092-a141dc8986a7.jpg
public/frames/mobile/ezgif-frame-093-a141dc8986a7.jpg
public/frames/mobile/ezgif-frame-094-00fdadcdb54d.jpg
public/frames/mobile/ezgif-frame-095-7442b0830645.jpg
public/frames/mobile/ezgif-frame-096-857698c391da.jpg
public/frames/mobile/ezgif-frame-097-fc863731179e.jpg
public/frames/mobile/ezgif-frame-098-fc863731179e.jpg
public/frames/mobile/ezgif-frame-099-ac9ba45a0eb4.jpg
public/frames/mobile/ezgif-frame-100-0943ea257bae.jpg
public/frames/mobile/ezgif-frame-101-edc060b0c9a1.jpg
public/frames/mobile/ezgif-frame-102-b8fc3477d5bc.jpg
public/frames/mobile/ezgif-frame-103-b8fc3477d5bc.jpg
public/frames/mobile/ezgif-frame-104-7f5562692d8a.jpg
public/frames/mobile/ezgif-frame-105-e65e1b1ba3a7.jpg
public/frames/mobile/ezgif-frame-106-6b61844a617a.jpg
public/frames/mobile/ezgif-frame-107-b7fe957bfa99.jpg
public/frames/mobile/ezgif-frame-108-b7fe957bfa99.jpg
public/frames/mobile/ezgif-frame-109-aac6dda3df64.jpg
public/frames/mobile/ezgif-frame-110-2b5b409227cb.jpg
public/frames/mobile/ezgif-frame-111-4018de354c66.jpg
public/frames/mobile/ezgif-frame-112-102cf7522caf.jpg
public/frames/mobile/ezgif-frame-113-102cf7522caf.jpg
public/frames/mobile/ezgif-frame-114-2ad9d1923b58.jpg
public/frames/mobile/ezgif-frame-115-26ded6791d28.jpg
public/frames/mobile/ezgif-frame-116-1953a0f6a460.jpg
public/frames/mobile/ezgif-frame-117-0c3087edf976.jpg
public/frames/mobile/ezgif-frame-118-0c3087edf976.jpg
public/frames/mobile/ezgif-frame-119-667242ce85c0.jpg
public/frames/mobile/ezgif-frame-120-43057b35be26.jpg
public/frames/mobile/ezgif-frame-121-a36c93f9970f.jpg
public/frames/mobile/ezgif-frame-122-60bb6ab881ec.jpg
public/frames/mobile/ezgif-frame-123-60bb6ab881ec.jpg
public/frames/mobile/ezgif-frame-124-5c1366f04c67.jpg
public/frames/mobile/ezgif-frame-125-54147ac2a7d1.jpg
public/frames/mobile/ezgif-frame-126-2b5c5786c432.jpg
public/frames/mobile/ezgif-frame-127-ee2d557f9a6d.jpg
public/frames/mobile/ezgif-frame-128-ee2d557f9a6d.jpg
public/frames/mobile/ezgif-frame-129-2852b1433416.jpg
public/frames/mobile/ezgif-frame-130-5709414e071b.jpg
public/frames/mobile/ezgif-frame-131-639ee8a8d93e.jpg
public/frames/mobile/ezgif-frame-132-c3c94cd4f80f.jpg
public/frames/mobile/ezgif-frame-133-c3c94cd4f80f.jpg
public/frames/mobile/ezgif-frame-134-1fde70efd087.jpg
public/frames/mobile/ezgif-frame-135-895f9d635ec3.jpg
public/frames/mobile/ezgif-frame-136-28cbf3d4f280.jpg
public/frames/mobile/ezgif-frame-137-ec89217e2b5c.jpg
public/frames/mobile/ezgif-frame-138-ec89217e2b5c.jpg
public/frames/mobile/ezgif-frame-139-b055cb38a514.jpg
public/frames/mobile/ezgif-frame-140-2936ca21da32.jpg
public/frames/mobile/ezgif-frame-141-2d5d392f291d.jpg
public/frames/mobile/ezgif-frame-142-3522f7d26c72.jpg
public/frames/mobile/ezgif-frame-143-3522f7d26c72.jpg
public/frames/mobile/ezgif-frame-144-82261183804f.jpg
public/frames/mobile/ezgif-frame-145-abd9519cd5e6.jpg
public/frames/mobile/ezgif-frame-146-a77240f86461.jpg
public/frames/mobile/ezgif-frame-147-abc5c9797b56.jpg
public/frames/mobile/ezgif-frame-148-abc5c9797b56.jpg
public/frames/mobile/ezgif-frame-149-e4544d016eb0.jpg
public/frames/mobile/ezgif-frame-150-a9bd1ae87d14.jpg
public/frames/mobile/ezgif-frame-151-ccf8408b037f.jpg
public/frames/mobile/ezgif-frame-152-e3f48856d3db.jpg
public/frames/mobile/ezgif-frame-153-e3f48856d3db.jpg
public/frames/mobile/ezgif-frame-154-dd8fcccefb3f.jpg
public/frames/mobile/ezgif-frame-155-36959cf3b0e3.jpg
public/frames/mobile/ezgif-frame-156-ee9fcf0e15eb.jpg
public/frames/mobile/ezgif-frame-157-5d1c965b9cf1.jpg
public/frames/mobile/ezgif-frame-158-5d1c965b9cf1.jpg
public/frames/mobile/ezgif-frame-159-dfe37ccfb132.jpg
public/frames/mobile/ezgif-frame-160-5865716323d3.jpg
public/frames/mobile/ezgif-frame-161-1403d8326f7f.jpg
public/frames/mobile/ezgif-frame-162-aa076dec92c4.jpg
public/frames/mobile/ezgif-frame-163-aa076dec92c4.jpg
public/frames/mobile/ezgif-frame-164-01aaac894695.jpg
public/frames/mobile/ezgif-frame-165-68a349546d2a.jpg
public/frames/mobile/ezgif-frame-166-721657d62f55.jpg
public/frames/mobile/ezgif-frame-167-5087fbb23ec7.jpg
public/frames/mobile/ezgif-frame-168-5087fbb23ec7.jpg
public/frames/mobile/ezgif-frame-169-c8f7bf84c40b.jpg
public/frames/mobile/ezgif-frame-170-fd8e22266f97.jpg
public/frames/mobile/ezgif-frame-171-79ae8bf0a8ab.jpg
public/frames/mobile/ezgif-frame-172-95b7a4359bc8.jpg
public/frames/mobile/ezgif-frame-173-95b7a4359bc8.jpg
public/frames/mobile/ezgif-frame-174-5e107bce2cfc.jpg
public/frames/mobile/ezgif-frame-175-0deb5f767b78.jpg
public/frames/mobile/ezgif-frame-176-b39f13f84a36.jpg
public/frames/mobile/ezgif-frame-177-649895eb88ef.jpg
public/frames/mobile/ezgif-frame-178-649895eb88ef.jpg
public/frames/mobile/ezgif-frame-179-fdc21d9832f6.jpg
public/frames/mobile/ezgif-frame-180-a002e82b1b4a.jpg
public/frames/mobile/ezgif-frame-181-cf0673535ae4.jpg
public/frames/mobile/ezgif-frame-182-4744e3a65a70.jpg
public/frames/mobile/ezgif-frame-183-4744e3a65a70.jpg
public/frames/pc/ezgif-frame-001-4809622be4b7.jpg
public/frames/pc/ezgif-frame-002-ec55e60fdeca.jpg
public/frames/pc/ezgif-frame-003-adddac03cd4e.jpg
public/frames/pc/ezgif-frame-004-2fe465532724.jpg
public/frames/pc/ezgif-frame-005-00ddf29400d8.jpg
public/frames/pc/ezgif-frame-006-4a35c88d6465.jpg
public/frames/pc/ezgif-frame-007-9aee8baae10b.jpg
public/frames/pc/ezgif-frame-008-3b94557a7c92.jpg
public/frames/pc/ezgif-frame-009-14e72f868500.jpg
public/frames/pc/ezgif-frame-010-3d1557b29672.jpg
public/frames/pc/ezgif-frame-011-1837191f3d61.jpg
public/frames/pc/ezgif-frame-012-8931d68cc39a.jpg
public/frames/pc/ezgif-frame-013-8931d68cc39a.jpg
public/frames/pc/ezgif-frame-014-093e5b775bbb.jpg
public/frames/pc/ezgif-frame-015-e37e607f28ba.jpg
public/frames/pc/ezgif-frame-016-c0a1b03fbcc1.jpg
public/frames/pc/ezgif-frame-017-c8b5fb802b59.jpg
public/frames/pc/ezgif-frame-018-c8b5fb802b59.jpg
public/frames/pc/ezgif-frame-019-0e6f64f28f36.jpg
public/frames/pc/ezgif-frame-020-2f233dfdb02e.jpg
public/frames/pc/ezgif-frame-021-92769b55d4e3.jpg
public/frames/pc/ezgif-frame-022-ced4408340b5.jpg
public/frames/pc/ezgif-frame-023-ced4408340b5.jpg
public/frames/pc/ezgif-frame-024-d0f1f991f858.jpg
public/frames/pc/ezgif-frame-025-3ac3c8b15ecf.jpg
public/frames/pc/ezgif-frame-026-5ebc78913c67.jpg
public/frames/pc/ezgif-frame-027-aa9fd76cf2c1.jpg
public/frames/pc/ezgif-frame-028-aa9fd76cf2c1.jpg
public/frames/pc/ezgif-frame-029-eb70df142583.jpg
public/frames/pc/ezgif-frame-030-9a01d5a7add0.jpg
public/frames/pc/ezgif-frame-031-9de7a01ccc6f.jpg
public/frames/pc/ezgif-frame-032-ea93f366c521.jpg
public/frames/pc/ezgif-frame-033-ea93f366c521.jpg
public/frames/pc/ezgif-frame-034-38c44f5d14ba.jpg
public/frames/pc/ezgif-frame-035-0b9a9183bb32.jpg
public/frames/pc/ezgif-frame-036-3c71a69d74e4.jpg
public/frames/pc/ezgif-frame-037-182a47620784.jpg
public/frames/pc/ezgif-frame-038-182a47620784.jpg
public/frames/pc/ezgif-frame-039-a054b9e49a6d.jpg
public/frames/pc/ezgif-frame-040-5d39975f4eca.jpg
public/frames/pc/ezgif-frame-041-e98ee26b78de.jpg
public/frames/pc/ezgif-frame-042-797f67bf7feb.jpg
public/frames/pc/ezgif-frame-043-797f67bf7feb.jpg
public/frames/pc/ezgif-frame-044-a7d36437ed1f.jpg
public/frames/pc/ezgif-frame-045-0344c7b6722d.jpg
public/frames/pc/ezgif-frame-046-312712e7320d.jpg
public/frames/pc/ezgif-frame-047-b77b9f684600.jpg
public/frames/pc/ezgif-frame-048-b77b9f684600.jpg
public/frames/pc/ezgif-frame-049-133396e8524c.jpg
public/frames/pc/ezgif-frame-050-0f7193709e6f.jpg
public/frames/pc/ezgif-frame-051-a75d73342a19.jpg
public/frames/pc/ezgif-frame-052-5ac486c6662d.jpg
public/frames/pc/ezgif-frame-053-5ac486c6662d.jpg
public/frames/pc/ezgif-frame-054-93e5a361daac.jpg
public/frames/pc/ezgif-frame-055-47022ea4315f.jpg
public/frames/pc/ezgif-frame-056-a7655b5fc7f5.jpg
public/frames/pc/ezgif-frame-057-c0ccbb412d7c.jpg
public/frames/pc/ezgif-frame-058-c0ccbb412d7c.jpg
public/frames/pc/ezgif-frame-059-6f9f84707e29.jpg
public/frames/pc/ezgif-frame-060-ae566556c834.jpg
public/frames/pc/ezgif-frame-061-43c53d13e569.jpg
public/frames/pc/ezgif-frame-062-2ca42879c3f8.jpg
public/frames/pc/ezgif-frame-063-2ca42879c3f8.jpg
public/frames/pc/ezgif-frame-064-46f01858311e.jpg
public/frames/pc/ezgif-frame-065-0fd663b62cbc.jpg
public/frames/pc/ezgif-frame-066-f4f5c9bc734f.jpg
public/frames/pc/ezgif-frame-067-2cc5c0282e2d.jpg
public/frames/pc/ezgif-frame-068-2cc5c0282e2d.jpg
public/frames/pc/ezgif-frame-069-53299d8e94ad.jpg
public/frames/pc/ezgif-frame-070-66f44f79da1a.jpg
public/frames/pc/ezgif-frame-071-011cdd5d19d7.jpg
public/frames/pc/ezgif-frame-072-e1243096b966.jpg
public/frames/pc/ezgif-frame-073-e1243096b966.jpg
public/frames/pc/ezgif-frame-074-5610ed7c2e16.jpg
public/frames/pc/ezgif-frame-075-a0beaabf47cf.jpg
public/frames/pc/ezgif-frame-076-398ba73db4dc.jpg
public/frames/pc/ezgif-frame-077-cbfb5bd421f2.jpg
public/frames/pc/ezgif-frame-078-cbfb5bd421f2.jpg
public/frames/pc/ezgif-frame-079-4660499e15d2.jpg
public/frames/pc/ezgif-frame-080-2c256119abad.jpg
public/frames/pc/ezgif-frame-081-97e4932a6759.jpg
public/frames/pc/ezgif-frame-082-030786d8d33a.jpg
public/frames/pc/ezgif-frame-083-030786d8d33a.jpg
public/frames/pc/ezgif-frame-084-57cec43efa2d.jpg
public/frames/pc/ezgif-frame-085-634c538e7343.jpg
public/frames/pc/ezgif-frame-086-caf83536f4b5.jpg
public/frames/pc/ezgif-frame-087-af25f70788e6.jpg
public/frames/pc/ezgif-frame-088-af25f70788e6.jpg
public/frames/pc/ezgif-frame-089-0fedf00de33b.jpg
public/frames/pc/ezgif-frame-090-98308b87864f.jpg
public/frames/pc/ezgif-frame-091-790b537bbdd5.jpg
public/frames/pc/ezgif-frame-092-0be6db6124a2.jpg
public/frames/pc/ezgif-frame-093-0be6db6124a2.jpg
public/frames/pc/ezgif-frame-094-601b1db9b6a6.jpg
public/frames/pc/ezgif-frame-095-587f6280d836.jpg
public/frames/pc/ezgif-frame-096-44063a8225aa.jpg
public/frames/pc/ezgif-frame-097-c94f27d997c5.jpg
public/frames/pc/ezgif-frame-098-c94f27d997c5.jpg
public/frames/pc/ezgif-frame-099-603325f352d1.jpg
public/frames/pc/ezgif-frame-100-63d957abf0a3.jpg
public/frames/pc/ezgif-frame-101-40ca0bafd6fc.jpg
public/frames/pc/ezgif-frame-102-44a9f462a01f.jpg
public/frames/pc/ezgif-frame-103-44a9f462a01f.jpg
public/frames/pc/ezgif-frame-104-e4cc499be8f8.jpg
public/frames/pc/ezgif-frame-105-df98fd97b99c.jpg
public/frames/pc/ezgif-frame-106-d6851115a125.jpg
public/frames/pc/ezgif-frame-107-ed009f21bc25.jpg
public/frames/pc/ezgif-frame-108-ed009f21bc25.jpg
public/frames/pc/ezgif-frame-109-a0d6210b5462.jpg
public/frames/pc/ezgif-frame-110-18db5340f021.jpg
public/frames/pc/ezgif-frame-111-790325bff886.jpg
public/frames/pc/ezgif-frame-112-edab9e54f75f.jpg
public/frames/pc/ezgif-frame-113-edab9e54f75f.jpg
public/frames/pc/ezgif-frame-114-805572bf8df8.jpg
public/frames/pc/ezgif-frame-115-716b228feeba.jpg
public/frames/pc/ezgif-frame-116-6ec9c15ac604.jpg
public/frames/pc/ezgif-frame-117-438ac276d5cd.jpg
public/frames/pc/ezgif-frame-118-438ac276d5cd.jpg
public/frames/pc/ezgif-frame-119-8f2b6a11e3c7.jpg
public/frames/pc/ezgif-frame-120-cd2a852440c8.jpg
public/frames/pc/ezgif-frame-121-939e4cad8fbb.jpg
public/frames/pc/ezgif-frame-122-59081645a462.jpg
public/frames/pc/ezgif-frame-123-59081645a462.jpg
public/frames/pc/ezgif-frame-124-762a3a929dfb.jpg
public/frames/pc/ezgif-frame-125-f1153502772a.jpg
public/frames/pc/ezgif-frame-126-58fe6aa7649b.jpg
public/frames/pc/ezgif-frame-127-9e4315e556ba.jpg
public/frames/pc/ezgif-frame-128-9e4315e556ba.jpg
public/frames/pc/ezgif-frame-129-d45b4c1466c1.jpg
public/frames/pc/ezgif-frame-130-554f0e3367b8.jpg
public/frames/pc/ezgif-frame-131-1b332deec36d.jpg
public/frames/pc/ezgif-frame-132-a918c942d98a.jpg
public/frames/pc/ezgif-frame-133-a918c942d98a.jpg
public/frames/pc/ezgif-frame-134-e82fd892c2a6.jpg
public/frames/pc/ezgif-frame-135-69ff04e7e6a1.jpg
public/frames/pc/ezgif-frame-136-8d0611049549.jpg
public/frames/pc/ezgif-frame-137-1fc477801b69.jpg
public/frames/pc/ezgif-frame-138-1fc477801b69.jpg
public/frames/pc/ezgif-frame-139-0c065e988e66.jpg
public/frames/pc/ezgif-frame-140-97168c186af8.jpg
public/frames/pc/ezgif-frame-141-2a5df7e1201e.jpg
public/frames/pc/ezgif-frame-142-07b4484c016b.jpg
public/frames/pc/ezgif-frame-143-07b4484c016b.jpg
public/frames/pc/ezgif-frame-144-b33ea31f40b3.jpg
public/frames/pc/ezgif-frame-145-5ad166c88f1c.jpg
public/frames/pc/ezgif-frame-146-aa87c66b018d.jpg
public/frames/pc/ezgif-frame-147-c832892a8d63.jpg
public/frames/pc/ezgif-frame-148-c832892a8d63.jpg
public/frames/pc/ezgif-frame-149-16c05c959c99.jpg
public/frames/pc/ezgif-frame-150-8cdc670dfb68.jpg
public/frames/pc/ezgif-frame-151-2e511289622a.jpg
public/frames/pc/ezgif-frame-152-f338422aa6e5.jpg
public/frames/pc/ezgif-frame-153-f338422aa6e5.jpg
public/frames/pc/ezgif-frame-154-42098d894de6.jpg
public/frames/pc/ezgif-frame-155-541a06d7b946.jpg
public/frames/pc/ezgif-frame-156-7a273696ff62.jpg
public/frames/pc/ezgif-frame-157-7b2b38b11700.jpg
public/frames/pc/ezgif-frame-158-7b2b38b11700.jpg
public/frames/pc/ezgif-frame-159-121f5c94945b.jpg
public/frames/pc/ezgif-frame-160-7f632e342fa7.jpg
public/frames/pc/ezgif-frame-161-dde92d35f424.jpg
public/frames/pc/ezgif-frame-162-04a4370056b5.jpg
public/frames/pc/ezgif-frame-163-04a4370056b5.jpg
public/frames/pc/ezgif-frame-164-f7874891cb52.jpg
public/frames/pc/ezgif-frame-165-8655f69158ba.jpg
public/frames/pc/ezgif-frame-166-b501070b0b87.jpg
public/frames/pc/ezgif-frame-167-93c4b1b32ad9.jpg
public/frames/pc/ezgif-frame-168-93c4b1b32ad9.jpg
public/frames/pc/ezgif-frame-169-f1114a9311eb.jpg
public/frames/pc/ezgif-frame-170-024dc869638d.jpg
public/frames/pc/ezgif-frame-171-295c14086376.jpg
public/frames/pc/ezgif-frame-172-3b04198c045b.jpg
public/frames/pc/ezgif-frame-173-3b04198c045b.jpg
public/frames/pc/ezgif-frame-174-29c178a4e490.jpg
public/frames/pc/ezgif-frame-175-38bcddf58b09.jpg
public/frames/pc/ezgif-frame-176-45da10386757.jpg
public/frames/pc/ezgif-frame-177-9dd974b3d94e.jpg
public/frames/pc/ezgif-frame-178-9dd974b3d94e.jpg
public/frames/pc/ezgif-frame-179-0c5741ad5fc8.jpg
public/frames/pc/ezgif-frame-180-063c4c559e97.jpg
public/frames/pc/ezgif-frame-181-de1d25c54338.jpg
public/frames/pc/ezgif-frame-182-a29bbfb1c9e1.jpg
public/frames/pc/ezgif-frame-183-a29bbfb1c9e1.jpg
public/hero-bg.jpg
public/media/auto-stilo/acabamento-478.webp
public/media/auto-stilo/corte-nuca-480.webp
public/media/auto-stilo/corte-perfil-480.webp
public/media/auto-stilo/em-atendimento-poster.webp
public/media/auto-stilo/em-atendimento.mp4
public/media/auto-stilo/espaco-1360.webp
public/media/auto-stilo/espaco-480.webp
public/media/auto-stilo/espaco-960.webp
public/media/auto-stilo/marca-203.webp
public/media/auto-stilo/reconhecimento-1360.webp
public/media/auto-stilo/reconhecimento-480.webp
public/media/auto-stilo/reconhecimento-960.webp
public/media/auto-stilo/visita-poster.webp
public/media/auto-stilo/visita.mp4
public/models/hair-clipper/Hair Trimmer.mtl
public/models/hair-clipper/Hair Trimmer.obj
public/models/hair-clipper/Hairtrimmer_basecolor.jpg
public/models/hair-clipper/hair-clipper-basecolor.jpg
public/models/hair-clipper/hair-clipper.mtl
public/models/hair-clipper/hair-clipper.obj
public/models/hair-clipper/textures/auto-stilo-basecolor.jpg
public/models/hair-clipper/textures/auto-stilo-basecolor.png
public/models/hair-clipper/textures/brushed_steel_normal.png
public/models/hair-clipper/textures/brushed_steel_roughness.png
public/models/hair-clipper/textures/polymer_normal.png
public/video/mobile-reverse.mp4
public/video/mobile.mp4
public/video/pc-gsap-reverse.mp4
public/video/pc-gsap.mp4
public/video/pc-reverse.mp4
public/video/pc.mp4
```
