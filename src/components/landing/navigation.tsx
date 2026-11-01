"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { DemoBadge } from '@/components/demo-watermark';
import { shop } from '@/config/demo';

const navLinks = [
  { href: '#assinatura', label: 'Experiência' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#galeria', label: 'Espaço' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#contato', label: 'Contato' },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Measure header height dynamically for CSS variable --header-h
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-h', `${height}px`);
      window.dispatchEvent(new Event('auto-stilo-header-resize'));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--header-h');
    };
  }, []);

  // Track page scroll progress for the 1px/2px hairline bar
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const current = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
          setScrollProgress(Math.min(100, Math.max(0, current)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const setActive = (id: string) => {
      navRef.current?.querySelectorAll('a').forEach((a) => {
        if (a.getAttribute('href') === `#${id}`) {
          a.setAttribute('aria-current', 'location');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -55% 0px' }
    );

    navLinks.forEach(({ href }) => {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo principal
      </a>

      <header ref={headerRef} className="site-header">
        <Link className="header-brand-wrap" href="/" aria-label="Auto Stilo Barbearia — Início">
          <BrandLogo tone="light" className="header-brand-logo" />
          <div>
            <div className="header-brand-text">Auto Stilo</div>
            <div className="header-brand-sub">
              Monte Sião, MG <DemoBadge />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav ref={navRef} aria-label="Navegação principal" className="header-nav-links">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="header-nav-link">
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link className="header-cta-btn" href="/agendar">
            <span>Agendar Horário</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="header-menu-btn"
            aria-expanded={open}
            aria-label={open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            onClick={() => setOpen(!open)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
            }}
          >
            {open ? '✕ Fechar' : '☰ Menu'}
          </button>
        </div>

        {/* Hairline reading scroll progress */}
        <div
          className="header-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="header-mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu móvel">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="header-mobile-link"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link
            className="header-mobile-cta"
            href="/agendar"
            onClick={() => setOpen(false)}
          >
            Agendar Horário &rarr;
          </Link>
          <a
            href={shop.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              marginTop: '4px',
            }}
          >
            Atendimento via WhatsApp &nearr;
          </a>
        </div>
      )}
    </>
  );
}
