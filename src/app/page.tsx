"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ChatBox from "@/components/ai/ChatBox";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowBackToTop(true);
      else setShowBackToTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex h-auto w-full flex-col group/design-root">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 w-full border-b border-solid border-[#ece6f4] dark:border-[#2d1b42] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-40 flex justify-center">
            <div className="layout-content-container flex w-full max-w-[960px] items-center justify-between py-4">
              <div className="flex items-center gap-4 text-text-dark dark:text-text-light">
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
              </div>
              <nav className="hidden md:flex items-center gap-9">
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="#servicios">Servicios</a>
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="#apps">Apps</a>
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="#proceso">Cómo trabajo</a>
                <a className="text-text-dark dark:text-text-light text-sm font-medium hover:text-primary transition-colors" href="#contacto">Contacto</a>
              </nav>
              <div className="flex items-center gap-1 md:gap-4">
                <ThemeToggle />
                <a href="https://wa.me/5493885056441" target="_blank" rel="noreferrer" className="hidden md:flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-sm">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="truncate">WhatsApp</span>
                </a>
                <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-text-dark dark:text-text-light focus:outline-none flex items-center justify-center" aria-label="Abrir menú">
                  <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HeroSection */}
      <div id="hero" className="layout-container flex grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="flex flex-col gap-6 px-4 py-10 md:gap-12 md:flex-row items-center">
                <div className="flex flex-col gap-6 md:w-1/2 md:justify-center">
                  <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-text-dark dark:text-text-light text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
                      Una App para tu empresa<br/> con <span className="ai-text-glow drop-shadow-sm font-extrabold pb-1">IA</span>
                    </h1>
                    <h2 className="text-text-dark/80 dark:text-text-light/80 text-base font-normal leading-relaxed md:text-lg">
                      Haz crecer tu negocio, no tus horas de trabajo
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="https://wa.me/5493885056441" target="_blank" rel="noreferrer" className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-base font-bold leading-normal tracking-[0.015em] hover:shadow-lg hover:shadow-[#25D366]/40 transition-all hover:-translate-y-0.5">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-sm">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="truncate">WhatsApp</span>
                    </a>
                    <a href="#apps" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white dark:bg-white/10 border border-[#d9cdea] dark:border-white/20 text-primary dark:text-text-light text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <span className="truncate">Ver Proyectos</span>
                    </a>
                  </div>
                </div>
                <div className="reveal w-full md:w-1/2 aspect-[4/3] relative rounded-xl shadow-2xl overflow-hidden">
                    <Image src="/assets/working.png" alt="Modern abstract software visualization" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Carousel */}
      <div className="reveal w-full border-y border-[#ece6f4] dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-md overflow-hidden py-8 relative">
        <div className="flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-infinite-scroll gap-16 items-center px-8">
            {/* Array of tech logos duplicated twice */}
            {[1, 2].map((group) => (
              <div key={group} className="flex gap-16 items-center shrink-0">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" alt="Angular" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="tech-logo dark:invert" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring Boot" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="tech-logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="tech-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Agent UI */}
      <ChatBox />

      {/* FeatureSection */}
      <div id="servicios" className="reveal layout-container flex grow flex-col bg-white dark:bg-white/5 py-10">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4 items-center text-center">
                <h1 className="text-text-dark dark:text-text-light tracking-tight text-3xl font-bold leading-tight md:text-4xl max-w-[720px]">
                  Compromiso
                </h1>
                <p className="text-text-dark/70 dark:text-text-light/70 text-base font-normal leading-normal max-w-[720px]">
                  La optimización de procesos internos, la mejora de la experiencia del cliente y la digitalización de
                  flujos de trabajo tradicionales
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group flex flex-1 gap-4 rounded-xl border border-[#d9cdea] dark:border-white/10 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="text-primary dark:text-violet-300 bg-primary/10 dark:bg-violet-400/15 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">code</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-dark dark:text-text-light text-lg font-bold leading-tight">Desarrollo Web a Medida</h2>
                    <p className="text-text-dark/60 dark:text-text-light/60 text-sm font-normal leading-relaxed">Aplicaciones web escalables, seguras y de alto rendimiento construidas desde cero.</p>
                  </div>
                </div>
                <div className="group flex flex-1 gap-4 rounded-xl border border-[#d9cdea] dark:border-white/10 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="text-primary dark:text-violet-300 bg-primary/10 dark:bg-violet-400/15 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">smartphone</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-dark dark:text-text-light text-lg font-bold leading-tight">Soluciones Móviles</h2>
                    <p className="text-text-dark/60 dark:text-text-light/60 text-sm font-normal leading-relaxed">Experiencias responsive mobile y multiplataforma que atraen a los usuarios y amplían su alcance.</p>
                  </div>
                </div>
                <div className="group flex flex-1 gap-4 rounded-xl border border-[#d9cdea] dark:border-white/10 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="text-primary dark:text-violet-300 bg-primary/10 dark:bg-violet-400/15 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">update</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-dark dark:text-text-light text-lg font-bold leading-tight">Modernización de Legado</h2>
                    <p className="text-text-dark/60 dark:text-text-light/60 text-sm font-normal leading-relaxed">Transformación de sistemas obsoletos en herramientas digitales modernas y eficientes sin perder datos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section Header */}
      <div id="apps" className="reveal layout-container flex grow flex-col pt-10">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex justify-between items-end px-4 pb-6 pt-5">
              <div>
                <h2 className="text-text-dark dark:text-text-light text-3xl font-bold leading-tight tracking-[-0.015em]">Proyectos Recientes</h2>
                <p className="text-text-dark/60 dark:text-text-light/60 mt-2">Explora nuestro portafolio de transformaciones digitales exitosas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Listing */}
      <div className="reveal layout-container flex grow flex-col pb-16">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="grid grid-cols-1 gap-12 px-4">
              
              {/* Point App */}
              <div className="flex flex-col gap-8 bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#d9cdea] dark:border-white/10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-full min-h-[300px] relative">
                     <Image src="/assets/recortadaapppuntos.png" alt="FinTech App" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                  <div className="lg:col-span-5 p-8 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">App de puntos</h3>
                      <p className="text-text-dark/70 dark:text-text-light/70 text-sm leading-relaxed mb-4">Plataforma de fidelización de clientes</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-primary/10 dark:bg-violet-400/15 text-primary dark:text-violet-300 text-[10px] font-bold uppercase rounded">Next.js</span>
                        <span className="px-2 py-1 bg-primary/10 dark:bg-violet-400/15 text-primary dark:text-violet-300 text-[10px] font-bold uppercase rounded">PostgreSQL</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background-light dark:bg-black/20 rounded-xl border border-[#d9cdea] dark:border-white/10">
                      <div className="size-20 bg-white p-1 rounded-lg shrink-0 relative">
                        <Image src="/assets/qr-pointsapp.png" alt="QR Puntos" fill className="object-contain p-1" sizes="80px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-dark dark:text-text-light">App Demo</p>
                        <p className="text-[10px] text-text-dark/60 dark:text-text-light/60">Escanea el QR en tu celu y proba la App!</p>
                        <a href="https://pointsapp-five.vercel.app/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary dark:text-violet-300 hover:underline cursor-pointer block mt-1">o Click aquí</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen className="w-full h-full" frameBorder="0"
                      src="https://www.youtube.com/embed/6lerdQ_z1ek" title="App de puntos"></iframe>
                  </div>
                  <p className="mt-3 text-xs text-center text-text-dark/50 dark:text-text-light/50 font-medium tracking-wide italic">App de puntos &amp; Fidelizacion de clientes</p>
                </div>
              </div>

              {/* OMEGAFIT */}
              <div className="flex flex-col gap-8 bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#d9cdea] dark:border-white/10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-5 p-8 flex flex-col justify-between gap-6 order-2 lg:order-1">
                    <div>
                      <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">OMEGAFIT</h3>
                      <p className="text-text-dark/70 dark:text-text-light/70 text-sm leading-relaxed mb-4">
                        Web app para el seguimiento de pacientes del kinesiologo Lic. Oscar Robles, permite gestionar pacientes, tratamientos, ejercicios, etc. Credencial de prueba: DNI 11111111
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-primary/10 dark:bg-violet-400/15 text-primary dark:text-violet-300 text-[10px] font-bold uppercase rounded">Next.js</span>
                        <span className="px-2 py-1 bg-primary/10 dark:bg-violet-400/15 text-primary dark:text-violet-300 text-[10px] font-bold uppercase rounded">PostgreSQL</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background-light dark:bg-black/20 rounded-xl border border-[#d9cdea] dark:border-white/10">
                      <div className="size-20 bg-white p-1 rounded-lg shrink-0 relative">
                        <Image src="/assets/qr-omega.png" alt="QR Omega" fill className="object-contain p-1" sizes="80px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-dark dark:text-text-light">App Vendida</p>
                        <p className="text-[10px] text-text-dark/60 dark:text-text-light/60">Escanea el QR en tu celu y proba la App!</p>
                        <a href="https://omegafit.agustindev.com.ar" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary dark:text-violet-300 hover:underline cursor-pointer block mt-1">o Click aquí</a>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-7 h-full min-h-[300px] relative order-1 lg:order-2">
                     <Image src="/assets/omegaimg.png" alt="Omega Fit App" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen className="w-full h-full" frameBorder="0"
                      src="https://www.youtube.com/embed/OjyveSE8YDs" title="Healthcare Portal Tutorial"></iframe>
                  </div>
                  <p className="mt-3 text-xs text-center text-text-dark/50 dark:text-text-light/50 font-medium tracking-wide italic">Personal Trainer App Case Study</p>
                </div>
              </div>

               {/* Turnos Online */}
               <div className="flex flex-col gap-8 bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#d9cdea] dark:border-white/10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-full min-h-[300px] relative">
                     <Image src="/assets/lumiereimg.png" alt="Lumiere App" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                  <div className="lg:col-span-5 p-8 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">Turnos Online</h3>
                      <p className="text-text-dark/70 dark:text-text-light/70 text-sm leading-relaxed mb-4">Web app para que tus pacientes saquen turnos desde su celular, sin necesidad de llamar por teléfono o mandar whatsapp. Puede integrar mercado pago para cobrar adelantos de los turnos.</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-primary/10 dark:bg-violet-400/15 text-primary dark:text-violet-300 text-[10px] font-bold uppercase rounded">Next.js</span>
                        <span className="px-2 py-1 bg-primary/10 dark:bg-violet-400/15 text-primary dark:text-violet-300 text-[10px] font-bold uppercase rounded">PostgreSQL</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background-light dark:bg-black/20 rounded-xl border border-[#d9cdea] dark:border-white/10">
                      <div className="size-20 bg-white p-1 rounded-lg shrink-0 relative">
                        <Image src="/assets/qr-lumiere.png" alt="QR Lumiere" fill className="object-contain p-1" sizes="80px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-dark dark:text-text-light">App Demo</p>
                        <p className="text-[10px] text-text-dark/60 dark:text-text-light/60">Escanea el QR en tu celu y proba la App!</p>
                        <a href="https://lumiere.agustindev.com.ar" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary dark:text-violet-300 hover:underline cursor-pointer block mt-1">o Click aquí</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen className="w-full h-full" frameBorder="0"
                      src="https://www.youtube.com/embed/W_8-Q9HA6sE" title="Turnos Online Demo"></iframe>
                  </div>
                  <p className="mt-3 text-xs text-center text-text-dark/50 dark:text-text-light/50 font-medium tracking-wide italic">Turnos Online Case Study</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div id="proceso" className="reveal layout-container flex grow flex-col py-20 bg-background-light dark:bg-background-dark">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-dark dark:text-text-light mb-4">¿Cómo trabajamos juntos?</h2>
              <p className="text-text-dark/60 dark:text-text-light/60 max-w-2xl mx-auto">Un proceso claro y transparente para asegurar el éxito de tu proyecto digital.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="group p-6 bg-white dark:bg-white/5 rounded-2xl border border-[#d9cdea] dark:border-white/10 hover:border-primary/50 transition-all">
                <div className="text-2xl font-black text-primary/30 dark:text-violet-300/40 group-hover:text-primary dark:group-hover:text-violet-300 transition-colors mb-4">1</div>
                <h3 className="font-bold text-text-dark dark:text-text-light mb-2">Descubrimiento</h3>
                <p className="text-sm text-text-dark/60 dark:text-text-light/60">Análisis detallado de tus necesidades y objetivos comerciales.</p>
              </div>
              <div className="group p-6 bg-white dark:bg-white/5 rounded-2xl border border-[#d9cdea] dark:border-white/10 hover:border-primary/50 transition-all">
                <div className="text-2xl font-black text-primary/30 dark:text-violet-300/40 group-hover:text-primary dark:group-hover:text-violet-300 transition-colors mb-4">2</div>
                <h3 className="font-bold text-text-dark dark:text-text-light mb-2">Estrategia</h3>
                <p className="text-sm text-text-dark/60 dark:text-text-light/60">Diseño de la arquitectura y planificación del desarrollo.</p>
              </div>
              <div className="group p-6 bg-white dark:bg-white/5 rounded-2xl border border-[#d9cdea] dark:border-white/10 hover:border-primary/50 transition-all">
                <div className="text-2xl font-black text-primary/30 dark:text-violet-300/40 group-hover:text-primary dark:group-hover:text-violet-300 transition-colors mb-4">3</div>
                <h3 className="font-bold text-text-dark dark:text-text-light mb-2">Desarrollo</h3>
                <p className="text-sm text-text-dark/60 dark:text-text-light/60">Codificación limpia y pruebas rigurosas de funcionalidad.</p>
              </div>
              <div className="group p-6 bg-white dark:bg-white/5 rounded-2xl border border-[#d9cdea] dark:border-white/10 hover:border-primary/50 transition-all">
                <div className="text-2xl font-black text-primary/30 dark:text-violet-300/40 group-hover:text-primary dark:group-hover:text-violet-300 transition-colors mb-4">4</div>
                <h3 className="font-bold text-text-dark dark:text-text-light mb-2">Lanzamiento</h3>
                <p className="text-sm text-text-dark/60 dark:text-text-light/60">Despliegue y soporte continuo para asegurar la evolución.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Contact */}
      <footer id="contacto" className="reveal bg-background-light dark:bg-background-dark border-t border-[#d9cdea] dark:border-white/10 pt-16 pb-8">
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
                {/* Decoration blobs */}
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
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="#servicios">Servicios</a>
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="#apps">Apps</a>
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="#proceso">Cómo trabajo</a>
          <a onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-text-dark dark:text-text-light hover:text-primary transition-colors" href="#contacto">Contacto</a>
        </nav>
      </div>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-24 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 dark:bg-violet-400/20 text-primary dark:text-violet-300 backdrop-blur shadow-sm transition-all duration-500 hover:bg-primary hover:text-white dark:hover:bg-violet-500 dark:hover:text-white ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <span className="material-symbols-outlined">expand_less</span>
      </button>

    </div>
  );
}
