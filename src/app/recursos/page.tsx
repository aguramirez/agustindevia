"use client";

import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function RecursosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex h-auto w-full flex-col group/design-root min-h-screen">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 w-full border-b border-solid border-[#ece6f4] dark:border-[#2d1b42] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-40 flex justify-center">
            <div className="layout-content-container flex w-full max-w-[960px] items-center justify-between py-4">
              <a href="/" className="flex items-center gap-4 text-text-dark dark:text-text-light hover:opacity-80 transition-opacity">
                <div className="size-7 text-primary dark:text-violet-300">
                  <svg viewBox="0 0 155 89" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-current">
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
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">AgustinDev</h2>
              </a>
              <nav className="hidden md:flex items-center gap-9">
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="/#servicios">Servicios</a>
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="/#apps">Apps</a>
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="/#proceso">Cómo trabajo</a>
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="/#contacto">Contacto</a>
                <a href="/recursos" className="px-4 py-2 bg-primary dark:bg-violet-500 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Recursos Gratis</a>
              </nav>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <a href="https://www.youtube.com/@AgustinDev58" target="_blank" rel="noreferrer" className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#FF0000] text-white hover:shadow-lg transition-all hover:-translate-y-0.5" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-sm">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer" className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:shadow-lg transition-all hover:-translate-y-0.5" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-sm">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                    </svg>
                  </a>
                  <a href="https://wa.me/5493885056441" target="_blank" rel="noreferrer" className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#25D366] text-white hover:shadow-lg transition-all hover:-translate-y-0.5" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-sm">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
                <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-text-dark dark:text-text-light focus:outline-none flex items-center justify-center" aria-label="Abrir menú">
                  <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="layout-container flex grow flex-col py-12 px-4 md:px-10 lg:px-40 flex-1">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold text-text-dark dark:text-text-light mb-4 tracking-tight">Recursos Gratis</h1>
            <p className="text-text-dark/70 dark:text-text-light/70 text-lg">Descarga material exclusivo para potenciar tu negocio, completamente gratis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Resource Card */}
            <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#d9cdea] dark:border-white/10 shadow-md hover:shadow-xl transition-shadow flex flex-col">
              {/* YouTube Video Section */}
              <div className="aspect-video w-full bg-black">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  frameBorder="0"
                  src="https://www.youtube.com/embed/FhMCcn9JaT4"
                  title="Estrategia fidelizacion de clientes 10min"
                ></iframe>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-text-dark dark:text-text-light mb-4">
                  Estrategia fidelizacion de clientes 10min
                </h3>
                
                {/* Downloadable Image Section */}
                <div className="mb-6 rounded-xl overflow-hidden border border-[#d9cdea] dark:border-white/10 relative group">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src="/assets/Estrategia fidelizacion de clientes.png" 
                      alt="Estrategia fidelizacion de clientes"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain bg-black/5"
                    />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm pointer-events-none">
                     <span className="text-white font-bold text-lg drop-shadow-md">Vista Previa</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <a 
                    href="/assets/Estrategia fidelizacion de clientes.png" 
                    download="Estrategia_fidelizacion_de_clientes.png"
                    className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary dark:bg-violet-500/20 dark:hover:bg-violet-500 text-primary hover:text-white dark:text-violet-300 dark:hover:text-white font-bold py-3 px-4 rounded-xl transition-colors border border-primary/20 dark:border-violet-500/30"
                  >
                    <span className="material-symbols-outlined text-xl">download</span>
                    Descargar Infografía (PNG)
                  </a>
                </div>
              </div>
            </div>
            {/* PDF Resource Card */}
            <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#d9cdea] dark:border-white/10 shadow-md hover:shadow-xl transition-shadow flex flex-col">
              {/* Cover Image Section */}
              <div className="aspect-video w-full relative border-b border-[#d9cdea] dark:border-white/10 bg-black/5 dark:bg-black/20">
                <Image 
                  src="/assets/ABC_Ventas_Cover.jpg" 
                  alt="El ABC de las Ventas"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-text-dark dark:text-text-light mb-4">
                  El ABC de las Ventas
                </h3>
                
                <p className="text-text-dark/70 dark:text-text-light/70 mb-6 flex-grow">
                  Descarga esta guía completa en formato PDF para aprender los fundamentos y estrategias clave que te ayudarán a cerrar más ventas.
                </p>

                <div className="mt-auto">
                  <a 
                    href="/assets/ABC_Ventas_AgustinDev.pdf" 
                    download="ABC_Ventas_AgustinDev.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary dark:bg-violet-500/20 dark:hover:bg-violet-500 text-primary hover:text-white dark:text-violet-300 dark:hover:text-white font-bold py-3 px-4 rounded-xl transition-colors border border-primary/20 dark:border-violet-500/30"
                  >
                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    Descargar Guía (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Contact */}
      <footer id="contacto" className="bg-background-light dark:bg-background-dark border-t border-[#d9cdea] dark:border-white/10 pt-16 pb-8 mt-auto">
        <div className="px-4 md:px-10 lg:px-40 flex justify-center">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-4">
            <div className="flex flex-col md:flex-row gap-12 mb-12">
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-text-dark dark:text-text-light mb-2">
                  <div className="size-8 text-primary dark:text-violet-300">
                    <svg viewBox="0 0 155 89" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-current">
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
                  </div>
                  <h2 className="text-xl font-bold">AgustinDev</h2>
                </div>
                <h3 className="text-3xl font-bold text-text-dark dark:text-text-light">Construyamos algo grandioso.</h3>
                <p className="text-text-dark/70 dark:text-text-light/70">¿Listo para transformar tu negocio? Ponte en contacto con nuestro equipo para una consulta gratuita.</p>
              </div>
              <div className="flex-1 bg-white dark:bg-white/5 p-8 rounded-xl border border-[#d9cdea] dark:border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-[#25D366]/20"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -ml-10 -mb-10 transition-all duration-500 group-hover:bg-primary/20"></div>
                
                <div className="flex flex-col items-center justify-center gap-6 h-full text-center relative z-10">
                  <h3 className="text-xl font-bold text-text-dark dark:text-text-light">¡Hablemos ahora!</h3>
                  <p className="text-text-dark/70 dark:text-text-light/70 text-sm">Contáctame por WhatsApp o sígueme en Instagram para ver más proyectos.</p>
                  
                  <a href="https://wa.me/5493885056441" target="_blank" rel="noreferrer" className="group/btn relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(37,211,102,0.6)] hover:shadow-[0_15px_30px_-10px_rgba(37,211,102,0.8)] hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10 drop-shadow-sm group-hover/btn:scale-110 transition-transform duration-300">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="text-xl relative z-10 drop-shadow-sm">WhatsApp</span>
                  </a>
                  
                  <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer" className="group/btn relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(253,29,29,0.6)] hover:shadow-[0_15px_30px_-10px_rgba(253,29,29,0.8)] hover:-translate-y-1 overflow-hidden mt-1">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10 drop-shadow-sm group-hover/btn:scale-110 transition-transform duration-300">
                       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                    </svg>
                    <span className="text-xl relative z-10 drop-shadow-sm">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#ece6f4] dark:border-white/10 pt-8 text-sm text-text-dark/50 dark:text-text-light/50">
              <p>© 2026 AgustinDev. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-text-dark dark:text-text-light" aria-label="Cerrar menú">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <nav className="flex flex-col items-center gap-8">
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="/#servicios">Servicios</a>
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="/#apps">Apps</a>
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="/#proceso">Cómo trabajo</a>
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="/#contacto">Contacto</a>
          <a onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 bg-primary dark:bg-violet-500 text-white rounded-xl text-xl font-bold shadow-lg" href="/recursos">Recursos Gratis</a>
          <div className="flex items-center gap-6 mt-4">
            <a href="https://www.youtube.com/@AgustinDev58" target="_blank" rel="noreferrer" className="flex size-14 cursor-pointer items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 drop-shadow-sm">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/agustindev/" target="_blank" rel="noreferrer" className="flex size-14 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 drop-shadow-sm">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
            <a href="https://wa.me/5493885056441" target="_blank" rel="noreferrer" className="flex size-14 cursor-pointer items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 drop-shadow-sm">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-3 mt-4 text-text-dark/50 dark:text-text-light/50 font-medium">
            Tema:
            <ThemeToggle />
          </div>
        </nav>
      </div>

    </div>
  );
}
