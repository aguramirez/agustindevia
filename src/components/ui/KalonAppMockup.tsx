"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function KalonAppMockup() {
  const [activeTab, setActiveTab] = useState<"nutrition" | "workout">("nutrition");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleTabChange = (tab: "nutrition" | "workout") => {
    setActiveTab(tab);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "SWITCH_KALON_MODE", mode: tab },
        "*"
      );
    }
  };

  return (
    <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 w-full flex flex-col items-center justify-between">

      {/* ── App Store Header Badge ── */}
      <div className="w-full max-w-[340px] mb-3.5 px-1">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-lg backdrop-blur-md">
          {/* App Icon */}
          <div className="relative w-12 h-12 rounded-[14px] overflow-hidden shadow-md shadow-black/50 border border-white/10 shrink-0 bg-black">
            <Image
              src="/assets/logo-kalon.png"
              alt="Kalon Logo"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-sm font-extrabold text-white truncate tracking-tight">Kalon</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-500/15 text-violet-400 border border-violet-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                En proceso
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">Nutrición & Conteo de Macros</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-violet-400 font-semibold">
              {/* <span>★ 5.0 (Beta)</span> */}
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400 font-normal">Salud & Fitness</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Flotante de Vistas con Sliding Pill */}
      <div className="flex flex-col items-center gap-1.5 mb-3 w-full max-w-[340px]">
        <div className="relative inline-flex w-full p-1 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
          {/* Animated Gliding Indicator */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-600/30 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === "nutrition" ? "left-1" : "left-[calc(50%+3px)]"
              }`}
          />

          <button
            id="btnKalonNutrition"
            type="button"
            onClick={() => handleTabChange("nutrition")}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "nutrition" ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
          >
            <span>🥗 Nutrición & Macros</span>
          </button>
          <button
            id="btnKalonWorkout"
            type="button"
            onClick={() => handleTabChange("workout")}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "workout" ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
          >
            <span>💪 Workout & Gym</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR DEL SMARTPHONE: PROTAGONISTA */}
      <div className="relative w-full max-w-[320px] sm:max-w-[340px] h-[640px] sm:h-[680px] bg-[#0c0c0e] rounded-[50px] p-3 shadow-[0_0_50px_rgba(139,92,246,0.18)] hover:shadow-[0_0_75px_rgba(139,92,246,0.3)] transition-all duration-500 border-[4px] border-[#262626] ring-1 ring-[#3a3a3c] flex flex-col items-center overflow-hidden">
        {/* Botones físicos laterales metálicos */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-9 bg-neutral-600 rounded-l pointer-events-none" />
        <div className="absolute -left-[5px] top-36 w-[3px] h-9 bg-neutral-600 rounded-l pointer-events-none" />
        <div className="absolute -right-[5px] top-28 w-[3px] h-14 bg-neutral-600 rounded-r pointer-events-none" />

        {/* Pantalla / Marco del display */}
        <div className="w-full h-full rounded-[40px] overflow-hidden bg-black relative z-10 border border-neutral-800/60">
          <iframe
            ref={iframeRef}
            id="phoneIframeKalon"
            src="/kalonmini.html"
            className="w-full h-full border-0 absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 scale-100 pointer-events-auto"
            title="KALON - Prototipo Nutrición & Fitness"
            scrolling="yes"
            loading="eager"
            style={{ overscrollBehavior: "contain" }}
          />
        </div>

        {/* Barra de Inicio Inferior (Home Indicator) */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-500/70 rounded-full z-30 pointer-events-none" />
      </div>

      {/* Acciones y Enlaces Inferiores */}
      <div className="flex items-center justify-center gap-3 mt-3 w-full max-w-[340px]">
        <div className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 font-bold text-xs">
          <span>🛠️ Próximo lanzamiento</span>
        </div>
        <a
          href="/agendar"
          className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Crear tu app</span>
          <span className="text-violet-400">→</span>
        </a>
      </div>
    </div>
  );
}
