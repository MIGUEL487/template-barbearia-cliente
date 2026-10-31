"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, animate } from 'motion/react';
import { useMotionEnabled } from '@/components/motion-preferences';
import { demoMode, demoServices, demoBarbers } from '@/config/demo';
import { supabase, getBarbershopId, getMissingClientEnvVars } from '@/lib/supabase';
import { reportSupabaseError } from '@/lib/booking-diagnostics';

type Service = Omit<(typeof demoServices)[number], 'description'> & { description: string | null };
type Barber = { id: string; name: string; bio: string | null; avatar_url: string | null };

const category = (name: string) =>
  name.includes('+') ? 'Combos' : /barba/i.test(name) ? 'Barba' : /corte/i.test(name) ? 'Cabelo' : 'Cuidados';

function Price({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    let stop = () => {};
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const control = animate(0, value, {
        duration: 0.8,
        onUpdate: (n) => {
          if (ref.current)
            ref.current.textContent = n.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });
        },
      });
      stop = () => control.stop();
    });

    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      stop();
    };
  }, [value, enabled]);

  return (
    <strong ref={ref} className="service-price" aria-label={value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}>
      {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </strong>
  );
}

export function Catalog() {
  const [filter, setFilter] = useState('Todos');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>(demoMode ? demoServices : []);
  const [barbers, setBarbers] = useState<Barber[]>(demoMode ? demoBarbers : []);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!demoMode);

  useEffect(() => {
    if (demoMode) return;
    if (getMissingClientEnvVars().length) {
      setError(true);
      setLoading(false);
      return;
    }
    let alive = true;
    Promise.all([
      supabase.from('public_services').select('id,name,description,duration_minutes,price').eq('barbershop_id', getBarbershopId()),
      supabase.from('public_barbers').select('id,name,bio,avatar_url').eq('barbershop_id', getBarbershopId()),
    ])
      .then(([s, b]) => {
        if (!alive) return;
        if (s.error || b.error) {
          reportSupabaseError('Catalogue', s.error || b.error);
          setError(true);
        } else {
          setServices(s.data || []);
          setBarbers(b.data || []);
        }
        setLoading(false);
      })
      .catch((e) => {
        reportSupabaseError('Catalogue', e);
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const filteredServices = services.filter((s) => filter === 'Todos' || category(s.name) === filter);

  return (
    <>
      <section id="servicos" className="section catalog-section">
        <div className="section-container">
          <div className="section-eyebrow">
            <span className="eyebrow-index">03</span>
            <span className="eyebrow-sep">{'//'}</span>
            <span>CATÁLOGO DE SERVIÇOS</span>
          </div>

          <div className="catalog-header-split">
            <h2 className="catalog-title">
              O seu próximo <span className="headline-italic">ritual.</span>
            </h2>
            <p className="catalog-desc">
              {demoMode
                ? 'Serviços, valores e durações estimadas. Escolha o cuidado ideal e garanta seu horário.'
                : 'Selecione os cuidados desejados e reserve com confirmação imediata.'}
            </p>
          </div>

          {loading && <p className="status-notice" role="status">Carregando catálogo de serviços...</p>}
          {error && (
            <p className="status-notice error" role="alert">
              Não foi possível carregar o catálogo. Agende diretamente via WhatsApp: (35) 99737-4960.
            </p>
          )}

          <div className="filters-tab-bar" role="group" aria-label="Categorias de serviços">
            {['Todos', 'Cabelo', 'Barba', 'Combos', 'Cuidados'].map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-tab ${filter === c ? 'is-active' : ''}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {filter === c && <span className="tab-active-indicator" />}
                <span>{c}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="service-grid">
            <AnimatePresence initial={false}>
              {filteredServices.map((s) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  key={s.id}
                  className={`service-card-item ${expanded === s.id ? 'is-expanded' : ''}`}
                >
                  <button
                    type="button"
                    className="service-card-trigger"
                    aria-expanded={expanded === s.id}
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  >
                    <div className="service-info">
                      <div className="service-title-row">
                        <h3 className="service-name">{s.name}</h3>
                        <span className="duration-pill">{s.duration_minutes} min</span>
                      </div>
                      <p className="service-desc">{s.description || 'Atendimento com atenção técnica integral.'}</p>
                    </div>

                    <div className="service-pricing">
                      <Price value={Number(s.price)} />
                      <span className={`expand-indicator ${expanded === s.id ? 'open' : ''}`} aria-hidden="true">
                        {expanded === s.id ? '−' : '+'}
                      </span>
                    </div>
                  </button>

                  {expanded === s.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="service-expanded-actions"
                    >
                      <div className="actions-inner">
                        <Link className="cta cta-book" href={`/agendar?service=${s.id}`}>
                          <span>Reservar este serviço</span>
                          <span className="cta-arrow">↗</span>
                        </Link>
                        <a
                          className="button-whatsapp"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://wa.me/5535997374960?text=${encodeURIComponent(
                            `Olá! Gostaria de tirar uma dúvida sobre o serviço ${s.name} na Auto Stilo.`
                          )}`}
                        >
                          Dúvidas via WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section id="equipe" className="section team-section">
        <div className="section-container">
          <div className="section-eyebrow">
            <span className="eyebrow-index">04</span>
            <span className="eyebrow-sep">{'//'}</span>
            <span>OS PROFISSIONAIS</span>
          </div>

          <div className="team-header-split">
            <h2 className="team-title">
              Quem cuida do <span className="headline-italic">seu estilo.</span>
            </h2>
            <p className="team-desc">
              {demoMode
                ? 'Profissionais especializados em visagismo, corte moderno e navalha clássica.'
                : 'Conheça nossos barbeiros e selecione seu profissional favorito.'}
            </p>
          </div>

          <div className="team-grid">
            {barbers.map((b, i) => (
              <article className="team-card-editorial" key={b.id}>
                <div className="team-portrait-box">
                  <div className="portrait-frame">
                    <span className="portrait-initials">{b.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="portrait-badge">
                    <span>{i === 0 ? 'MESTRE BARBEIRO' : 'ESPECIALISTA'}</span>
                  </div>
                </div>

                <div className="team-details">
                  <h3 className="team-name">{b.name}</h3>
                  <p className="team-bio">{b.bio || 'Especialista em visagismo e acabamentos contemporâneos.'}</p>
                  <Link href={`/agendar?barber=${b.id}`} className="team-book-link">
                    <span>Escolher este profissional</span>
                    <span className="link-arrow">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
