"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ChatBox from "@/components/ai/ChatBox";
import ThemeToggle from "@/components/ui/ThemeToggle";
import BookingModal from "@/components/calendar/BookingModal";

/* ─────────────── Logo SVG ─────────────── */
const LogoSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 155 89" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M77.4316 49.4968L70.7829 49.4969L55.2691 2.21685" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <path d="M3.55859 54.6685L55.2724 2.21657" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="2.21625" y1="-2.21625" x2="45.1255" y2="-2.21625" transform="matrix(-0.709987 -0.704215 -0.704215 0.709987 33.6113 88.6511)" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="2.21625" y1="-2.21625" x2="26.5109" y2="-2.21625" transform="matrix(-0.710271 0.703929 0.703929 0.710271 54.0137 68.429)" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="2.21625" y1="-2.21625" x2="15.5114" y2="-2.21625" transform="matrix(0.721056 0.692877 0.692877 -0.721056 41.2324 56.146)" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="2.21625" y1="-2.21625" x2="8.31857" y2="-2.21625" transform="matrix(0.723435 -0.690393 -0.690393 -0.723435 33.6113 63.4189)" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <path d="M40.4961 67.2271L36.7316 63.7292" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <path d="M77.4316 49.4971L84.0804 49.4972L99.5942 2.2171" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <path d="M151.305 54.6687L99.5909 2.21681" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="121.263" y1="85.5169" x2="151.728" y2="55.2996" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="103.982" y1="68.4151" x2="121.238" y2="85.5168" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="113.566" y1="59.2799" x2="103.98" y2="68.4918" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <line x1="118.117" y1="63.4924" x2="113.702" y2="59.2794" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
    <path d="M114.367 67.2271L118.132 63.7292" stroke="currentColor" strokeWidth="4.43251" strokeLinecap="round" />
  </svg>
);

/* ─────────────── WhatsApp Icon ─────────────── */
const WAIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─────────────── Instagram Icon ─────────────── */
const IGIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
  </svg>
);

/* ─────────────── YouTube Icon ─────────────── */
const YTIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/* ─────────────── FAQ Item ─────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        className="w-full flex justify-between items-center py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-semibold text-white/90 group-hover:text-white transition-colors leading-snug">{q}</span>
        <span
          className="text-2xl text-violet-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >+</span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? "300px" : "0px" }}
      >
        <p className="pb-5 text-sm text-white/55 leading-relaxed max-w-xl">{a}</p>
      </div>
    </div>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["empresa", "marca"];

  /* Scroll observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("anim-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".anim-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Scroll state */
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Word rotator */
  useEffect(() => {
    const interval = setInterval(() => setWordIndex((p) => (p + 1) % words.length), 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden" style={{ background: "var(--lp-bg, #0e0817)" }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "py-3 bg-[#0e0817]/90 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/30"
            : "py-4 bg-transparent"
          } landscape-mobile:hidden`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="size-7 text-violet-400">
              <LogoSVG />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">AgustinDev</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden min-[900px]:flex items-center gap-8">
            {[
              { label: "Proyectos", href: "#apps" },
              { label: "Servicios", href: "#servicios" },
              { label: "Cómo trabajo", href: "#proceso" },
              { label: "Contacto", href: "#contacto" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden min-[900px]:flex items-center gap-3">
            <a href="https://wa.me/5493884791424" target="_blank" rel="noreferrer"
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
              aria-label="WhatsApp">
              <WAIcon className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer"
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
              aria-label="Instagram">
              <IGIcon className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.youtube.com/@AgustinDev58" target="_blank" rel="noreferrer"
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
              aria-label="YouTube">
              <YTIcon className="w-3.5 h-3.5" />
            </a>
            <a href="/agendar"
              className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-900/40">
              Agendar →
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="min-[900px]:hidden p-2 text-white"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-700/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left – Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-400/30 bg-violet-500/10 backdrop-blur mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-violet-300 tracking-widest uppercase">Disponible para nuevos proyectos</span>
              </div>

              {/* H1 */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
                Una App para tu{" "}
                <span className="inline-grid grid-cols-1 grid-rows-1 h-[1.05em] align-bottom">
                  <span
                    className="col-start-1 row-start-1 transition-all duration-1000 ease-in-out"
                    style={{
                      transform: wordIndex === 0 ? "translateY(0) rotateX(0deg)" : "translateY(-100%) rotateX(90deg)",
                      opacity: wordIndex === 0 ? 1 : 0,
                    }}
                  >
                    empresa
                  </span>
                  <span
                    className="col-start-1 row-start-1 transition-all duration-1000 ease-in-out"
                    style={{
                      transform: wordIndex === 1 ? "translateY(0) rotateX(0deg)" : "translateY(100%) rotateX(-90deg)",
                      opacity: wordIndex === 1 ? 1 : 0,
                    }}
                  >
                    marca
                  </span>
                </span>
                <br />
                con{" "}
                <span className="ai-text-glow font-extrabold">IA</span>
              </h1>

              {/* Sub */}
              <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-md">
                Haz crecer tu negocio, no tus horas de trabajo. Aplicaciones web escalables con inteligencia artificial integrada.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/agendar"
                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-violet-900/50">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                  Agendar Llamada
                </a>
                <a href="https://wa.me/5493884791424" target="_blank" rel="noreferrer"
                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-green-900/40">
                  <WAIcon className="w-5 h-5" />
                  WhatsApp
                </a>
                <a href="#apps"
                  className="flex items-center justify-center px-8 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur text-white font-semibold text-base transition-all">
                  Ver Proyectos
                </a>
              </div>
            </div>

            {/* Right – Profile Image (circular, Instagram style) */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-indigo-500 blur-xl opacity-60 scale-110" aria-hidden />
                {/* Gradient border ring */}
                <div className="relative rounded-full p-1 bg-gradient-to-tr from-violet-500 via-fuchsia-400 to-indigo-400 shadow-2xl">
                  <div className="rounded-full overflow-hidden w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-violet-950">
                    <Image
                      src="/assets/agustindev11.jpg"
                      alt="Agustín – Desarrollador Full Stack & Consultor Digital"
                      width={384}
                      height={384}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                {/* Float badge – projects */}
                {/* <div className="absolute -bottom-4 -left-8 bg-[#0e0817] border border-white/10 rounded-2xl px-5 py-4 shadow-2xl min-w-[140px] hidden sm:block"
                  style={{ animation: "floatY 4s ease-in-out infinite" }}>
                  <div className="text-3xl font-extrabold text-white tracking-tight leading-none">50+</div>
                  <div className="text-xs text-white/50 mt-1 font-medium">Proyectos entregados</div>
                </div> */}
                {/* Float badge – call */}
                <div className="absolute -top-4 -right-8 bg-violet-600 rounded-2xl px-5 py-4 shadow-2xl hidden sm:block"
                  style={{ animation: "floatY 4s ease-in-out infinite 2s" }}>
                  <div className="text-xl">☕</div>
                  <div className="text-sm font-bold text-white mt-1">Llamada 1:1</div>
                  <div className="text-xs text-white/60">30 min · Gratis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech marquee */}
          <div className="mt-20 border-t border-white/5 pt-8 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0e0817] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0e0817] to-transparent z-10 pointer-events-none" />
            <div className="flex animate-infinite-scroll gap-12 items-center">
              {[1, 2].map((g) => (
                <div key={g} className="flex gap-12 items-center shrink-0">
                  {["JavaScript", "TypeScript", "React", "Angular", "Next.js", "Node.js", "Java", "Spring Boot", "MySQL", "PostgreSQL", "MongoDB"].map((t) => (
                    <span key={t} className="text-sm font-bold text-white/20 whitespace-nowrap tracking-tight hover:text-white/60 transition-colors cursor-default">{t}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ══════════ AI CHAT ══════════ */}
      <ChatBox />

      {/* ══════════ PROJECTS ══════════ */}
      <section id="apps" className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 anim-on-scroll opacity-0 translate-y-6 transition-all duration-700">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-3 block">Trabajo Seleccionado</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Proyectos que <em className="font-light text-white/40 not-italic">generan resultados</em>
              </h2>
            </div>
            <a href="/agendar" className="self-start md:self-end flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all whitespace-nowrap">
              Ver todos →
            </a>
          </div>

          {/* Project cards – using magazine layout */}
          <div className="flex flex-col gap-8">

            {/* Point App */}
            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 group rounded-2xl overflow-hidden border border-white/8 bg-white/3 hover:border-violet-500/30 hover:bg-white/5 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 h-52 lg:h-auto relative overflow-hidden">
                  <Image src="/assets/recortadaapppuntos.png" alt="App de puntos – plataforma de fidelización" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:1024px) 100vw, 42vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0e0817]/80" />
                </div>
                <div className="lg:col-span-7 p-6 flex flex-col gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-2">Loyalty / SaaS</div>
                    <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">App de Puntos</h3>
                    <p className="text-sm text-white/55 leading-relaxed mb-3">Plataforma de fidelización de clientes. Acumula puntos, canjea premios y fideliza a tus clientes con una app moderna.</p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {["Next.js", "PostgreSQL"].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-violet-900/50 border border-violet-500/20 text-violet-300 text-xs font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <a
                      href="https://www.youtube.com/watch?v=6lerdQ_z1ek"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/25 text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-[#FF0000]/5"
                    >
                      <YTIcon className="w-5 h-5 text-[#FF0000]" />
                      Ver video explicativo
                    </a>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/8">
                      <div className="size-14 bg-white rounded-lg shrink-0 relative overflow-hidden">
                        <Image src="/assets/qr-pointsapp.png" alt="QR App de puntos" fill className="object-contain p-1" sizes="56px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">App Demo</p>
                        <p className="text-[11px] text-white/40 mt-0.5">Escanea el QR</p>
                        <a href="https://pointsapp-five.vercel.app/" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-violet-400 hover:underline block mt-1">Ver demo →</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OMEGAFIT */}
            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 group rounded-2xl overflow-hidden border border-white/8 bg-white/3 hover:border-violet-500/30 hover:bg-white/5 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-6 flex flex-col gap-4 order-2 lg:order-1">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-2">Health / SaaS</div>
                    <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">OMEGAFIT</h3>
                    <p className="text-sm text-white/55 leading-relaxed mb-3">Web app para seguimiento de pacientes de kinesiología. Gestión de pacientes, tratamientos y ejercicios. Credencial de prueba: DNI 11111111</p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {["Next.js", "PostgreSQL"].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-violet-900/50 border border-violet-500/20 text-violet-300 text-xs font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <a
                      href="https://www.youtube.com/watch?v=OjyveSE8YDs"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/25 text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-[#FF0000]/5"
                    >
                      <YTIcon className="w-5 h-5 text-[#FF0000]" />
                      Ver video explicativo
                    </a>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/8">
                      <div className="size-14 bg-white rounded-lg shrink-0 relative overflow-hidden">
                        <Image src="/assets/qr-omega.png" alt="QR Omega Fit" fill className="object-contain p-1" sizes="56px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">App Vendida</p>
                        <p className="text-[11px] text-white/40 mt-0.5">Escanea el QR</p>
                        <a href="https://omegafit.agustindev.com.ar" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-violet-400 hover:underline block mt-1">Ver app →</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 h-52 lg:h-auto relative overflow-hidden order-1 lg:order-2">
                  <Image src="/assets/omegaimg.png" alt="OmegaFit – app kinesiología" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:1024px) 100vw, 42vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#0e0817]/80" />
                </div>
              </div>
            </div>

            {/* Turnos Online */}
            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 group rounded-2xl overflow-hidden border border-white/8 bg-white/3 hover:border-violet-500/30 hover:bg-white/5 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 h-52 lg:h-auto relative overflow-hidden">
                  <Image src="/assets/lumiereimg.png" alt="Turnos Online – Lumiere" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:1024px) 100vw, 42vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0e0817]/80" />
                </div>
                <div className="lg:col-span-7 p-6 flex flex-col gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-2">Booking / SaaS</div>
                    <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">Turnos Online</h3>
                    <p className="text-sm text-white/55 leading-relaxed mb-3">Web app para que tus pacientes saquen turnos desde su celular, sin llamadas ni WhatsApp. Integra Mercado Pago para cobrar adelantos.</p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {["Next.js", "PostgreSQL"].map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-violet-900/50 border border-violet-500/20 text-violet-300 text-xs font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <a
                      href="https://www.youtube.com/watch?v=W_8-Q9HA6sE"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/25 text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-[#FF0000]/5"
                    >
                      <YTIcon className="w-5 h-5 text-[#FF0000]" />
                      Ver video explicativo
                    </a>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/8">
                      <div className="size-14 bg-white rounded-lg shrink-0 relative overflow-hidden">
                        <Image src="/assets/qr-lumiere.png" alt="QR Lumiere" fill className="object-contain p-1" sizes="56px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">App Demo</p>
                        <p className="text-[11px] text-white/40 mt-0.5">Escanea el QR</p>
                        <a href="https://lumiere.agustindev.com.ar" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-violet-400 hover:underline block mt-1">Ver demo →</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ══════════ PROCESS ══════════ */}
      <section id="proceso" className="py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left sticky */}
            <div className="lg:sticky lg:top-28">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-3 block">El Proceso</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                ¿Cómo trabajamos<br />
                <em className="font-light text-white/40 not-italic">juntos?</em>
              </h2>
              <p className="text-base text-white/50 leading-relaxed mb-8 max-w-sm">
                Un proceso claro y transparente para asegurar el éxito de tu proyecto digital. Sin sorpresas, sin retrasos.
              </p>
              <a href="/agendar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all hover:-translate-y-0.5">
                Empezar ahora →
              </a>
            </div>

            {/* Right steps */}
            <div className="flex flex-col gap-2">
              {[
                { num: "01 — Descubrimiento", title: "Llamada inicial gratuita", desc: "Una sesión de 30 min donde entiendo tu proyecto, objetivos y contexto. Sin compromiso. Al final sabés exactamente qué necesitás." },
                { num: "02 — Propuesta", title: "Plan y presupuesto claro", desc: "Recibís una propuesta detallada con alcance, timeline y precio fijo. Sin sorpresas. Aprobás y arrancamos." },
                { num: "03 — Ejecución", title: "Diseño y desarrollo", desc: "Trabajo iterativo con check-ins semanales. Ves el progreso en tiempo real y podés dar feedback en cada etapa." },
                { num: "04 — Lanzamiento", title: "Entrega y soporte", desc: "Tu proyecto live. Incluye documentación, capacitación y 30 días de soporte post-lanzamiento." },
              ].map((s, i) => (
                <div key={s.num}
                  className="anim-on-scroll opacity-0 translate-x-4 transition-all duration-700 group p-8 rounded-xl bg-white/3 border border-white/8 hover:border-violet-500/40 hover:translate-x-2 relative overflow-hidden"
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="absolute left-0 top-0 bottom-0 w-0 bg-violet-500 group-hover:w-1 transition-all duration-500 rounded-l-xl" />
                  <div className="text-xs font-bold text-white/30 mb-2 tracking-widest uppercase">{s.num}</div>
                  <div className="text-lg font-bold text-white mb-2">{s.title}</div>
                  <div className="text-sm text-white/45 leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ══════════ FAQ ══════════ */}
      <section className="py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-3 block">FAQ</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                Preguntas<br />
                <em className="font-light text-white/40 not-italic">frecuentes</em>
              </h2>
              <p className="text-base text-white/50 leading-relaxed mb-8">
                ¿Tenés dudas? Aquí están las respuestas más comunes. Y si no encontrás la tuya, la llamada es gratis.
              </p>
              <a href="/agendar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all hover:-translate-y-0.5">
                Agendar llamada →
              </a>
            </div>

            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 border-t border-white/10">
              {[
                { q: "¿Cómo funciona la llamada 1:1 gratuita?", a: "Es una sesión de 30 minutos por videollamada donde analizamos tu proyecto, objetivos y desafíos. Sin compromiso. Al terminar tenés claridad sobre los próximos pasos, la uses para contratarme o no." },
                { q: "¿Cuánto cuesta un proyecto?", a: "Cada proyecto es único. Los precios dependen del alcance, complejidad y timeline. Después de la llamada inicial recibís una propuesta detallada con precio fijo, sin costos ocultos." },
                { q: "¿Cuánto tiempo toma un proyecto web?", a: "Una landing page puede estar lista en 1-2 semanas. Un sitio completo con funcionalidades, 3-6 semanas. Trabajamos con cronogramas claros y check-ins semanales." },
                { q: "¿Qué pasa después de que entregás el proyecto?", a: "Incluyo 30 días de soporte post-lanzamiento, documentación completa y capacitación para que puedas gestionar tu sitio de forma autónoma. También ofrezco planes de mantenimiento mensual." },
                { q: "¿Trabajás con clientes fuera de Argentina?", a: "Sí, trabajo con clientes de toda Latinoamérica y España. Todo el proceso es 100% remoto y las videollamadas se adaptan a tu zona horaria." },
              ].map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA / BOOKING ══════════ */}
      <section id="contacto" className="py-28 px-6 relative overflow-hidden" style={{ background: "#0a0514" }}>
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-700/12 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-fuchsia-700/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-3 block">Llamada 1:1 Gratuita</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                Construyamos algo<br />
                <em className="font-light text-white/40 not-italic">grandioso.</em>
              </h2>
              <p className="text-base text-white/55 leading-relaxed mb-8 max-w-sm">
                30 minutos, sin costo, sin compromiso. Una conversación honesta sobre tu proyecto y cómo puedo ayudarte a lograrlo.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Análisis de tu situación actual",
                  "Estrategia personalizada para tu caso",
                  "Estimación de tiempo y presupuesto",
                  "Sin compromisos ni presión comercial",
                  "Respuesta en menos de 24 horas",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center text-violet-400 text-[10px] flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right – Contact card */}
            <div className="anim-on-scroll opacity-0 translate-y-6 transition-all duration-700 bg-white/4 border border-white/10 rounded-2xl p-8 lg:p-10 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-1">¡Hablemos ahora!</h3>
              <p className="text-sm text-white/50 mb-8">Contáctame por WhatsApp o agenda una llamada directamente.</p>

              <div className="flex flex-col gap-4">
                <a href="https://wa.me/5493884791424" target="_blank" rel="noreferrer"
                  className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg shadow-green-900/30">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <WAIcon className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="text-lg relative z-10">WhatsApp</span>
                </a>

                <a href="/agendar"
                  className="group relative flex items-center justify-center gap-3 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-violet-900/40">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                  <span className="text-lg">Agendar Llamada</span>
                </a>

                <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer"
                  className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <IGIcon className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="text-lg relative z-10">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-white/5 py-8 px-6" style={{ background: "#0a0514" }}>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <a href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <div className="size-6 text-violet-400"><LogoSVG /></div>
            <span className="font-bold text-sm text-white">AgustinDev</span>
          </a>
          <p className="text-xs text-white/30">© 2026 AgustinDev. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/5493884791424" target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30 transition-all"
              aria-label="WhatsApp"><WAIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30 transition-all"
              aria-label="Instagram"><IGIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.youtube.com/@AgustinDev58" target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30 transition-all"
              aria-label="YouTube"><YTIcon className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </footer>

      {/* ══════════ MOBILE MENU ══════════ */}
      <div className={`fixed inset-0 z-[60] transition-transform duration-300 ease-in-out flex flex-col items-center justify-center gap-8
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
      `} style={{ background: "#0a0514" }}>
        <button onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 text-white/60 hover:text-white" aria-label="Cerrar menú">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <nav className="flex flex-col items-center gap-7 mobile-menu-landscape-fix">
          {[
            { label: "Proyectos", href: "#apps" },
            { label: "Servicios", href: "#servicios" },
            { label: "Cómo trabajo", href: "#proceso" },
            { label: "Contacto", href: "#contacto" },
          ].map((l) => (
            <a key={l.href} onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold text-white/80 hover:text-white transition-colors" href={l.href}>
              {l.label}
            </a>
          ))}
          <a onClick={() => setMobileMenuOpen(false)}
            href="/agendar"
            className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xl font-bold shadow-lg transition-all">
            Agendar →
          </a>
          <div className="flex items-center gap-5 mt-2">
            <a href="https://wa.me/5493884791424" target="_blank" rel="noreferrer"
              className="flex size-12 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md" aria-label="WhatsApp">
              <WAIcon className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer"
              className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md" aria-label="Instagram">
              <IGIcon className="w-6 h-6" />
            </a>
            <a href="https://www.youtube.com/@AgustinDev58" target="_blank" rel="noreferrer"
              className="flex size-12 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md" aria-label="YouTube">
              <YTIcon className="w-6 h-6" />
            </a>
          </div>
          <div className="flex items-center gap-3 mt-2 text-white/40 text-sm font-medium">
            Tema: <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* ══════════ BACK TO TOP ══════════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-24 right-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20 backdrop-blur transition-all duration-500 hover:bg-violet-600 hover:text-white ${showBackToTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          }`}
      >
        <span className="material-symbols-outlined">expand_less</span>
      </button>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Keyframes for floating badges */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .anim-on-scroll.anim-visible {
          opacity: 1 !important;
          transform: none !important;
        }
      `}</style>
    </div>
  );
}
