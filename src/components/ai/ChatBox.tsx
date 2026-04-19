"use client";

import { useState, useRef, useEffect } from "react";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

type Role = "user" | "model";

interface Message {
  role: Role;
  parts: { text: string }[];
  isLocked?: boolean;
  isError?: boolean;
}

// ── Markdown inline renderer ──────────────────────────────────────────────────
// Handles **bold** and *italic* across lines, preserving newlines.
function renderMarkdown(text: string): React.ReactNode {
  // Split by newline first so we can insert <br> between lines
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const nodes: React.ReactNode[] = [];
    // Regex: match **bold** OR *italic*  (bold must come first in alternation)
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) nodes.push(line.slice(last, m.index));
      if (m[1] !== undefined) {
        nodes.push(<strong key={i++} className="font-bold">{m[1]}</strong>);
      } else {
        nodes.push(<em key={i++}>{m[2]}</em>);
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) nodes.push(line.slice(last));

    return (
      <span key={lineIdx}>
        {nodes.length > 0 ? nodes : line}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ── Parser de Botones ─────────────────────────────────────────────────────────
function parseButtons(text: string): { cleanText: string, buttons: string[] } {
  const buttonRegex = /\[BUTTON:\s*(.+?)\]/g;
  const buttons: string[] = [];
  let match;
  
  while ((match = buttonRegex.exec(text)) !== null) {
    buttons.push(match[1].trim());
  }
  
  const cleanText = text.replace(buttonRegex, "").trim();
  
  return { cleanText, buttons };
}

// ── localStorage helpers (chat persiste 12 h) ─────────────────────────────────
const LS_KEY = "chat_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

interface ChatSession {
  messages: Message[];
  expiresAt: number;
}

const INITIAL_MESSAGE: Message = {
  role: "model",
  parts: [{ text: "¡Hola! 👋 Soy el asistente de AgustinDev.\nPara ayudarte mejor, contame:\n¿En qué rubro trabajás y qué problema específico estás buscando resolver?" }],
};

function loadSession(): Message[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [INITIAL_MESSAGE];
    const session: ChatSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(LS_KEY);
      return [INITIAL_MESSAGE];
    }
    return session.messages;
  } catch {
    return [INITIAL_MESSAGE];
  }
}

function saveSession(messages: Message[]) {
  const session: ChatSession = {
    messages,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(session));
  } catch {
    // quota exceeded — silently ignore
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Paywall
  const [hasSubmittedData, setHasSubmittedData] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  // Prompt Explorer
  const [showPromptModal, setShowPromptModal] = useState(false);

  // Lead Form
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  // ── Scroll helpers ──────────────────────────────────────────────────────────
  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? "instant" : "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);
  useEffect(() => { if (isOpen) scrollToBottom(true); }, [isOpen]);

  // ── Cargar sesión desde localStorage en el mount ────────────────────────────
  useEffect(() => {
    const saved = loadSession();
    setMessages(saved);

    if (localStorage.getItem("hasSubmittedData") === "true") {
      setHasSubmittedData(true);
    }
  }, []);

  // ── Guardar sesión cada vez que cambian los mensajes ────────────────────────
  useEffect(() => {
    // No sobreescribir si solo tenemos el mensaje inicial y no hay sesión guardada
    const hasOnlyInitial = messages.length === 1 && messages[0].role === "model";
    if (!hasOnlyInitial) {
      saveSession(messages);
    }
  }, [messages]);

  // ── Body scroll lock + historial Android ───────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ chatOpen: true }, "");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!e.state?.chatOpen) setIsOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Input focus ─────────────────────────────────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen && window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessageCount = messages.filter(m => m.role === "user").length;
    if (userMessageCount >= 3 && !hasSubmittedData) {
      setShowLeadModal(true);
      return; // bloquear el envío hasta que se registren
    }

    const userMessage: Message = { role: "user", parts: [{ text: textToSend }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyItems: { role: Role; parts: { text: string }[] }[] = [];
      const cleanMessages = messages.slice(1).filter(m => !m.isError);

      for (const m of cleanMessages) {
        if (historyItems.length > 0 && historyItems[historyItems.length - 1].role === m.role) {
          historyItems[historyItems.length - 1].parts[0].text += "\n" + m.parts[0].text;
        } else {
          historyItems.push({ role: m.role, parts: [{ text: m.parts[0].text }] });
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: historyItems }),
      });

      const data = await res.json();
      const shouldLock = userMessageCount >= 3 && !hasSubmittedData;

      if (!res.ok) {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.error || "Hubo un error al procesar tu solicitud." }], isError: true }]);
      } else {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.text }], isLocked: shouldLock }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "model", parts: [{ text: "Error de conexión." }], isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput("");
    await sendMessage(currentInput);
  };

  // ── Dynamic Button Handler ──────────────────────────────────────────────────
  const handleButtonClick = (buttonText: string) => {
    switch (buttonText) {
      case "Ver ideas para mi rubro":
        sendMessage("Quiero ver ideas para mi rubro");
        break;
      case "No sé qué necesito":
        sendMessage("No sé qué necesito, ayudame");
        break;
      case "Ver ejemplo real":
        sendMessage("Mostrame un ejemplo real");
        break;
      case "Ver Proyectos":
        if (window.history.state?.chatOpen) window.history.back(); else setIsOpen(false);
        setTimeout(() => { document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" }); }, 400);
        break;
      case "Ver cómo funciono":
        setShowPromptModal(true);
        break;
      case "Hablar por WhatsApp":
        window.open("https://wa.me/5493885056441", "_blank");
        break;
      case "Instagram":
        window.open("https://instagram.com/agustindev", "_blank");
        break;
      default:
        sendMessage(buttonText);
        break;
    }
  };

  // ── Lead form submit ────────────────────────────────────────────────────────
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const formParams = new URLSearchParams();
      formParams.append("nombre", leadName);
      formParams.append("email", leadEmail);
      formParams.append("telefono", leadPhone);

      const historialChat = messages.map(m => {
        const emisor = m.role === "user" ? "👤 Cliente" : "🤖 IA";
        const { cleanText } = parseButtons(m.parts[0].text);
        return `${emisor}: ${cleanText}`;
      }).join("\n\n");
      formParams.append("historial", historialChat);

      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: "POST",
          body: formParams,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          mode: "no-cors",
        });
      }

      localStorage.setItem("hasSubmittedData", "true");
      setHasSubmittedData(true);
      setShowLeadModal(false);
      setMessages(prev => prev.map(m => ({ ...m, isLocked: false })));
    } catch (err) {
      console.error("Error webhook:", err);
    } finally {
      setLeadLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] md:w-[80%] lg:w-[60%] max-w-[800px] flex flex-col drop-shadow-2xl">

      {/* Main Box */}
      <div className="ai-glow-border relative rounded-2xl group transition-shadow duration-500">
        <div className="bg-white dark:bg-[#1f162d] rounded-[calc(1rem-2px)] flex flex-col w-full relative overflow-hidden">

          {/* TOP: Header + Messages (animated expand) */}
          <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
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

                {/* Messages */}
                <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto bg-background-light dark:bg-[#120a1a] relative">
                  {messages.map((msg, idx) => {
                    const { cleanText, buttons } = parseButtons(msg.parts[0].text);

                    if (msg.isLocked) {
                      return (
                        <div key={idx} className="flex self-start max-w-[85%] relative group cursor-pointer" onClick={() => setShowLeadModal(true)}>
                          <div className="p-3.5 rounded-2xl text-sm leading-relaxed bg-white dark:bg-white/10 text-text-dark dark:text-text-light border border-[#d9cdea] dark:border-white/10 rounded-bl-sm shadow-sm blur-sm opacity-50 relative select-none">
                            {renderMarkdown(cleanText)}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-[#120a1a] to-transparent rounded-2xl flex flex-col items-center justify-center gap-2 transition-all">
                            <div className="bg-primary/90 text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined shrink-0 text-xl">lock</span>
                            </div>
                            <span className="text-xs font-bold text-primary dark:text-white drop-shadow-md">Desbloquear Respuesta</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={idx} className={`flex flex-col gap-2 max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"}`}>
                        {cleanText && (
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-primary text-white rounded-br-sm shadow-md"
                              : "bg-white dark:bg-white/10 text-text-dark dark:text-text-light border border-[#d9cdea] dark:border-white/10 rounded-bl-sm shadow-sm"
                          }`}>
                            {renderMarkdown(cleanText)}
                          </div>
                        )}

                        {/* Injected Action Buttons */}
                        {buttons.length > 0 && msg.role === "model" && (
                          <div className="flex flex-col gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
                            {buttons.map((btnText, i) => {
                              if (btnText === "Hablar por WhatsApp") {
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handleButtonClick(btnText)}
                                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 text-xs"
                                  >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-sm">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Hablar por WhatsApp
                                  </button>
                                );
                              }
                              
                              if (btnText === "Instagram") {
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handleButtonClick(btnText)}
                                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 text-xs"
                                  >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-sm">
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                                    </svg>
                                    Ver en Instagram
                                  </button>
                                );
                              }

                              const iconMap: Record<string, string> = {
                                "Ver Proyectos": "grid_view",
                                "Ver ideas para mi rubro": "lightbulb",
                                "No sé qué necesito": "help",
                                "Ver ejemplo real": "visibility",
                                "Ver cómo funciono": "memory"
                              };
                              const iconName = iconMap[btnText] || "arrow_forward";

                              return (
                                <button
                                  key={i}
                                  onClick={() => handleButtonClick(btnText)}
                                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-primary/30 text-primary dark:text-white/90 shadow-sm hover:bg-primary/10 transition-all hover:-translate-y-0.5"
                                >
                                  <span className="material-symbols-outlined text-[16px]">{iconName}</span>
                                  {btnText}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
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
                </div>
              </div>
            </div>
          </div>

          {/* Modal – Prompt Explorer */}
          {showPromptModal && (
            <div className="absolute inset-0 z-[70] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in zoom-in-95">
              <div className="bg-white dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-2xl p-5 shadow-xl flex-1 flex flex-col relative overflow-hidden">
                <button onClick={() => setShowPromptModal(false)} className="absolute top-3 right-3 text-text-dark/50 dark:text-text-light/50 hover:text-primary transition-colors z-10 p-2">
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
                  <code className="text-[11px] md:text-xs text-[#a5d6ff] whitespace-pre-wrap font-mono block leading-relaxed">{SYSTEM_PROMPT}</code>
                </div>
              </div>
            </div>
          )}

          {/* Modal – Paywall */}
          {showLeadModal && (
            <div className="absolute inset-0 z-[65] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in zoom-in-95">
              <div className="bg-white dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">auto_awesome</span>
                  <h4 className="font-bold text-text-dark dark:text-text-light">¡No pierdas tu conversación!</h4>
                  <p className="text-xs text-text-dark/60 dark:text-text-light/60 mt-1">
                    Ingresa tus datos para <strong className="font-bold text-primary dark:text-primary/90 drop-shadow-sm">continuar chateando GRATIS</strong>.
                  </p>
                </div>
                <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                  <input required type="text" placeholder="Nombre" value={leadName} onChange={e => setLeadName(e.target.value)}
                    className="bg-background-light dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-xl px-3 py-2 text-sm text-text-dark dark:text-text-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input required type="email" placeholder="Email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)}
                    className="bg-background-light dark:bg-white/5 border border-[#d9cdea] dark:border-white/10 rounded-xl px-3 py-2 text-sm text-text-dark dark:text-text-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input required type="tel" placeholder="WhatsApp" value={leadPhone} onChange={e => setLeadPhone(e.target.value)}
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

          {/* BOTTOM: Input (always visible) */}
          <form
            onSubmit={handleSend}
            className={`relative flex items-center p-2 shrink-0 z-20 bg-white dark:bg-[#1f162d] ${isOpen ? "cursor-text" : "hover:bg-white/50 dark:hover:bg-[#1f162d]/90 cursor-pointer"}`}
          >
            <div className="pl-4 pr-2 text-primary dark:text-violet-300 shrink-0">
              <span className="material-symbols-outlined font-bold">auto_awesome</span>
            </div>
            <div className="flex-1 min-w-0 h-12 relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isOpen ? "Escribe tu mensaje..." : "Pregúntale a nuestra IA sobre soluciones a medida..."}
                className="w-full bg-transparent border-none focus:ring-0 text-text-dark dark:text-text-light px-2 text-base md:text-lg placeholder:text-text-dark/40 dark:placeholder:text-text-light/30 outline-none truncate disabled:opacity-100"
                readOnly={!isOpen}
                disabled={showLeadModal}
                tabIndex={isOpen ? 0 : -1}
              />
              {!isOpen && (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="absolute inset-0 w-full h-full bg-transparent cursor-pointer"
                  aria-label="Abrir chat con IA"
                />
              )}
            </div>
            <button
              type={isOpen ? "submit" : "button"}
              disabled={isLoading || (!input.trim() && isOpen) || showLeadModal}
              onClick={(e) => { if (!isOpen) { e.preventDefault(); setIsOpen(true); } }}
              className={`bg-primary text-white w-10 h-10 md:w-11 md:h-11 p-0 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20 mr-1 md:mr-2 flex items-center justify-center shrink-0 ${(!input.trim() && isOpen && !isLoading) ? "opacity-50 scale-100" : "opacity-100"}`}
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
    </div>
  );
}
