"use client";

import { useState, useRef, useEffect } from "react";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

type Role = "user" | "model";

interface Message {
  role: Role;
  parts: { text: string }[];
  isLocked?: boolean;
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      parts: [{ text: "¡Hola! Soy el agente de soporte de AgustinDev. Contame un poco, ¿qué problema de gestión o stock estás buscando resolver en tu empresa?" }],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Paywall estados
  const [hasSubmittedData, setHasSubmittedData] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  
  // Prompt Explorer
  const [showPromptModal, setShowPromptModal] = useState(false);
  
  // Lead Form
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  // Bloquear scroll de la web y registrar estado en historial (Botón atrás de Android)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ chatOpen: true }, "");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Interceptar la tecla física "Atrás" de los celulares para cerrar el ChatBox sin salir de la web
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Si el nuevo estado ya no dice que el chat está abierto, lo cerramos en la UI
      if (!e.state?.chatOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("hasSubmittedData") === "true") {
      setHasSubmittedData(true);
    }
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Detectar el intento de mensaje si hay bloqueo.
    const userMessageCount = messages.filter(m => m.role === "user").length;
    if (userMessageCount >= 1 && !hasSubmittedData) {
      setShowLeadModal(true);
      // Evita mandar el mensaje hasta que se registre si asÃ­ se desea, o lo envÃ­a?
      // "El usuario puede enviar 1 mensaje libre." => El 2do enviar estÃ¡ bloqueado tambiÃ©n.
      // O podemos enviarlo y bloquear la respuesta. La consigna dice:
      // "La respuesta de la IA debe mostrarse con un efecto de blur."
      // Es decir enviamos y cuando viene bloqueamos.
    }

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const historyItems = messages.slice(1).map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.parts[0].text,
          history: historyItems,
        }),
      });

      const data = await res.json();
      let shouldLock = false;
      if (userMessageCount >= 1 && !hasSubmittedData) {
        shouldLock = true;
      }

      if (!res.ok) {
           setMessages(prev => [...prev, { role: "model", parts: [{ text: data.error || "Hubo un error al procesar tu solicitud." }] }]);
      } else {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.text }], isLocked: shouldLock }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", parts: [{ text: "Error de conexión." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const formParams = new URLSearchParams();
      formParams.append("nombre", leadName);
      formParams.append("email", leadEmail);
      formParams.append("telefono", leadPhone);

      // Extraer y limpiar el historial de la conversación a formato texto
      const historialChat = messages.map(m => {
        const emisor = m.role === "user" ? "👤 Cliente" : "🤖 IA";
        let texto = m.parts[0].text;
        texto = texto.replace(/\[BUTTON: Ver Proyectos\]/g, '').replace(/\[BUTTON: Hablar por WhatsApp\]/g, '').trim();
        return `${emisor}: ${texto}`;
      }).join("\n\n");
      formParams.append("historial", historialChat);
      
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: "POST",
          body: formParams,
          headers: {
             "Content-Type": "application/x-www-form-urlencoded"
          },
          mode: "no-cors",
        });
      }

      localStorage.setItem("hasSubmittedData", "true");
      setHasSubmittedData(true);
      setShowLeadModal(false);
      
      // Desbloquear chat permanentemente
      setMessages(prev => prev.map(m => ({ ...m, isLocked: false })));
    } catch (err) {
      console.error("Error webhook:", err);
    } finally {
      setLeadLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] md:w-[80%] lg:w-[60%] max-w-[800px] flex flex-col drop-shadow-2xl transition-all duration-500 ease-in-out">
      
      {/* Main Box */}
      <div className="ai-glow-border relative rounded-2xl group transition-all duration-500">
        <div className="bg-white/95 dark:bg-[#1f162d]/95 backdrop-blur-md rounded-[calc(1rem-1px)] flex flex-col w-full relative overflow-hidden">
          
          {/* --- TOP PORTION: Header and Messages (Expands up) --- */}
          <div 
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden flex flex-col">
              <div className="flex flex-col h-[500px] md:h-[600px] max-h-[75vh] w-full pointer-events-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-[#671ac7] text-white p-3 md:p-4 flex items-center gap-2 md:gap-3 shrink-0">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-lg md:text-xl">smart_toy</span>
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs md:text-sm tracking-wide truncate">AgustinDev IA</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0"></div>
                    <p className="text-[9px] md:text-[10px] text-white/90 uppercase tracking-wider font-semibold truncate">En línea</p>
                  </div>
               </div>
               <div className="flex items-center gap-1 md:gap-2 shrink-0">
                 <button 
                  onClick={(e) => { e.stopPropagation(); setShowPromptModal(true); }} 
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[9px] md:text-[11px] font-semibold px-2 md:px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm whitespace-nowrap" 
                 >
                   <span className="material-symbols-outlined text-[12px] md:text-[14px]">code</span>
                   <span className="hidden sm:inline">Ver instrucciones de esta IA</span>
                   <span className="inline sm:hidden">Instrucciones IA</span>
                 </button>
                 <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (window.history.state?.chatOpen) window.history.back(); 
                    else setIsOpen(false); 
                  }} 
                  className="text-white hover:text-white/70 transition-colors flex items-center justify-center p-1" 
                  aria-label="Cerrar chat"
                 >
                   <span className="material-symbols-outlined">close</span>
                 </button>
               </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto bg-background-light dark:bg-[#120a1a] relative">
              {messages.map((msg, idx) => {
                const rawText = msg.parts[0].text;
                let cleanText = rawText;
                
                // Parser de etiquetas inyectadas por la IA
                const hasProjectsBtn = cleanText.includes('[BUTTON: Ver Proyectos]');
                const hasWhatsappBtn = cleanText.includes('[BUTTON: Hablar por WhatsApp]');
                
                if (hasProjectsBtn || hasWhatsappBtn) {
                  cleanText = cleanText.replace(/\[BUTTON: Ver Proyectos\]/g, '')
                                       .replace(/\[BUTTON: Hablar por WhatsApp\]/g, '')
                                       .trim();
                }

                if (msg.isLocked) {
                  return (
                    <div key={idx} className="flex self-start max-w-[85%] relative group cursor-pointer" onClick={() => setShowLeadModal(true)}>
                      <div className="p-3.5 rounded-2xl text-sm leading-relaxed bg-white dark:bg-white/10 text-text-dark dark:text-text-light border border-[#d9cdea] dark:border-white/10 rounded-bl-sm shadow-sm blur-sm opacity-50 relative select-none whitespace-pre-wrap">
                         {cleanText}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-[#120a1a] to-transparent rounded-2xl flex flex-col items-center justify-center gap-2 transition-all">
                         <div className="bg-primary/90 text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined shrink-0 text-xl">lock</span>
                         </div>
                         <span className="text-xs font-bold text-primary dark:text-white drop-shadow-md">Desbloquear Respuesta</span>
                      </div>
                    </div>
                  )
                }
                
                return (
                <div key={idx} className={`flex flex-col gap-2 max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"}`}>
                   {cleanText && (
                     <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                       msg.role === "user" 
                        ? "bg-primary text-white rounded-br-sm shadow-md" 
                        : "bg-white dark:bg-white/10 text-text-dark dark:text-text-light border border-[#d9cdea] dark:border-white/10 rounded-bl-sm shadow-sm"
                     }`}>
                       {cleanText}
                     </div>
                   )}
                   
                   {/* Injected Action Buttons (Rendered only on AI responses) */}
                   {(hasProjectsBtn || hasWhatsappBtn) && msg.role === "model" && (
                     <div className="flex flex-col gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
                        {hasProjectsBtn && (
                           <button 
                             onClick={() => {
                               if (window.history.state?.chatOpen) window.history.back(); else setIsOpen(false);
                               setTimeout(() => {
                                 document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
                               }, 400); // Darle tiempo al chat a cerrarse suavemente antes del scroll
                             }} 
                             className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-primary/30 text-primary dark:text-white/90 shadow-sm hover:bg-primary/10 transition-all hover:-translate-y-0.5"
                           >
                             <span className="material-symbols-outlined text-[16px]">grid_view</span>
                             Conocer Proyectos
                           </button>
                        )}
                        {hasWhatsappBtn && (
                           <a 
                             href="https://wa.me/5493885056441" 
                             target="_blank" 
                             rel="noreferrer" 
                             className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 text-xs"
                           >
                             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-sm">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                             </svg>
                             Hablar vía WhatsApp
                           </a>
                        )}
                     </div>
                   )}
                </div>
                )
              })}
              
              {isLoading && (
                <div className="flex self-start max-w-[85%]">
                  <div className="px-4 py-3.5 rounded-2xl text-sm bg-white dark:bg-white/10 text-text-dark dark:text-text-light border border-[#d9cdea] dark:border-white/10 rounded-bl-sm shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div> {/* Fin de Messages Area */}
              </div>
            </div>
          </div>

          {/* Modales trasladados FUERA del div con scroll para solucionar bug de visualización */}
          {/* Modal Prompt Explorer */}
          {showPromptModal && (
            <div className="absolute inset-0 z-[70] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in zoom-in-95">
              <div className="bg-white dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-2xl p-5 shadow-xl flex-1 flex flex-col relative overflow-hidden">
                <button 
                  onClick={() => setShowPromptModal(false)}
                  className="absolute top-3 right-3 text-text-dark/50 dark:text-text-light/50 hover:text-primary transition-colors z-10 p-2"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                  <h4 className="font-bold text-text-dark dark:text-text-light text-sm">System Prompt</h4>
                </div>
                
                <p className="text-xs text-text-dark/70 dark:text-text-light/70 mb-3 text-balance leading-relaxed pr-6">
                  Así es como programé el comportamiento de esta IA. Imagina definir tus propias reglas, productos y tono de voz para la IA de tu negocio:
                </p>
                
                <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 border border-[#d9cdea] dark:border-white/10 overflow-y-auto w-full relative shadow-inner">
                   <code className="text-[11px] md:text-xs text-[#a5d6ff] whitespace-pre-wrap font-mono block leading-relaxed">
                     {SYSTEM_PROMPT}
                   </code>
                </div>
              </div>
            </div>
          )}

          {/* Modal/Popup Paywall superpuesto */}
          {showLeadModal && (
            <div className="absolute inset-0 z-[65] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in zoom-in-95">
              <div className="bg-white dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">auto_awesome</span>
                  <h4 className="font-bold text-text-dark dark:text-text-light">¡No pierdas tu conversación!</h4>
                  <p className="text-xs text-text-dark/60 dark:text-text-light/60 mt-1">
                    Ingresa tus datos para continuar chateando gratis con nuestro experto IA y recibir asesoramiento.
                  </p>
                </div>
                
                <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                  <input required type="text" placeholder="Tu Nombre" value={leadName} onChange={e => setLeadName(e.target.value)}
                         className="bg-background-light dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-xl px-3 py-2 text-sm text-text-dark dark:text-text-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input required type="email" placeholder="Tu Email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)}
                         className="bg-background-light dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-xl px-3 py-2 text-sm text-text-dark dark:text-text-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input required type="tel" placeholder="Tu Teléfono (WhatsApp)" value={leadPhone} onChange={e => setLeadPhone(e.target.value)}
                         className="bg-background-light dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-xl px-3 py-2 text-sm text-text-dark dark:text-text-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  
                  <button type="submit" disabled={leadLoading} className="mt-2 bg-primary text-white font-bold py-2.5 rounded-xl shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    {leadLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>Continuar <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                    )}
                  </button>
                  
                  <button type="button" onClick={() => setShowLeadModal(false)} className="text-xs text-text-dark/40 dark:text-text-light/40 hover:underline">
                    Ahora no, gracias
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* --- BOTTOM PORTION: Always visible Input --- */}
          <form 
            onSubmit={handleSend} 
            onClick={() => { if(!isOpen) setIsOpen(true); }}
            className={`relative flex items-center p-2 transition-colors cursor-text shrink-0 z-20 ${isOpen ? 'bg-white dark:bg-[#1f162d]' : 'hover:bg-white/50 dark:hover:bg-[#1f162d]/90'}`}
          >
            <div className="pl-4 pr-2 text-primary dark:text-primary/80 shrink-0">
              <span className="material-symbols-outlined font-bold">auto_awesome</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a nuestra IA sobre soluciones a medida..."
              className={`flex-1 bg-transparent border-none focus:ring-0 text-text-dark dark:text-text-light py-3 px-2 text-base md:text-lg placeholder:text-text-dark/40 dark:placeholder:text-text-light/30 outline-none ${!isOpen && 'cursor-pointer'}`}
              disabled={showLeadModal}
              readOnly={!isOpen}
            />
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && isOpen) || showLeadModal}
              className={`bg-primary text-white w-10 h-10 md:w-11 md:h-11 p-0 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20 mr-5 md:mr-1 flex items-center justify-center shrink-0 ${(!input.trim() && isOpen && !isLoading) ? 'opacity-50 scale-100' : 'opacity-100'}`}
              onClick={(e) => {
                if(!isOpen) {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                 <span className="material-symbols-outlined text-xl">arrow_forward</span>
              )}
            </button>
          </form>

        </div>
      </div>
      
      {/* Subtext under closed input */}
      {/* <div className={`transition-[grid-template-rows,margin,opacity] duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none' : 'grid-rows-[1fr] opacity-100 mt-2 pointer-events-auto'}`}>
        <div className="overflow-hidden flex justify-center w-full">
          <div className="pt-1 pb-1 flex justify-center">
            <p className="text-[10px] md:text-xs text-text-dark/80 dark:text-text-light/80 font-semibold tracking-wide drop-shadow-sm bg-white/60 dark:bg-black/60 py-1.5 px-4 rounded-full backdrop-blur-sm border border-white/20 whitespace-nowrap">
              Recomendaciones impulsadas por IA según tus necesidades
            </p>
          </div>
        </div>
      </div> */}

    </div>
  );
}
