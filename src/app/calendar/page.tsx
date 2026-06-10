"use client";

import { useState, useEffect } from "react";
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
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const fetchEvents = () => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
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
          }
        });
        setEvents(calendarEvents);
      })
      .catch(err => console.error(err));
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
    <div className="p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark dark:text-text-light">Agenda de Turnos</h1>
          <div className="flex gap-3">
            <button onClick={() => setIsSettingsOpen(true)} className="bg-gray-200 dark:bg-white/10 text-text-dark dark:text-text-light px-4 py-2 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-white/20 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">settings</span>
              Configuración
            </button>
            <button onClick={() => setIsBookingOpen(true)} className="bg-primary dark:bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">add</span>
              Nuevo Turno
            </button>
          </div>
        </div>
        
        <div className="h-[600px] rbc-custom-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="es"
            messages={{
              next: "Siguiente",
              previous: "Anterior",
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
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-primary/10 dark:bg-violet-500/20">
              <h2 className="text-xl font-bold text-text-dark dark:text-text-light flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-violet-300">event</span>
                Detalles del Turno
              </h2>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-text-dark dark:text-text-light">
              <p><strong>Cliente:</strong> {selectedEvent.name}</p>
              <p><strong>Rubro:</strong> {selectedEvent.business}</p>
              <p>
                <strong>WhatsApp:</strong> 
                <a href={`https://wa.me/${selectedEvent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-primary dark:text-violet-400 hover:underline ml-2">
                  {selectedEvent.whatsapp}
                </a>
              </p>
              <p><strong>Email:</strong> {selectedEvent.email}</p>
              <p><strong>Fecha y Hora:</strong> {format(new Date(selectedEvent.date), "dd/MM/yyyy")} - {selectedEvent.time} hs</p>
              <p>
                <strong>Estado:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${selectedEvent.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : selectedEvent.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selectedEvent.status}
                </span>
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-black/20">
              <button onClick={() => handleDelete(selectedEvent.id)} className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600">Eliminar</button>
              {selectedEvent.status !== 'CONFIRMED' && (
                 <button onClick={() => handleStatusChange(selectedEvent.id, 'CONFIRMED')} className="px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600">Confirmar</button>
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
          fetchEvents(); // Refrescar calendario al cerrar
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
