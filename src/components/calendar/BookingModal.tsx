"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday, parseISO, isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"date" | "time" | "form" | "confirm" | "success">("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    whatsapp: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Generamos los próximos 14 días para mostrar en el selector
  const today = startOfToday();
  const nextDays = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  // Simularemos horarios por ahora (luego vendrán de la base de datos)
  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes([]);
      fetch(`/api/calendar/slots?date=${selectedDate.toISOString()}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAvailableTimes(data);
          }
        })
        .catch(e => console.error("Error fetching slots", e));
    }
  }, [selectedDate]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === "date" && selectedDate) setStep("time");
    else if (step === "time" && selectedTime) setStep("form");
    else if (step === "form") {
      if (!formData.whatsapp || formData.whatsapp.length < 10) {
        alert("Por favor ingresa un número de WhatsApp válido.");
        return;
      }
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "time") setStep("date");
    else if (step === "form") setStep("time");
    else if (step === "confirm") setStep("form");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: selectedDate?.toISOString(),
          time: selectedTime,
        }),
      });
      if (response.ok) {
        setStep("success");
      } else {
        alert("Hubo un error al agendar la llamada.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-background-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-text-dark dark:text-text-light">
            Agendar Llamada
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* STEP 1: DATE */}
          {step === "date" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h3 className="font-bold text-text-dark dark:text-text-light mb-2">Selecciona un día</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nextDays.map((date) => {
                  // Evitamos sábados y domingos para la demo
                  const day = date.getDay();
                  if (day === 0 || day === 6) return null;
                  
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/10 text-primary dark:text-violet-300 dark:bg-violet-500/20" 
                          : "border-gray-200 dark:border-white/10 hover:border-primary/50 text-text-dark dark:text-text-light"
                      }`}
                    >
                      <span className="text-xs uppercase font-medium">{format(date, "EEE")}</span>
                      <span className="text-xl font-bold">{format(date, "d")}</span>
                      <span className="text-xs">{format(date, "MMM")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: TIME */}
          {step === "time" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="bg-primary/5 dark:bg-violet-500/10 p-3 rounded-lg border border-primary/20 flex gap-2 items-center text-sm text-primary dark:text-violet-300">
                <span className="material-symbols-outlined text-base">info</span>
                <span>Todos los horarios corresponden a <strong>Argentina (UTC-3)</strong>.</span>
              </div>
              
              <h3 className="font-bold text-text-dark dark:text-text-light mt-2">
                Horarios para el {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
              </h3>
              
              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl border font-bold transition-all ${
                        selectedTime === time
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 dark:border-white/10 hover:border-primary/50 text-text-dark dark:text-text-light"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 my-8">No hay horarios disponibles para este día.</p>
              )}
            </div>
          )}

          {/* STEP 3: FORM */}
          {step === "form" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <style>{`
                .PhoneInputInput {
                  background: transparent;
                  border: none;
                  outline: none;
                  width: 100%;
                  color: inherit;
                }
              `}</style>
              <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl mb-2 text-sm text-text-dark dark:text-text-light">
                <p><strong>Fecha:</strong> {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}</p>
                <p><strong>Hora:</strong> {selectedTime} (Hora Argentina)</p>
              </div>

              <form id="booking-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-dark dark:text-text-light">Nombre completo</label>
                  <input required type="text" className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black/20 text-text-dark dark:text-text-light focus:outline-none focus:border-primary" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-dark dark:text-text-light">Rubro del negocio</label>
                  <input required type="text" className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black/20 text-text-dark dark:text-text-light focus:outline-none focus:border-primary" 
                    value={formData.business} onChange={e => setFormData({...formData, business: e.target.value})} placeholder="Ej. Clínica Dental, E-commerce..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-dark dark:text-text-light">WhatsApp</label>
                  <div className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black/20 text-text-dark dark:text-text-light focus-within:border-primary transition-colors">
                    <PhoneInput
                      international
                      defaultCountry="AR"
                      value={formData.whatsapp}
                      onChange={value => setFormData({...formData, whatsapp: value || ""})}
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-dark dark:text-text-light">Email</label>
                  <input required type="email" className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black/20 text-text-dark dark:text-text-light focus:outline-none focus:border-primary" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="tu@email.com" />
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: CONFIRM */}
          {step === "confirm" && (
            <div className="flex flex-col gap-4 animate-fade-in text-text-dark dark:text-text-light">
              <h3 className="font-bold text-lg mb-2">Verifica tus datos</h3>
              <div className="bg-primary/5 dark:bg-violet-500/10 p-4 rounded-xl border border-primary/20 flex flex-col gap-2">
                <p><strong>Nombre:</strong> {formData.name}</p>
                <p><strong>Rubro:</strong> {formData.business}</p>
                <p><strong>WhatsApp:</strong> {formData.whatsapp}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <hr className="border-gray-200 dark:border-white/10 my-2" />
                <p><strong>Fecha:</strong> {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}</p>
                <p><strong>Hora:</strong> {selectedTime} hs (Argentina)</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Por favor, asegúrate de que tu número de WhatsApp es correcto, ya que te enviaremos la confirmación y los recordatorios por ese medio. Si notas algún error, haz clic en "Volver" para editarlo.
              </p>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-text-dark dark:text-text-light">¡Turno Agendado!</h3>
              <p className="text-text-dark/70 dark:text-text-light/70">
                Te enviamos un mensaje por WhatsApp con los detalles de la reserva. ¡Hablamos pronto!
              </p>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {step !== "success" && (
          <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between gap-3 bg-gray-50 dark:bg-black/20">
            {step !== "date" ? (
              <button onClick={handleBack} className="px-6 py-2 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                Volver
              </button>
            ) : (
              <div></div> // Spacer
            )}
            
            {step === "date" && (
              <button onClick={handleNext} disabled={!selectedDate} className="px-6 py-2 rounded-lg font-bold bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                Siguiente
              </button>
            )}
            
            {step === "time" && (
              <button onClick={handleNext} disabled={!selectedTime} className="px-6 py-2 rounded-lg font-bold bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                Continuar
              </button>
            )}
            
            {step === "form" && (
              <button type="submit" form="booking-form" className="px-6 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary/90 transition-colors">
                Revisar Datos
              </button>
            )}

            {step === "confirm" && (
              <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 rounded-lg font-bold bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors">
                {loading ? "Procesando..." : "Confirmar Reserva"}
              </button>
            )}
          </div>
        )}
        
        {step === "success" && (
          <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-center bg-gray-50 dark:bg-black/20">
             <button onClick={onClose} className="px-8 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary/90 transition-colors">
                Cerrar
              </button>
          </div>
        )}

      </div>
    </div>
  );
}
