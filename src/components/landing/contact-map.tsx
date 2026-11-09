"use client";
import {RegionalText} from '@/components/regional/provider';
import { useEffect, useState } from 'react';
import { shop } from '@/config/demo';

export function ContactMap() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const src = `https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&output=embed`;

  useEffect(() => {
    const timeout = setTimeout(() => setState((s) => (s === 'loading' ? 'error' : s)), 15000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="contact-map automatic-map" aria-busy={state === 'loading'}>
      {state !== 'ready' && (
        <div className="map-placeholder" role="status">
          <span>
            {state === 'loading'
              ? 'Localizando a barbearia…'
              : 'O mapa não respondeu. Consulte a localização diretamente.'}
          </span>
          <a href={src.replace('&output=embed', '')} target="_blank" rel="noreferrer"><RegionalText text="Abrir no Google Maps ↗"/></a>
        </div>
      )}
      <iframe
        title={`Localização de ${shop.name}`}
        src={src}
        loading="eager"
        referrerPolicy="no-referrer"
        onLoad={() => setState('ready')}
        onError={() => setState('error')}
      />
      <a className="map-external" href={src.replace('&output=embed', '')} target="_blank" rel="noreferrer"><RegionalText text="Abrir localização ↗"/></a>
    </div>
  );
}
