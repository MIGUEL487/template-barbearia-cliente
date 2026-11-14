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

  // Fallback elegante para a foto autorizada do profissional Auto Stilo
  const photoSrc =
    source && failed !== source
      ? source
      : "/img/fotos-otimizadas/full/08_barbeiro-selfie.webp";

  return (
    <span className={"barber-photo " + className}>
      <Image
        src={photoSrc}
        alt={"Retrato de " + name}
        width={930}
        height={1161}
        unoptimized
        onError={() => {
          if (source) setFailed(source);
        }}
      />
    </span>
  );
}
