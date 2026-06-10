"use client";

import BookingModal from "@/components/calendar/BookingModal";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AgendarPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative group/design-root">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* El BookingModal tiene position fixed, así que tomará toda la pantalla.
          Le pasamos isOpen={true} permanentemente. Si cierran, los mandamos al inicio. */}
      <BookingModal isOpen={true} onClose={() => window.location.href = '/'} />
    </div>
  );
}
