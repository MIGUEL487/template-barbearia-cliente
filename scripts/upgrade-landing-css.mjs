import fs from 'fs';
import path from 'path';

const landingCssPath = path.resolve('src/styles/landing.css');
const content = fs.readFileSync(landingCssPath, 'utf8');

// Find the start of the design system block
const splitToken = '/* Auto Stilo — Dark SaaS Premium Landing Design System (Figma Dashdark X + Auto Stilo Brand) */';
const index = content.indexOf(splitToken);

if (index === -1) {
  console.error('Token not found in landing.css');
  process.exit(1);
}

const baseCss = content.slice(0, index);

const creativeCss = `/* Auto Stilo — Creative Experience 2.0 (Precision In Motion · Three.js · GSAP · Lenis) */

/* Global Reset & Typography Baseline */
:root {
  --bg-deep: #070B18;
  --surface-obsidian: #0D1426;
  --surface-graphite: #162038;
  --surface-hover: #1E2B4A;
  --border-hairline: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-glow: rgba(123, 97, 255, 0.4);
  --accent-violet: #7B61FF;
  --accent-light: #A78BFA;
  --accent-soft: rgba(123, 97, 255, 0.12);
  --accent-glow: 0 0 28px rgba(123, 97, 255, 0.45);
  --price-green: #14CA74;
}

.headline-italic {
  font-family: var(--font-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  color: var(--accent-light);
  letter-spacing: -0.01em;
}

/* Sections Foundation */
.section {
  padding-block: 112px;
  position: relative;
  background: var(--bg);
}
.section-container,
.editorial-container,
.history-container,
.footer-container {
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: max(24px, env(safe-area-inset-left));
}

.section-eyebrow,
.editorial-meta,
.history-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans), monospace, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--accent-light);
  text-transform: uppercase;
  margin-bottom: 24px;
}
.eyebrow-index,
.meta-index {
  color: #FFFFFF;
}
.eyebrow-sep,
.meta-separator {
  color: rgba(255, 255, 255, 0.25);
}

/* Buttons & CTA Architecture */
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #7B61FF 0%, #6366F1 100%);
  color: #FFFFFF !important;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.01em;
  box-shadow: 0 4px 20px rgba(123, 97, 255, 0.35);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(123, 97, 255, 0.6);
  background: linear-gradient(135deg, #8B5CF6 0%, #7B61FF 100%);
}
.cta-arrow {
  transition: transform 0.2s ease;
}
.cta:hover .cta-arrow {
  transform: translate(2px, -2px);
}
.button-editorial {
  display: inline-flex;
  align-items: center;
  padding: 13px 24px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-hairline);
  color: #FFFFFF !important;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}
.button-editorial:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-subtle);
  color: #FFFFFF;
}

/* 1. Hero Cinematográfico & Three.js Sculpture */
.hero-track {
  position: relative;
  background: var(--bg);
  overflow: visible;
}
.hero.cinematic {
  position: relative;
  width: 100%;
  height: var(--hero-vh, 100vh);
  height: 100dvh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  color: #FFFFFF;
}
.cinematic.hero-native {
  position: sticky;
  top: 0;
  transform: none;
}
.cinematic .hero-picture,
.cinematic canvas,
.cinematic .shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.cinematic .poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cinematic .shade {
  background: radial-gradient(circle at 75% 40%, rgba(7, 11, 24, 0.82) 0%, rgba(7, 11, 24, 0.98) 85%);
  opacity: 0;
  pointer-events: none;
}

.cinematic .hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 24px;
  z-index: 10;
}
.cinematic .hero-copy > * {
  opacity: 0;
  transform: translateY(28px);
}
.hero-split-layout {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 48px;
  align-items: center;
  width: 100%;
  padding-top: 48px;
}
.hero-text-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--accent-light);
  background: var(--accent-soft);
  border: 1px solid rgba(123, 97, 255, 0.3);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  margin-bottom: 24px;
}
.hero-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-violet);
  box-shadow: 0 0 8px var(--accent-violet);
  animation: pulse-dot 2s infinite ease-in-out;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 0.6; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
}

.hero h1 {
  font-family: var(--font-sans), sans-serif;
  font-size: clamp(38px, 4.6vw, 64px);
  font-weight: 800;
  line-height: 1.08;
  color: #FFFFFF;
  letter-spacing: -0.035em;
  margin: 0 0 20px 0;
}
.hero-lead {
  font-size: 17px;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 48ch;
  margin: 0 0 32px 0;
}
.hero-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.hero-specs {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  background: rgba(13, 20, 38, 0.65);
  border: 1px solid var(--border-hairline);
  backdrop-filter: blur(12px);
}
.spec-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.spec-item strong {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
}
.spec-item span {
  font-size: 11px;
  color: var(--text-muted);
}
.spec-divider {
  width: 1px;
  height: 24px;
  background: var(--border-hairline);
}

/* Three.js Sculpture Architectural Frame */
.hero-sculpture-wrapper {
  position: relative;
  width: 100%;
  height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sculpture-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-hairline);
  border-radius: var(--radius-2xl);
  background: radial-gradient(circle at 50% 50%, rgba(22, 32, 56, 0.4) 0%, rgba(7, 11, 24, 0.7) 100%);
  backdrop-filter: blur(8px);
  overflow: hidden;
}
.frame-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: rgba(123, 97, 255, 0.6);
  pointer-events: none;
}
.frame-corner.top-left { top: 12px; left: 12px; border-top: 1.5px solid; border-left: 1.5px solid; }
.frame-corner.top-right { top: 12px; right: 12px; border-top: 1.5px solid; border-right: 1.5px solid; }
.frame-corner.bottom-left { bottom: 12px; left: 12px; border-bottom: 1.5px solid; border-left: 1.5px solid; }
.frame-corner.bottom-right { bottom: 12px; right: 12px; border-bottom: 1.5px solid; border-right: 1.5px solid; }

.sculpture-label {
  position: absolute;
  top: 16px;
  left: 28px;
  font-family: monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

/* 2. Floating Site Header */
body:has(.hero-track) .site-header {
  position: fixed;
  left: max(16px, calc((100vw - 1240px)/2));
  right: max(16px, calc((100vw - 1240px)/2));
  top: 16px;
  background: rgba(13, 20, 38, 0.88);
  border: 1px solid var(--border-hairline);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-16px);
  transition: opacity 0.4s, transform 0.4s, visibility 0.4s;
  z-index: 50;
}
html.hero-nav-visible body:has(.hero-track) .site-header {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: none;
}
.site-nav a {
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}
.site-nav a:hover {
  color: #FFFFFF;
}

/* 3. Signature Editorial Section */
.signature-editorial {
  padding-top: 140px;
  background: var(--bg);
}
.editorial-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 64px;
  align-items: center;
}
.editorial-headline {
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 800;
  line-height: 1.1;
  color: #FFFFFF;
  margin: 0 0 20px;
  letter-spacing: -0.025em;
}
.editorial-subhead {
  font-size: 17px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0 0 28px;
  max-width: 48ch;
}
.editorial-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--accent-violet);
  padding-bottom: 4px;
  transition: color 0.2s ease;
}
.editorial-link:hover {
  color: var(--accent-light);
}
.editorial-visual {
  position: relative;
}
.editorial-photo-wrapper {
  position: relative;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  background: var(--surface-obsidian);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
}
.photo-crop {
  height: 480px;
}
.photo-crop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(13, 20, 38, 0.9);
  border-top: 1px solid var(--border-hairline);
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}
.caption-tag {
  color: var(--accent-light);
}

.editorial-pillars {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 56px;
  padding-top: 48px;
  border-top: 1px solid var(--border-hairline);
}
.pillar-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.pillar-num {
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-violet);
  padding-top: 2px;
}
.pillar-title {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 8px;
}
.pillar-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
}

/* 4. Ritual Section (GSAP Scrubbed) */
.ritual {
  background: radial-gradient(circle at 50% 30%, #101935 0%, #070B18 75%);
  padding-block: 112px;
}
.ritual-grid {
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.ritual-photo {
  height: 520px;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.85);
  position: relative;
}
.ritual-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.step-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--accent-light);
  background: var(--accent-soft);
  border: 1px solid rgba(123, 97, 255, 0.3);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  margin-bottom: 20px;
}
.ritual h2 {
  font-size: clamp(32px, 3.8vw, 48px);
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}
.ritual-step p {
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 44ch;
}
.razor-svg {
  grid-column: 1 / -1;
  width: 100%;
  height: 72px;
  margin-top: 32px;
}

/* 5. History Section */
.history-editorial {
  background: var(--bg);
}
.history-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 64px;
  align-items: center;
}
.history-figure {
  height: 500px;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  background: var(--surface-obsidian);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
  position: relative;
}
.history-figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.history-caption {
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(7, 11, 24, 0.92);
  border-top: 1px solid var(--border-hairline);
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}
.caption-sub {
  color: var(--accent-light);
}
.history-title {
  font-size: clamp(34px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: #FFFFFF;
  margin: 0 0 20px;
  letter-spacing: -0.025em;
}
.history-p, .history-p-secondary {
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0 0 18px;
}
.history-milestones {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 32px 0;
  padding-left: 16px;
  border-left: 2px solid rgba(123, 97, 255, 0.4);
}
.milestone-item h4 {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 4px;
}
.milestone-item p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}
.signature-script {
  font-family: var(--font-serif), Georgia, serif;
  font-style: italic;
  font-size: 20px;
  color: var(--accent-light);
  margin-top: 24px;
}

/* 6. Catalog Section (Menu de Precision) */
.catalog-section {
  background: var(--bg);
}
.catalog-header-split,
.team-header-split,
.gallery-header-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: flex-end;
  margin-bottom: 48px;
}
.catalog-title,
.team-title,
.gallery-title,
.how-title,
.contact-headline {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.025em;
}
.catalog-desc,
.team-desc,
.gallery-desc,
.contact-lead {
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
}

/* Category Tab Bar */
.filters-tab-bar {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: var(--radius-xl);
  background: var(--surface-obsidian);
  border: 1px solid var(--border-hairline);
  margin-bottom: 36px;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
}
.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  background: transparent;
  border: 0;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.filter-tab:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.04);
}
.filter-tab.is-active {
  background: var(--surface-graphite);
  color: #FFFFFF;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
.tab-active-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-violet);
  box-shadow: 0 0 6px var(--accent-violet);
}

/* Service Card Items */
.service-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.service-card-item {
  border-radius: var(--radius-xl);
  background: var(--surface-obsidian);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.service-card-item:hover,
.service-card-item.is-expanded {
  background: var(--surface-graphite);
  border-color: rgba(123, 97, 255, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
}
.service-card-trigger {
  width: 100%;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;
  gap: 24px;
}
.service-info {
  flex: 1;
}
.service-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 6px;
}
.service-name {
  font-size: 19px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}
.duration-pill {
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: rgba(123, 97, 255, 0.12);
  color: var(--accent-light);
  border: 1px solid rgba(123, 97, 255, 0.25);
}
.service-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0;
  max-width: 60ch;
}
.service-pricing {
  display: flex;
  align-items: center;
  gap: 20px;
}
.service-price {
  font-size: 22px;
  font-weight: 800;
  color: var(--price-green);
  font-variant-numeric: tabular-nums;
}
.expand-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-hairline);
  color: #FFFFFF;
  font-size: 18px;
  transition: all 0.2s ease;
}
.expand-indicator.open {
  background: var(--accent-violet);
  border-color: var(--accent-violet);
}

.service-expanded-actions {
  border-top: 1px solid var(--border-hairline);
  background: rgba(7, 11, 24, 0.4);
  overflow: hidden;
}
.actions-inner {
  padding: 20px 28px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.button-whatsapp {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  background: rgba(20, 202, 116, 0.1);
  border: 1px solid rgba(20, 202, 116, 0.3);
  color: #14CA74 !important;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}
.button-whatsapp:hover {
  background: rgba(20, 202, 116, 0.2);
}

/* 7. Team Section */
.team-section {
  background: var(--bg);
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}
.team-card-editorial {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  padding: 28px;
  border-radius: var(--radius-2xl);
  background: var(--surface-obsidian);
  border: 1px solid var(--border-hairline);
  transition: all 0.25s ease;
}
.team-card-editorial:hover {
  background: var(--surface-graphite);
  border-color: rgba(123, 97, 255, 0.35);
  transform: translateY(-2px);
}
.team-portrait-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.portrait-frame {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, #1C2640 0%, #0F172A 100%);
  border: 1.5px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
}
.portrait-initials {
  font-family: var(--font-serif), Georgia, serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--accent-light);
}
.portrait-badge {
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-light);
}
.team-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.team-name {
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 6px;
}
.team-bio {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 18px;
}
.team-book-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}
.team-book-link:hover {
  color: var(--accent-light);
}

/* 8. Gallery Editorial Composition */
.gallery-editorial {
  background: var(--bg);
}
.gallery-composition {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 32px;
  align-items: start;
}
.space-hero-window {
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  background: var(--surface-obsidian);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
}
.window-crop {
  height: 520px;
}
.window-crop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.window-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(13, 20, 38, 0.95);
  border-top: 1px solid var(--border-hairline);
}
.caption-main {
  font-weight: 700;
  color: #FFFFFF;
  font-size: 15px;
  display: block;
}
.caption-sub {
  font-size: 13px;
  color: var(--text-muted);
}
.caption-coord {
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--accent-light);
}
.mosaic-card {
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  background: var(--surface-obsidian);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
}
.mosaic-crop {
  height: 380px;
}
.mosaic-crop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mosaic-caption {
  padding: 20px 24px;
  background: rgba(13, 20, 38, 0.95);
  border-top: 1px solid var(--border-hairline);
}
.mosaic-caption h4 {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 4px;
}
.mosaic-caption p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

/* 9. How Section */
.how-editorial {
  background: var(--bg);
}
.how-steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin: 48px 0;
}
.how-step-card {
  padding: 32px 24px;
  border-radius: var(--radius-xl);
  background: var(--surface-obsidian);
  border: 1px solid var(--border-hairline);
  transition: all 0.25s ease;
}
.how-step-card:hover {
  background: var(--surface-graphite);
  border-color: rgba(123, 97, 255, 0.35);
  transform: translateY(-2px);
}
.step-number {
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-violet);
  display: inline-block;
  margin-bottom: 16px;
}
.step-heading {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 10px;
}
.step-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
}
.how-cta-center {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.cta-large {
  padding: 16px 36px;
  font-size: 16px;
}

/* 10. Contact Section */
.contact-editorial {
  background: var(--bg);
}
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.contact-details-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 36px 0;
}
.detail-label {
  display: block;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--accent-light);
  margin-bottom: 6px;
}
.detail-value {
  font-size: 17px;
  font-style: normal;
  color: #FFFFFF;
  line-height: 1.5;
}
.whatsapp-link {
  color: #14CA74;
  text-decoration: none;
  font-weight: 600;
}
.contact-map-panel {
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
}

/* 11. Final CTA Banner */
.final-cta-editorial {
  padding: 140px 0 120px;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, #162038 0%, #070B18 80%);
  border-top: 1px solid var(--border-hairline);
}
.final-cta-container {
  text-align: center;
  position: relative;
  z-index: 5;
}
.cta-glow-spot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background: radial-gradient(circle, rgba(123, 97, 255, 0.25) 0%, transparent 70%);
  pointer-events: none;
}
.final-cta-title {
  font-size: clamp(38px, 5.5vw, 64px);
  font-weight: 800;
  line-height: 1.08;
  color: #FFFFFF;
  margin: 0 0 20px;
  letter-spacing: -0.03em;
}
.final-cta-sub {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 48ch;
  margin: 0 auto 36px;
}
.cta-xl {
  padding: 18px 42px;
  font-size: 17px;
}

/* 12. Marquee & Footer Preserved */
.marquee-wrapper {
  background: #0B132B;
  color: #FFFFFF;
  overflow: hidden;
  padding-block: 28px;
  position: relative;
}
.marquee-border-top,
.marquee-border-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-hairline);
}
.marquee-border-top { top: 0; }
.marquee-border-bottom { bottom: 0; }

.marquee-track {
  display: flex;
  width: max-content;
  font: 800 clamp(32px, 5vw, 64px)/1.2 var(--font-sans), sans-serif;
  letter-spacing: 0.12em;
  animation: marquee-run 26s linear infinite;
  animation-play-state: paused;
}
.marquee-wrapper.running .marquee-track {
  animation-play-state: running;
}
.marquee-track > span {
  white-space: nowrap;
  padding-right: 32px;
  color: #FFFFFF;
  text-shadow: 0 0 24px rgba(123, 97, 255, 0.4);
}

.site-footer {
  background: #050811;
  color: var(--text-muted);
  padding: 64px 0 40px;
  border-top: 1px solid var(--border-hairline);
}
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 32px;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}
.footer-brand-text {
  display: flex;
  flex-direction: column;
}
.footer-brand-text .brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}
.footer-brand-text .brand-sub {
  font-size: 12px;
  color: var(--text-muted);
}
.footer-nav {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.footer-nav-link {
  color: var(--text-muted);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}
.footer-nav-link:hover,
.footer-nav-link.primary {
  color: #FFFFFF;
}
.footer-divider {
  height: 1px;
  background: var(--border-hairline);
  margin: 40px 0 28px;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}
.barber-stripe {
  height: 6px;
  background: repeating-linear-gradient(120deg, #7B61FF 0 16px, #070B18 16px 32px, #EF4444 32px 48px);
  margin-top: 36px;
}

/* Responsive Overrides */
@media (max-width: 1024px) {
  .hero-split-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .hero-sculpture-wrapper {
    height: 320px;
  }
  .editorial-container,
  .history-grid,
  .gallery-composition,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .how-steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section {
    padding-block: 72px;
  }
  .hero h1 {
    font-size: 34px;
  }
  .hero-sculpture-wrapper {
    height: 260px;
  }
  .editorial-pillars,
  .team-grid,
  .how-steps-grid {
    grid-template-columns: 1fr;
  }
  .photo-crop,
  .ritual-photo,
  .history-figure,
  .window-crop {
    height: 340px;
  }
  .service-card-trigger {
    flex-direction: column;
    align-items: flex-start;
  }
  .service-pricing {
    width: 100%;
    justify-content: space-between;
    margin-top: 12px;
  }
  .team-card-editorial {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .team-portrait-box {
    margin-inline: auto;
  }
  .team-book-link {
    justify-content: center;
  }
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

fs.writeFileSync(landingCssPath, baseCss + creativeCss, 'utf8');
console.log('✅ landing.css upgraded successfully with Creative Experience 2.0 styles.');
