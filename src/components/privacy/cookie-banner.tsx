"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("auto_stilo_cookie_consent");
      if (!stored) {
        // Exibir banner suavemente após pequeno delay na primeira visita
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      } else {
        const parsed = JSON.parse(stored);
        setAnalyticsAllowed(Boolean(parsed.analytics));
      }
    } catch {
      // Falha silenciosa de localStorage
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setVisible(true);
      setShowPreferences(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        setVisible(false);
        setShowPreferences(false);
      }
    };

    window.addEventListener("open-cookie-preferences", handleOpen);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  const saveConsent = useCallback((analytics: boolean) => {
    try {
      localStorage.setItem(
        "auto_stilo_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics,
          version: "2026.11",
          timestamp: new Date().toISOString(),
        })
      );
    } catch {}
    setAnalyticsAllowed(analytics);
    setVisible(false);
    setShowPreferences(false);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-modal={showPreferences ? "true" : undefined}
      aria-label="Gerenciamento de Privacidade e Cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-[#1e1f24] border border-[#3a3a42] text-[#f4f1eb] rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-[#bba2f3] shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h3 className="font-serif text-sm font-bold tracking-wide">
              Privacidade &amp; Cookies
            </h3>
            <p className="text-xs text-[#b9b6bf] leading-relaxed">
              Utilizamos cookies essenciais para o funcionamento seguro do agendamento
              e, com sua autorização, métricas para aprimorar sua experiência. Consulte nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="text-[#bba2f3] underline hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              .
            </p>

            {showPreferences && (
              <div className="py-2.5 my-2 border-t border-b border-[#3a3a42] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="block text-white font-medium">Essenciais (Segurança e Reserva)</strong>
                    <span className="text-[#b9b6bf] text-[11px]">Necessários para agendamento online</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Sempre ativos
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="block text-white font-medium">Estatísticas e Otimizações</strong>
                    <span className="text-[#b9b6bf] text-[11px]">Métricas anônimas de navegação</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="rounded accent-[#bba2f3] w-4 h-4 cursor-pointer"
                    aria-label="Permitir métricas estatísticas"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {showPreferences ? (
                <>
                  <button
                    type="button"
                    onClick={() => saveConsent(analyticsAllowed)}
                    className="bg-[#bba2f3] hover:bg-[#d2c0f8] text-[#17181b] px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Salvar preferências
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreferences(false)}
                    className="bg-[#2c2d33] hover:bg-[#3a3a42] text-[#f4f1eb] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                  >
                    Voltar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => saveConsent(true)}
                    className="bg-[#bba2f3] hover:bg-[#d2c0f8] text-[#17181b] px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Aceitar opcionais
                  </button>
                  <button
                    type="button"
                    onClick={() => saveConsent(false)}
                    className="bg-[#2c2d33] hover:bg-[#3a3a42] text-[#f4f1eb] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                  >
                    Rejeitar opcionais
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreferences(true)}
                    className="text-[#b9b6bf] hover:text-white px-2 py-2 text-xs transition-colors"
                  >
                    Personalizar
                  </button>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              setShowPreferences(false);
            }}
            aria-label="Fechar aviso de cookies"
            className="text-[#b9b6bf] hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
