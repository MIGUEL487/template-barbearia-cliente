import { createFramePacer } from './frame-pacer';

/**
 * Sequential Keyframe Dissolve Engine
 * Smoothly blends between the 6 keyframes with continuous cross-dissolve
 * across scroll progress, keeping 60fps/120fps motion fluid without dropouts.
 */
export function sequentialFrames(
  canvas: HTMLCanvasElement,
  box: HTMLElement,
  variant: 'desktop' | 'mobile',
  onDraw: (index: number) => void,
  onFailure: () => void = () => {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const debug =
    process.env.NODE_ENV === 'development' ||
    new URLSearchParams(location.search).has('debug-hero');

  const TOTAL_FRAMES = 6;
  const images = new Map<number, ImageBitmap>();
  const abort = new AbortController();

  let dead = false;
  let target = 0;
  let displayed = -1;
  let width = 0;
  let height = 0;
  let blockedSince = 0;
  const trace: number[] = [];
  const pacer = createFramePacer(variant === 'mobile');

  const path = (i: number) =>
    `/frames/${variant}/frame_${String(i + 1).padStart(4, '0')}.webp`;

  const publish = () => {
    if (debug) {
      const progress = target / 238;
      (window as Window & { __HERO__?: unknown }).__HERO__ = {
        frame: Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)),
        displayedFrame: displayed + 1,
        targetFrame: target + 1,
        progress,
        drawn: displayed + 1,
        loaded: images.size,
        decoded: images.size,
        limit: TOTAL_FRAMES,
        compressedLimit: TOTAL_FRAMES,
        variant,
        trace: [...trace],
        failed: [],
      };
    }
  };

  const paint = (index: number, record = true) => {
    if (dead || images.size === 0) return false;

    // Progress 0.0 to 1.0 from index 0..238
    const progress = Math.max(0, Math.min(1, index / 238));
    const floatIndex = progress * (TOTAL_FRAMES - 1);
    const baseIndex = Math.min(TOTAL_FRAMES - 2, Math.floor(floatIndex));
    const fraction = floatIndex - baseIndex;
    const nextIndex = Math.min(TOTAL_FRAMES - 1, baseIndex + 1);

    const imgA = images.get(baseIndex) || images.get(0);
    if (!imgA) return false;
    const imgB = images.get(nextIndex);

    // Clear and draw base frame (object-fit: cover)
    ctx.clearRect(0, 0, width, height);

    const scaleA = Math.max(width / imgA.width, height / imgA.height);
    const drawWA = imgA.width * scaleA;
    const drawHA = imgA.height * scaleA;
    const offsetXA = (width - drawWA) / 2;
    const offsetYA = (height - drawHA) / 2;

    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, offsetXA, offsetYA, drawWA, drawHA);

    // Smoothstep cross-dissolve to next keyframe
    if (imgB && nextIndex !== baseIndex && fraction > 0.001) {
      const blend = fraction * fraction * (3 - 2 * fraction);
      const scaleB = Math.max(width / imgB.width, height / imgB.height);
      const drawWB = imgB.width * scaleB;
      const drawHB = imgB.height * scaleB;
      const offsetXB = (width - drawWB) / 2;
      const offsetYB = (height - drawHB) / 2;

      ctx.globalAlpha = blend;
      ctx.drawImage(imgB, offsetXB, offsetYB, drawWB, drawHB);
    }

    ctx.globalAlpha = 1;
    canvas.style.opacity = '1';

    if (record) {
      displayed = index;
      trace.push(index + 1);
      if (trace.length > 2048) trace.shift();
      onDraw(index);
    }
    publish();
    return true;
  };

  // Pre-load and decode all 6 keyframes
  const loadKeyframes = async () => {
    try {
      const loadPromises = Array.from({ length: TOTAL_FRAMES }, async (_, i) => {
        const response = await fetch(path(i), {
          signal: abort.signal,
          priority: i === 0 ? 'high' : 'low',
        });
        if (!response.ok) throw new Error(`${response.status} ${path(i)}`);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        if (!dead) {
          images.set(i, bitmap);
          if (displayed < 0 && (i === 0 || images.size === 1)) {
            paint(0);
          }
        }
      });
      await Promise.all(loadPromises);
      if (!dead && displayed >= 0) {
        paint(displayed, false);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[Hero] Keyframe load error:', err);
        onFailure();
      }
    }
  };

  const resize = () => {
    const rect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (w === width && h === height) return;
    width = canvas.width = w;
    height = canvas.height = h;
    if (images.size > 0) {
      paint(displayed >= 0 ? displayed : 0, false);
    }
  };

  const observer = new ResizeObserver(resize);
  observer.observe(box);
  resize();
  loadKeyframes();

  return {
    setTarget(index: number) {
      target = Math.max(0, Math.min(238, Math.round(index)));
      if (displayed < 0 && images.size > 0) {
        paint(target);
      }
      publish();
    },
    tick(time: number) {
      if (dead || document.hidden) return;
      if (images.size === 0) {
        if (!blockedSince) blockedSince = performance.now();
        if (performance.now() - blockedSince > 15000) onFailure();
        return;
      }
      const remaining = target - Math.max(0, displayed);
      if (!remaining) {
        blockedSince = 0;
        return;
      }
      if (!pacer.ready(time, remaining)) return;
      // Step smoothly toward target
      const step = Math.sign(remaining) * Math.min(Math.abs(remaining), Math.max(1, Math.round(Math.abs(remaining) * 0.25)));
      const next = displayed + step;
      if (paint(next)) {
        blockedSince = 0;
      }
    },
    dispose() {
      dead = true;
      abort.abort();
      observer.disconnect();
      for (const b of images.values()) b.close();
      images.clear();
      if (debug) delete (window as Window & { __HERO__?: unknown }).__HERO__;
    },
  };
}
