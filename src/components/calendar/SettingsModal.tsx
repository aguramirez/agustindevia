"use client";

import { useState, useEffect } from "react";

type Availability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [slotDuration, setSlotDuration] = useState(60);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/calendar/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings) setSlotDuration(data.settings.slotDuration);
          if (data.availability) setAvailabilities(data.availability);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/calendar/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotDuration, availability: availabilities })
      });
      alert("Configuración guardada exitosamente");
      onClose();
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const updateDay = (index: number, field: keyof Availability, value: any) => {
    const newAv = [...availabilities];
    newAv[index] = { ...newAv[index], [field]: value };
    setAvailabilities(newAv);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-background-dark rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-primary/10 dark:bg-violet-500/20">
          <h2 className="text-xl font-bold text-text-dark dark:text-text-light flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-violet-300">settings</span>
            Configuraciones del Calendario
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-text-dark dark:text-text-light flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-10">Cargando...</div>
          ) : (
            <>
              {/* Duración de turnos */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                <h3 className="font-bold mb-2">Duración de cada turno</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Selecciona de cuánto tiempo serán los bloques que pueden reservar tus clientes.
                </p>
                <div className="flex gap-4 items-center">
                  <select 
                    value={slotDuration} 
                    onChange={e => setSlotDuration(Number(e.target.value))}
                    className="p-2 border rounded-lg dark:bg-black/20 dark:border-white/20"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={90}>1 hora y media</option>
                    <option value={120}>2 horas</option>
                  </select>
                </div>
              </div>

              {/* Horarios por día */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                <h3 className="font-bold mb-4">Horarios de Atención</h3>
                <div className="flex flex-col gap-3">
                  {availabilities.map((av, idx) => (
                    <div key={av.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white dark:bg-black/20 rounded border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-3 w-40">
                        <input 
                          type="checkbox" 
                          checked={av.isActive} 
                          onChange={e => updateDay(idx, 'isActive', e.target.checked)}
                          className="w-5 h-5 accent-primary"
                        />
                        <span className={`font-bold ${!av.isActive && 'text-gray-400 line-through'}`}>
                          {DAYS[av.dayOfWeek]}
                        </span>
                      </div>
                      
                      <div className={`flex items-center gap-2 ${!av.isActive && 'opacity-50 pointer-events-none'}`}>
                        <input 
                          type="time" 
                          value={av.startTime}
                          onChange={e => updateDay(idx, 'startTime', e.target.value)}
                          className="p-1 border rounded dark:bg-black/40 dark:border-white/20"
                        />
                        <span>a</span>
                        <input 
                          type="time" 
                          value={av.endTime}
                          onChange={e => updateDay(idx, 'endTime', e.target.value)}
                          className="p-1 border rounded dark:bg-black/40 dark:border-white/20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-black/20">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || loading} className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
