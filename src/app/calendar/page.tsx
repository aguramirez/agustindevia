"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
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
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar");
  const [loading, setLoading] = useState(true);
  
  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/calendar')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setLoading(false);
          return;
        }
        setRawAppointments(data);
        const calendarEvents = data.map((apt: any) => {
          const start = new Date(apt.date);
          const [hours, minutes] = apt.time.split(':');
          start.setHours(parseInt(hours), parseInt(minutes), 0);
          
          const end = new Date(start);
          end.setHours(start.getHours() + 1);

          return {
            title: `${apt.name} - ${apt.business}`,
            start,
            end,
            resource: apt,
          };
        });
        setEvents(calendarEvents);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      await fetch(`/api/calendar/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setSelectedEvent(null);
      fetchEvents();
    } catch (e) {
      alert("Error al actualizar");
    }
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
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Panel móvil y web de gestión de llamadas agendadas
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="flex-1 sm:flex-none bg-gray-100 dark:bg-white/10 text-text-dark dark:text-text-light px-3 py-2 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Horarios
            </button>
            <button 
              onClick={() => setIsBookingOpen(true)} 
              className="flex-1 sm:flex-none bg-primary dark:bg-violet-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors shadow-lg shadow-violet-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nuevo Turno
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Desktop & Mobile) */}
        <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 gap-2">
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
          /* List View for Mobile & Quick Reading */
          <div className="space-y-3">
            {rawAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-gray-500">event_busy</span>
                <p>Todavía no hay llamadas agendadas.</p>
              </div>
            ) : (
              rawAppointments.map((apt: any) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] hover:border-violet-500/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
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
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span>🏢 {apt.business}</span>
                      <span>•</span>
                      <span>✉️ {apt.email}</span>
                    </p>
                    <p className="text-xs font-semibold text-violet-400 mt-1">
                      🕒 {format(new Date(apt.date), "dd/MM/yyyy")} a las {apt.time} hs (Arg)
                      {apt.timezone && apt.clientTime && ` | ${apt.clientTime} hs (${apt.timezone.split('/').pop()?.replace(/_/g, ' ')})`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-white/10">
                    {apt.meetUrl && (
                      <a
                        href={apt.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">videocam</span>
                        <span>Meet</span>
                      </a>
                    )}
                    <a
                      href={`https://wa.me/${apt.whatsapp?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold flex items-center gap-1"
                    >
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSelectedEvent(apt)}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-xs font-bold"
                    >
                      Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#130d22] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-white/10">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-violet-500/10">
              <h2 className="text-lg font-bold text-text-dark dark:text-text-light flex items-center gap-2">
                <span className="material-symbols-outlined text-violet-400">event</span>
                Detalles del Turno
              </h2>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-sm text-text-dark dark:text-text-light">
              <p><strong>Cliente:</strong> {selectedEvent.name}</p>
              <p><strong>Rubro:</strong> {selectedEvent.business}</p>
              <p>
                <strong>WhatsApp:</strong> 
                <a href={`https://wa.me/${selectedEvent.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline ml-2">
                  {selectedEvent.whatsapp}
                </a>
              </p>
              <p><strong>Email:</strong> {selectedEvent.email}</p>
              <p><strong>Fecha y Hora (Argentina):</strong> {format(new Date(selectedEvent.date), "dd/MM/yyyy")} - {selectedEvent.time} hs</p>
              {selectedEvent.timezone && selectedEvent.clientTime && (
                <>
                  <p><strong>Hora Cliente:</strong> {selectedEvent.clientTime} hs</p>
                  <p><strong>Zona Horaria:</strong> {selectedEvent.timezone}</p>
                </>
              )}
              <p>
                <strong>Estado:</strong> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${selectedEvent.status === 'CONFIRMED' ? 'bg-green-950/40 text-green-400' : selectedEvent.status === 'CANCELLED' ? 'bg-red-950/40 text-red-400' : 'bg-yellow-950/40 text-yellow-400'}`}>
                  {selectedEvent.status}
                </span>
              </p>
              {selectedEvent.meetUrl && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    <span>Google Meet Programado:</span>
                  </div>
                  <a 
                    href={selectedEvent.meetUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-300 underline font-mono break-all hover:text-white"
                  >
                    {selectedEvent.meetUrl}
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-2 bg-gray-50 dark:bg-black/30">
              <button onClick={() => handleDelete(selectedEvent.id)} className="px-3.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/30">
                Eliminar
              </button>
              {selectedEvent.status !== 'CONFIRMED' && (
                <button onClick={() => handleStatusChange(selectedEvent.id, 'CONFIRMED')} className="px-3.5 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600">
                  Confirmar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
