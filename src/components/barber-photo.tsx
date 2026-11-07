"use client";
import Image from "next/image";
import { useState } from "react";

export function BarberPhoto({
  url,
  name,
  className = "",
}: {
  url: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  let source: string | null = null;
  if (url) {
    const value = url.trim();
    try {
      if (value.startsWith("/") && !value.startsWith("//")) source = value;
      else if (["https:", "blob:"].includes(new URL(value).protocol)) source = value;
    } catch {}
  }

  // Fallback elegante para a foto genérica do profissional da barbearia
  const photoSrc =
    source && failed !== source
      ? source
      : "/img/template/full/03_barbeiro_retrato.webp";

  return (
    <span className={"barber-photo " + className}>
      <Image
        src={photoSrc}
        alt={"Retrato de " + name}
        width={1448}
        height={1086}
        unoptimized
        onError={() => {
          if (source) setFailed(source);
        }}
      />
    </span>
  );
}
