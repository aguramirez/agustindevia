"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import BookingModal from "@/components/calendar/BookingModal";
import SettingsModal from "@/components/calendar/SettingsModal";

const locales = {
  "es": es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [rawAppointments, setRawAppointments] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("list");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedMeet, setCopiedMeet] = useState(false);

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Ordenar por fecha de creación descendente (la última llamada agendada arriba de todo)
        const sortedByCreation = [...data].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        setRawAppointments(sortedByCreation);

        const calendarEvents = data.map((apt: any) => {
          const start = new Date(apt.date);
          const [hours, minutes] = (apt.time || "09:00").split(':');
          start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
          
          const end = new Date(start);
          end.setHours(start.getHours() + 1);

          return {
            title: `${apt.name} - ${apt.business || "General"}`,
            start,
            end,
            resource: apt,
          };
        });
        setEvents(calendarEvents);
      }
    } catch (err) {
      console.error("Error al cargar los turnos:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Polling automático cada 15 segundos + refetch al enfocar la app
  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      fetchEvents(true);
    }, 15000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchEvents(true);
      }
    };

    window.addEventListener("focus", handleVisibility);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleVisibility);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este turno?")) return;
    try {
      await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      setSelectedEvent(null);
      fetchEvents();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/calendar/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(updated);
      }
      fetchEvents(true);
    } catch (e) {
      alert("Error al actualizar");
    }
  };

  const handleCopyMeet = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMeet(true);
    setTimeout(() => setCopiedMeet(false), 2500);
  };

  // Helper para generar enlaces con mensaje prellenado
  const getClientNotificationLinks = (apt: any) => {
    const meet = apt.meetUrl || "https://meet.google.com/new";
    const dateFormatted = format(new Date(apt.date), "dd/MM/yyyy");
    const textMsg = `Hola ${apt.name}! Tu llamada 1:1 con Agustín Dev está confirmada para el ${dateFormatted} a las ${apt.time} hs (Argentina).\n\nEnlace de Google Meet para ingresar:\n${meet}\n\n¡Nos vemos!`;
    
    const waLink = `https://wa.me/${apt.whatsapp?.replace(/\D/g, "")}?text=${encodeURIComponent(textMsg)}`;
    const emailLink = `mailto:${apt.email}?subject=${encodeURIComponent("Confirmación de Llamada 1:1 - Agustín Dev")}&body=${encodeURIComponent(textMsg)}`;

    return { waLink, emailLink, meet };
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 relative min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-dark dark:text-text-light flex items-center gap-2">
              <span className="text-violet-500">📅</span> Agenda de Turnos
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>Panel móvil de gestión de llamadas</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-400 text-xs font-semibold">En vivo</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Botón de Actualizar manual */}
            <button
              onClick={() => fetchEvents()}
              disabled={isRefreshing}
              className="bg-gray-100 dark:bg-white/10 text-text-dark dark:text-text-light px-3 py-2 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all"
              title="Actualizar llamadas"
            >
              <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin text-violet-400' : ''}`}>
                refresh
              </span>
              <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="bg-gray-100 dark:bg-white/10 text-text-dark dark:text-text-light px-3 py-2 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Horarios
            </button>
            <button 
              onClick={() => setIsBookingOpen(true)} 
              className="bg-primary dark:bg-violet-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors shadow-lg shadow-violet-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nuevo Turno
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Desktop & Mobile) */}
        <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-2.5 px-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "list"
                ? "border-violet-500 text-violet-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            Lista de Llamadas ({rawAppointments.length})
            <span className="ml-1 text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full font-mono">
              Nuevas arriba
            </span>
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`pb-2.5 px-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "calendar"
                ? "border-violet-500 text-violet-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            Calendario
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Cargando turnos...</p>
          </div>
        ) : activeTab === "calendar" ? (
          <div className="h-[520px] sm:h-[620px] rbc-custom-wrapper">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              culture="es"
              messages={{
                next: "Sig.",
                previous: "Ant.",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                noEventsInRange: "No hay turnos agendados en esta fecha.",
              }}
              onSelectEvent={(event) => setSelectedEvent(event.resource)}
            />
          </div>
        ) : (
          /* List View for Mobile & Quick Reading - Newest booked first! */
          <div className="space-y-3">
            {rawAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-gray-500">event_busy</span>
                <p>Todavía no hay llamadas agendadas.</p>
              </div>
            ) : (
              rawAppointments.map((apt: any, index: number) => {
                const isNewest = index === 0;
                const { waLink, emailLink } = getClientNotificationLinks(apt);

                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative ${
                      isNewest
                        ? "border-violet-500/50 bg-violet-500/[0.05] shadow-sm shadow-violet-500/10"
                        : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] hover:border-violet-500/40"
                    }`}
                  >
                    {isNewest && (
                      <span className="absolute -top-2.5 left-4 bg-violet-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        Última Agendada
                      </span>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-base text-text-dark dark:text-text-light">
                          {apt.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            apt.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : apt.status === "CANCELLED"
                              ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                          }`}
                        >
                          {apt.status}
                        </span>
                        {apt.createdAt && (
                          <span className="text-[11px] text-gray-400 ml-auto">
                            Agendó: {format(new Date(apt.createdAt), "dd/MM HH:mm")} hs
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2">
                        <span>🏢 {apt.business || "Sin negocio"}</span>
                        <span>•</span>
                        <span>✉️ {apt.email}</span>
                      </p>
                      <p className="text-xs font-semibold text-violet-400 mt-1">
                        📅 Llamada: {format(new Date(apt.date), "dd/MM/yyyy")} a las {apt.time} hs (Arg)
                        {apt.timezone && apt.clientTime && ` | ${apt.clientTime} hs (${apt.timezone.split('/').pop()?.replace(/_/g, ' ')})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-white/10 flex-wrap">
                      {apt.meetUrl && (
                        <a
                          href={apt.meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">videocam</span>
                          <span>Entrar a Meet</span>
                        </a>
                      )}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold flex items-center gap-1"
                      >
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={emailLink}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-xs font-bold flex items-center gap-1"
                        title="Enviar invitación por email"
                      >
                        <span className="material-symbols-outlined text-[15px]">mail</span>
                      </a>
                      <button
                        onClick={() => setSelectedEvent(apt)}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-xs font-bold"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (() => {
        const { waLink, emailLink, meet } = getClientNotificationLinks(selectedEvent);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#130d22] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-white/10 max-h-[90vh]">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-violet-500/10">
                <h2 className="text-lg font-bold text-text-dark dark:text-text-light flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-400">event</span>
                  Detalles del Turno
                </h2>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 flex flex-col gap-3 text-sm text-text-dark dark:text-text-light overflow-y-auto">
                <p><strong>Cliente:</strong> {selectedEvent.name}</p>
                <p><strong>Rubro:</strong> {selectedEvent.business || "No especificado"}</p>
                <p>
                  <strong>WhatsApp:</strong> 
                  <a href={waLink} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline ml-2">
                    {selectedEvent.whatsapp}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong> 
                  <a href={emailLink} className="text-violet-400 hover:underline ml-2">
                    {selectedEvent.email}
                  </a>
                </p>
                <p><strong>Fecha y Hora (Argentina):</strong> {format(new Date(selectedEvent.date), "dd/MM/yyyy")} - {selectedEvent.time} hs</p>
                {selectedEvent.timezone && selectedEvent.clientTime && (
                  <>
                    <p><strong>Hora Cliente:</strong> {selectedEvent.clientTime} hs</p>
                    <p><strong>Zona Horaria:</strong> {selectedEvent.timezone}</p>
                  </>
                )}
                {selectedEvent.createdAt && (
                  <p className="text-xs text-gray-400">
                    <strong>Agendado el:</strong> {format(new Date(selectedEvent.createdAt), "dd/MM/yyyy HH:mm:ss")} hs
                  </p>
                )}
                <p>
                  <strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                    selectedEvent.status === 'CONFIRMED' 
                      ? 'bg-green-950/40 text-green-400 border border-green-500/30' 
                      : selectedEvent.status === 'CANCELLED' 
                      ? 'bg-red-950/40 text-red-400 border border-red-500/30' 
                      : 'bg-yellow-950/40 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {selectedEvent.status}
                  </span>
                </p>

                {/* Google Meet Section */}
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">videocam</span>
                      Google Meet:
                    </span>
                    <button
                      onClick={() => handleCopyMeet(meet)}
                      className="text-[11px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 transition-colors"
                    >
                      {copiedMeet ? "✓ ¡Copiado!" : "Copiar enlace"}
                    </button>
                  </div>
                  <a 
                    href={meet} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-300 underline font-mono break-all hover:text-white"
                  >
                    {meet}
                  </a>

                  {/* 1-Click Notifications to Client */}
                  <div className="pt-2 border-t border-blue-500/20 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-gray-300">
                      Enviar confirmación y link al cliente:
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={emailLink}
                        className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span>Enviar Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between gap-2 bg-gray-50 dark:bg-black/30">
                <button onClick={() => handleDelete(selectedEvent.id)} className="px-3.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/30">
                  Eliminar
                </button>
                <div className="flex gap-2">
                  {selectedEvent.status !== 'CONFIRMED' && (
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'CONFIRMED')} className="px-3.5 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 shadow-md">
                      Confirmar y Generar Meet
                    </button>
                  )}
                  {selectedEvent.status === 'CONFIRMED' && (
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'PENDING')} className="px-3 py-1.5 bg-gray-500/20 text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-500/30">
                      Pasar a Pendiente
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Manual Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => {
          setIsBookingOpen(false);
          fetchEvents();
        }} 
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
