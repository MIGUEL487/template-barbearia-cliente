import Image from 'next/image';
import { cn } from '@/lib/utils';

// Tone describes the surface behind the logo, not the visitor's device theme.
export function BrandLogo({ tone = 'dark', className }: {
  tone?: 'light' | 'dark'; className?: string;
}) {
  return (
    <Image
      className={cn('brand-logo', className)}
      src={`/brand/template/logo-on-${tone}.png`}
      width={64}
      height={64}
      alt="Barbearia Modelo — Logotipo"
      priority
    />
  );
}
