"use client";

import { useState, useEffect } from "react";

const YTIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function OmegaFitMockup() {
  const [activeView, setActiveView] = useState<"admin" | "user">("admin");

  // Listen for view switch events from inside the iframes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SWITCH_OMEGA_VIEW") {
        if (event.data.view === "admin" || event.data.view === "user") {
          setActiveView(event.data.view);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 w-full flex flex-col items-center justify-between">
      {/* Selector Flotante de Vistas con Sliding Pill estilo iOS */}
      <div className="flex flex-col items-center gap-1.5 mb-3 w-full max-w-[340px]">
        <div className="relative inline-flex w-full p-1 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
          {/* Animated Gliding Indicator */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-[#ff6d00] to-orange-500 shadow-md shadow-[#ff6d00]/30 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeView === "admin" ? "left-1" : "left-[calc(50%+3px)]"
              }`}
          />

          <button
            id="btnViewAdmin"
            type="button"
            onClick={() => setActiveView("admin")}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeView === "admin"
                ? "text-white"
                : "text-neutral-400 hover:text-white"
              }`}
          >
            <span>👨‍⚕️ Kinesiólogo</span>
          </button>
          <button
            id="btnViewUser"
            type="button"
            onClick={() => setActiveView("user")}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeView === "user"
                ? "text-white"
                : "text-neutral-400 hover:text-white"
              }`}
          >
            <span>📱 Paciente</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR DEL SMARTPHONE: PROTAGONISTA CON DUAL-IFRAME CROSS-FADE */}
      <div className="relative w-full max-w-[320px] sm:max-w-[340px] h-[640px] sm:h-[680px] bg-[#0c0c0e] rounded-[50px] p-3 shadow-[0_0_50px_rgba(255,109,0,0.18)] hover:shadow-[0_0_75px_rgba(255,109,0,0.3)] transition-all duration-500 border-[4px] border-[#262626] ring-1 ring-[#3a3a3c] flex flex-col items-center overflow-hidden">
        {/* Botones físicos laterales metálicos */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-9 bg-neutral-600 rounded-l pointer-events-none" />
        <div className="absolute -left-[5px] top-36 w-[3px] h-9 bg-neutral-600 rounded-l pointer-events-none" />
        <div className="absolute -right-[5px] top-28 w-[3px] h-14 bg-neutral-600 rounded-r pointer-events-none" />

        {/* Dynamic Island / Cámara Frontal */}
        {/* <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5 border border-neutral-800/90 shadow-md pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#152238]" />
          </div>
          <div className="w-2 h-2 rounded-full bg-[#0a101d] border border-neutral-800" />
        </div> */}

        {/* Pantalla / Marco del display con transición suave instantánea */}
        <div className="w-full h-full rounded-[40px] overflow-hidden bg-[#09090b] relative z-10 border border-neutral-800/60">
          {/* Vista Kinesiólogo (Admin) */}
          <iframe
            id="phoneIframeAdmin"
            src="/api/omega/omegamini.html"
            className={`w-full h-full border-0 absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeView === "admin"
                ? "opacity-100 scale-100 pointer-events-auto z-10"
                : "opacity-0 scale-[0.98] pointer-events-none z-0"
              }`}
            title="OmegaFit - Panel Kinesiólogo"
            scrolling="yes"
            loading="lazy"
            style={{ overscrollBehavior: "contain" }}
          />

          {/* Vista Paciente (User) */}
          <iframe
            id="phoneIframeUser"
            src="/api/omega/omegausermini.html"
            className={`w-full h-full border-0 absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeView === "user"
                ? "opacity-100 scale-100 pointer-events-auto z-10"
                : "opacity-0 scale-[0.98] pointer-events-none z-0"
              }`}
            title="OmegaFit - Vista Paciente"
            scrolling="yes"
            loading="lazy"
            style={{ overscrollBehavior: "contain" }}
          />
        </div>

        {/* Barra de Inicio Inferior (Home Indicator) */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-500/70 rounded-full z-30 pointer-events-none" />
      </div>

      {/* Acciones y Enlaces Inferiores */}
      <div className="flex items-center justify-center gap-3 mt-3 w-full max-w-[340px]">
        <a
          href="https://www.youtube.com/watch?v=OjyveSE8YDs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/25 text-white font-bold text-xs transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-[#FF0000]/5"
        >
          <YTIcon className="w-4 h-4 text-[#FF0000]" />
          Ver video
        </a>
        <a
          href="https://omegafit.agustindev.com.ar"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Abrir web</span>
          <span className="text-[#ff6d00]">↗</span>
        </a>
      </div>
    </div>
  );
}
