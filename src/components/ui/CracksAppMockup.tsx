"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const MPIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.25 4.5H3.75A2.25 2.25 0 0 0 1.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25zm-16.5 3h16.5v1.5H3.75v-1.5zm16.5 9H3.75V12h16.5v4.5z" />
  </svg>
);

export default function CracksAppMockup() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pagos">("dashboard");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleTabChange = (tab: "dashboard" | "pagos") => {
    setActiveTab(tab);
    if (iframeRef.current?.contentWindow) {
      if (tab === "pagos") {
        iframeRef.current.contentWindow.postMessage(
          { type: "OPEN_MP_CHECKOUT", team: "Los Galácticos FC", amount: 15000 },
          "*"
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          { type: "SWITCH_CRACKS_TAB", tab: "dashboard" },
          "*"
        );
      }
    }
  };

  const handleSimulatePayment = () => {
    setActiveTab("pagos");
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "OPEN_MP_CHECKOUT", team: "Los Galácticos FC", amount: 15000 },
        "*"
      );
    }
  };

  return (
    <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 w-full flex flex-col items-center justify-between">
      {/* Selector Flotante de Vistas con Sliding Pill */}
      <div className="flex flex-col items-center gap-1.5 mb-3 w-full max-w-[340px]">
        <div className="relative inline-flex w-full p-1 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
          {/* Animated Gliding Indicator */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r ${activeTab === "dashboard"
                ? "from-[#E9C46A] to-amber-500 shadow-md shadow-[#E9C46A]/30 left-1"
                : "from-[#009EE3] to-sky-500 shadow-md shadow-[#009EE3]/30 left-[calc(50%+3px)]"
              } transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]`}
          />

          <button
            id="btnCracksDashboard"
            type="button"
            onClick={() => handleTabChange("dashboard")}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "dashboard" ? "text-neutral-950 font-black" : "text-neutral-400 hover:text-white"
              }`}
          >
            <div className="relative w-4 h-4 rounded overflow-hidden shrink-0">
              <Image src="/assets/crackslogo.png" alt="CracksApp" fill className="object-cover" sizes="16px" />
            </div>
            <span>Torneos & Fixture</span>
          </button>
          <button
            id="btnCracksPagos"
            type="button"
            onClick={() => handleTabChange("pagos")}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "pagos" ? "text-white font-black" : "text-neutral-400 hover:text-white"
              }`}
          >
            <span className="flex items-center gap-1">
              <span>💳 Mercado Pago</span>
            </span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR DEL SMARTPHONE: PROTAGONISTA */}
      <div className="relative w-full max-w-[320px] sm:max-w-[340px] h-[640px] sm:h-[680px] bg-[#0c0c0e] rounded-[50px] p-3 shadow-[0_0_50px_rgba(233,196,106,0.18)] hover:shadow-[0_0_75px_rgba(233,196,106,0.3)] transition-all duration-500 border-[4px] border-[#262626] ring-1 ring-[#3a3a3c] flex flex-col items-center overflow-hidden">
        {/* Botones físicos laterales metálicos */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-9 bg-neutral-600 rounded-l pointer-events-none" />
        <div className="absolute -left-[5px] top-36 w-[3px] h-9 bg-neutral-600 rounded-l pointer-events-none" />
        <div className="absolute -right-[5px] top-28 w-[3px] h-14 bg-neutral-600 rounded-r pointer-events-none" />

        {/* Pantalla / Marco del display */}
        <div className="w-full h-full rounded-[40px] overflow-hidden bg-[#09090b] relative z-10 border border-neutral-800/60">
          <iframe
            ref={iframeRef}
            id="phoneIframeCracks"
            src="/api/cracks/cracksmini.html"
            className="w-full h-full border-0 absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 scale-100 pointer-events-auto"
            title="CracksApp - Gestión Deportiva y Mercado Pago"
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
        <button
          type="button"
          onClick={handleSimulatePayment}
          className="flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl bg-[#009EE3]/15 hover:bg-[#009EE3]/25 border border-[#009EE3]/30 text-white font-bold text-xs transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-[#009EE3]/10 cursor-pointer"
        >
          <MPIcon className="w-4 h-4 text-[#009EE3]" />
          <span>Checkout MP</span>
        </button>
        <a
          href="https://appin.to/cracks/?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAafjX6Y5McSSxi3GdiIVwjUXgsmQnTYwdNJtxN66JqWbcGaULPpVo0SBR4OAyQ_aem_ekulJ50HgJpGympzcZTyvw"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Ver App Oficial</span>
          <span className="text-[#E9C46A]">↗</span>
        </a>
      </div>
    </div>
  );
}
