"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("username") === "agustin" && fd.get("password") === "Antivirusracu58") {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 relative group/design-root">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="bg-white dark:bg-white/10 p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-white/10">
          <div className="flex justify-center mb-6 text-primary dark:text-violet-400">
            <span className="material-symbols-outlined text-5xl">lock</span>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-text-dark dark:text-text-light">Panel de Control</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium text-text-dark dark:text-text-light">Usuario</label>
              <input name="username" type="text" required className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/20 dark:bg-black/20 dark:text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-text-dark dark:text-text-light">Contraseña</label>
              <input name="password" type="password" required className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/20 dark:bg-black/20 dark:text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <button type="submit" className="w-full p-3 bg-primary text-white rounded-lg font-bold mt-2 hover:bg-primary/90 transition-colors">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark group/design-root">
      <header className="bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="/" className="text-primary dark:text-violet-400 flex items-center hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-2xl mr-2">arrow_back</span>
            <span className="font-bold text-lg text-text-dark dark:text-text-light">Volver a la Web</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => { localStorage.removeItem("admin_auth"); setIsAuthenticated(false); }} 
            className="text-sm font-bold text-red-500 hover:text-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
