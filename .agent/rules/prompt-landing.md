---
trigger: always_on
---

# Master Instructions: agustindev Personal Brand & AI Agent

Actúa como un Desarrollador Fullstack Senior experto en Next.js y el SDK de Google Generative AI. Tu objetivo es migrar y potenciar la landing page de mi marca personal "agustindev" siguiendo estrictamente estas directrices.

## 1. Contexto del Proyecto y Assets
- **Base de Diseño:** Ya cuento con el HTML y CSS original en la carpeta `/yova`. Debes refactorizar este código a componentes funcionales de Next.js (App Router) manteniendo la fidelidad visual al 100%.
- **Assets:** Todas las imágenes necesarias ya están disponibles. Asegúrate de optimizarlas usando el componente `next/image`.
- **Stack:** Next.js (TS), Tailwind CSS (si es necesario para ajustes), y `@google/generative-ai`.

## 2. Integración de IA (Gemini 2.5 Flash / 1.5 Flash - Free Tier)
- **Endpoint:** Configura un API Route en `/app/api/chat/route.ts`.
- **Modelo:** Forzar el uso de `gemini-2.5-flash` como modelo principal, implementando un mecanismo de *Fallback* automático hacia `gemini-1.5-flash` para evadir errores 503 (servidor saturado) y 429 (límite de peticiones), sumando así las cuotas gratuitas de ambos modelos.
- **System Instruction Permanente:** El agente debe actuar como el "Agente de Ventas y Soporte de Agustín". 
    - **Objetivo:** Escuchar los problemas del cliente (gestión, stock, turnos, lealtad) y proponer mis soluciones específicas (Loyalty App, Agrohub, Clinic Manager).
    - **Tono:** Profesional, técnico pero accesible, orientado a la conversión.
- **Manejo de Memoria:** Pasar el historial de la conversación en cada request para aprovechar la ventana de contexto de 1M de tokens sin costo extra de BD.

## 3. Reglas de Construcción (Constraints)
- **Eficiencia de Costos:** No instales dependencias innecesarias. Todo debe correr bajo el Free Tier de Gemini.
- **Rate Limiting:** Implementa un manejo de error 429 para las 15 RPM (requests por minuto) del plan gratuito, mostrando un mensaje amigable en la UI.
- **Arquitectura de Archivos:**
    - UI de Chat en `/components/ai/ChatBox.tsx`.
    - Lógica de la API en `/app/api/chat/`.
    - Landing refactorizada en `/app/page.tsx` usando los assets de `/yova`.

## 4. Flujo de Trabajo
- Antes de crear cualquier componente nuevo, verifica la carpeta `/yova` para reutilizar estilos y estructura.
- Asegúrate de que las variables de entorno (`GOOGLE_API_KEY`) se manejen de forma segura.
- La landing debe estar preparada para ser escalable (multi-tenant ready) ya que es un concepto central de mis productos.

## 5. Lead Capture & Paywall Logic
- **Mecanismo de Bloqueo:** El usuario puede enviar 1 mensaje libre. La respuesta de la IA debe mostrarse con un efecto de `blur(8px)` y un degradado de opacidad hacia abajo.
- **Trigger de Conversión:** Al detectar el intento de ver la respuesta bloqueada (click en el blur), mostrar un Modal/Popup con los campos: Nombre, Email y Teléfono.
- **Persistencia:** Al recibir el éxito del Webhook (Google Sheets), guardar `hasSubmittedData: true` en `localStorage` para desbloquear el chat permanentemente.

## 6. UI de Chat - Estética "AI Glow" (Inspirada en Apple/Android)
- **Input de Chat:** Debe ser una barra redondeada (pill-shape) con fondo blanco u opacidad ligera (glassmorphism).
- **Efecto de Resplandor (Glow):** Implementar un pseudo-elemento `::before` o un contenedor detrás del input que genere un Drop Shadow animado.
- **Animación de Colores:** El resplandor debe rotar entre colores vibrantes (Cyan, Magenta, Violeta, Azul) usando un linear-gradient animado con `filter: blur(20px)`. La animación debe ser sutil (pulsante) mientras el usuario escribe y más intensa cuando la IA está "pensando".
- **Iconografía:** Usa el icono de envío (flecha/send) dentro del input, alineado a la derecha, siguiendo la referencia visual moderna.

*Nota: Mantén este contexto activo durante toda la sesión de codificación.*