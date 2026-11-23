# agustindev — Sistema de Diseño & Manual de Marca (Design System Spec)

> **Documento Maestro de Estilo e Identidad Visual.**  
> Este archivo detalla exhaustivamente todos los fundamentos de diseño, paleta cromática, tipografías, componentes, efectos visuales y reglas de composición de la marca personal **agustindev**. Está optimizado para ser consumido como contexto por inteligencias artificiales para la generación consistente de interfaces, imágenes, diapositivas, PDFs, miniaturas y videos.

---

## 1. Concepto & Filosofía de Marca

- **Identidad:** Marca personal de **Agustín**, Desarrollador Full Stack Senior, Consultor Digital y Creador de Soluciones Móviles & SaaS con Inteligencia Artificial.
- **Naming oficial:** `agustindev` (estilizado en minúsculas en logos, URLs y redes: `@agustindev`).
- **Propuesta de valor:** *"Haz crecer tu negocio, no tus horas de trabajo. Aplicaciones web y móviles escalables con Inteligencia Artificial integrada."*
- **Personalidad visual:**
  - **Tecnológica & Futurista:** Uso de gradientes reactivos, efectos de resplandor luminiscente ("AI Glow") y modo oscuro profundo.
  - **Minimalista & Elegante:** Ausencia de ruido innecesario, alto contraste, micro-espaciado cuidado y jerarquía tipográfica precisa.
  - **Orientada a la Conversión:** Botones y CTAs claros con feedback táctil y visual, badges de estado y micro-interacciones suaves.

---

## 2. Paleta de Colores (Color System)

La estética se basa en un **Dark Mode de alto contraste** enriquecido con acentos violetas profundos y destellos cromáticos de Inteligencia Artificial (Cyan, Magenta y Azul eléctrico).

### 2.1 Fondos y Superficies (Backgrounds & Canvas)

| Rol de Color | HEX | RGB | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Dark Canvas (Base Principal)** | `#0e0817` | `rgb(14, 8, 23)` | Fondo global de la aplicación y landing page. |
| **Dark Canvas Profundo** | `#0a0514` | `rgb(10, 5, 20)` | Fondos de secciones clave (ej. footer y contacto). |
| **Dark Surface (Cards / Modales)** | `#1f162d` | `rgb(31, 22, 45)` | Fondo interior del ChatBox, menús y modales. |
| **Surface Elevada (Transparente)** | `rgba(255, 255, 255, 0.03)` | — | Fondo de tarjetas estándar con bordes finos. |
| **Surface Hover** | `rgba(255, 255, 255, 0.06)` | — | Estado `:hover` en tarjetas interactivas. |
| **Light Canvas (Modo Claro)** | `#f7f5f8` | `rgb(247, 245, 248)` | Fondo alternativo en modo claro. |

### 2.2 Acentos de Marca agustindev (Primary Violet)

| Rol de Color | HEX | Tailwind | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Primary Brand Violet** | `#4b00ad` | — | Color institucional central de agustindev. |
| **Violet CTA (Botón Primario)** | `#7c3aed` | `violet-600` | Botones de acción principales (ej. "Agendar Llamada"). |
| **Violet CTA Hover** | `#8b5cf6` | `violet-500` | Estado hover de botones primarios. |
| **Violet Shadow / Glow** | `rgba(75, 0, 173, 0.4)` | `shadow-violet-900/40` | Sombras proyectadas de botones y destacados. |
| **Violet Subdued Text** | `#a78bfa` | `violet-400` | Pre-títulos de sección, tags de categoría, checks. |
| **Violet Badges / Pills** | `#c4b5fd` | `violet-300` | Texto dentro de badges de tecnologías. |

### 2.3 El Gradiente "AI Glow" (Firma Visual de Inteligencia Artificial)

La marca utiliza dos gradientes dinámicos patentados para elementos impulsados por IA:

```css
/* 1. AI Wave Gradient (Bordes animados y texto 'IA') */
background: linear-gradient(90deg, #4b00ad, #00d2ff, #ff00d2, #00d2ff, #4b00ad);
background-size: 300% 100%;

/* 2. AI Multicolor Aurora (Estado activo / Thinking) */
background: linear-gradient(270deg, #0cebeb, #20e3b2, #29ffc6, #f093fb, #f5576c);
background-size: 300% 300%;
```

- **Resplandor de ambiente en Hero:**
  - Blob superior izquierdo: `#6d28d9` (Violeta) al `20%` con `blur(120px)`.
  - Blob inferior derecho: `#4f46e5` (Índigo) al `15%` con `blur(100px)`.
- **Anillo de la foto de perfil:**
  - Gradiente cónico/angular: `from-violet-600 via-fuchsia-500 to-indigo-500`.

### 2.4 Acentos de Ecosistema & Proyectos

Cada producto o integración dentro del portafolio tiene su propio acento complementario:

- **Mercado Pago (Fintech):** `#009EE3` (Azul oficial) | Hover: `#0084be` | Glow: `rgba(0, 158, 227, 0.25)`.
- **CracksApp (Liga Deportiva):** `#E9C46A` (Dorado) | `#231942` (Púrpura noche) | `#00E676` (Verde esmeralda).
- **OmegaFit (Fitness & Salud):** `#ff6d00` (Naranja primary) | Glow: `rgba(255, 109, 0, 0.2)`.
- **YouTube:** `#FF0000` con contenedor translúcido `rgba(255, 0, 0, 0.1)`.
- **WhatsApp:** `#25D366` | `#22c55e`.

### 2.5 Escala Tipográfica de Grises y Textos (Contraste)

- **Blanco Puro (`#FFFFFF`):** Títulos H1, H2, nombres de tarjetas y texto de botones primarios.
- **Blanco al 90% (`rgba(255, 255, 255, 0.90)`):** Subtítulos y preguntas frecuentes.
- **Blanco al 60% (`rgba(255, 255, 255, 0.60)`):** Párrafos explicativos y descripciones de servicios.
- **Blanco al 35% / 40% (`rgba(255, 255, 255, 0.35)`):** Microcopys, números de pasos (ej. `01 — Descubrimiento`).
- **Bordes estándar:** `rgba(255, 255, 255, 0.08)` a `rgba(255, 255, 255, 0.12)`.
- **Bordes activos:** `rgba(139, 92, 246, 0.40)` (Violeta 500 al 40%).

---

## 3. Tipografía & Jerarquía Visual

### 3.1 Familias Tipográficas

1. **Fuente Principal (Display & Body):** `Inter`, sans-serif.
   - Alternativa para interfaces de aplicaciones y dashboards: `Plus Jakarta Sans`.
   - Alternativa para Android nativo: `Roboto`.
2. **Fuente Monospace (Código, IDs de transacciones):** `ui-monospace`, `Menlo`, `Monaco`, `Consolas`, monospace.

### 3.2 Escala y Pesos Tipográficos

| Nivel | Tamaño | Peso | Interlineado / Tracking | Caso de Uso |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `48px` - `72px` (`5xl`-`7xl`) | ExtraBold (800) | `leading-[1.05]` `tracking-tight` | Frase principal de impacto con palabra rotativa. |
| **Section Title (H2)** | `36px` - `48px` (`4xl`-`5xl`) | ExtraBold (800) | `leading-tight` `tracking-tight` | Encabezados de secciones principales. |
| **Card Title (H3)** | `20px` - `24px` (`xl`-`2xl`) | Bold (700) | `leading-snug` `tracking-tight` | Título de tarjeta de producto. |
| **Category Pill / Overline** | `12px` (`xs`) | Bold (700) | `uppercase` `tracking-widest` | Etiquetas de categoría (`SAAS`, `BOOKING`, `EL PROCESO`). |
| **Body Standard** | `16px` (`base`) | Regular (400) | `leading-relaxed` (1.625) | Textos explicativos en párrafos. |
| **Body Secondary** | `14px` (`sm`) | Medium (500) | `leading-relaxed` | Detalles de servicios, bullets y descripciones. |
| **Microcopy / Badges** | `10px` - `11px` | SemiBold / Black | `tracking-wider` | Estados, badges de fechas, etiquetas de versión. |

---

## 4. Componentes y Reglas de Maquetación

### 4.1 Radios de Borde (Border Radius)

- **Pill Completo (`rounded-full` / `9999px`):** Utilizado en chips de categorías, avatars circulares y switches de control deslizante estilo iOS.
- **Smartphones & Mockups (`rounded-[44px]` a `rounded-[50px]`):** Chasis del smartphone físico exterior.
- **Tarjetas Grandes (`rounded-3xl` / `24px`):** Tarjetas de proyectos y contenedores principales.
- **Botones y Contenedores (`rounded-xl` / `12px`):** Botones CTAs principales, tarjetas de pasos del proceso.
- **Micro-elementos (`rounded-lg` / `8px`):** Iconos de redes sociales, badges de tecnologías (`Next.js`, `PostgreSQL`).

### 4.2 Botones y Acciones

- **Botón Primario (Llamada a la Acción):**
  - Fondo: `#7c3aed` (`bg-violet-600`) con hover a `#8b5cf6`.
  - Tipografía: Blanca, `font-bold`, `text-sm` a `text-base`.
  - Radio: `rounded-xl` (`12px`) con padding generoso (`px-8 py-4` o `px-6 py-3`).
  - Sombra: `shadow-xl shadow-violet-900/50`.
  - Microinteracción: `transition-all duration-300 hover:-translate-y-0.5`.
- **Botón Secundario (Vidrio Esmerilado):**
  - Fondo: `rgba(255, 255, 255, 0.05)` con `border 1px solid rgba(255, 255, 255, 0.15)`.
  - Efecto: `backdrop-blur`.
  - Hover: `hover:bg-white/10 hover:border-white/30`.
- **Botón de Video / Demo:**
  - Fondo: `rgba(255, 0, 0, 0.1)` con borde `rgba(255, 0, 0, 0.25)`.
  - Texto e Icono: Rojo YouTube `#FF0000` con texto blanco negrita.

### 4.3 Componente Protagonista: "Smartphone Mockup"

Para mostrar aplicaciones web y móviles en vivo sin añadir tarjetas abultadas alrededor:

- **Estructura:**
  - Chasis oscuro de titanio (`#0c0c0e`) con borde de `4px` en `#262626` y anillo fino en `#3a3a3c`.
  - Botones físicos metálicos simulados en los laterales (`absolute` en `neutral-600`).
  - Barra de inicio inferior (Home indicator de iOS / Android: `w-28 h-1 bg-neutral-500/70 rounded-full`).
  - Sombra ambiental exterior difuminada según el producto (`halo shadow`).
- **Selector Flotante Superior (Sliding Pill estilo iOS):**
  - Contenedor en `bg-neutral-900/90` con borde `neutral-800` y efecto `backdrop-blur-md`.
  - Indicador deslizante animado (`cubic-bezier(0.16, 1, 0.3, 1)`) que viaja entre pestañas.

### 4.4 Barra de Chat Flotante con "AI Glow"

- **Ubicación:** Barra flotante fija en la parte inferior central de la pantalla (`fixed bottom-6 left-1/2 -translate-x-1/2`).
- **Efecto de Resplandor:**
  - Pseudoelemento `::before` animado con el gradiente de 4 colores que genera un Drop Shadow lumínico rotativo de `blur(20px)`.
  - Pulso suave mientras el usuario redacta y más acelerado mientras la IA procesa la respuesta.
- **Interior:** Glassmorphism en fondo oscuro (`#1f162d`), campos redondeados y botón circular de envío con flecha ascendente.
- **Paywall / Lead Capture:** Efecto de desenfoque `blur(8px)` en respuestas que requieren desbloqueo mediante captura de contacto.

---

## 5. Iconografía & Elementos Gráficos

- **Iconos del Sistema:** Google Material Symbols Outlined (`opsz: 24`, `wght: 400`, `FILL: 0`).
- **Logo Oficial agustindev:**
  - Isotipo geométrico lineal minimalista compuesto por trazos biselados diagonales y un vértice central con `strokeWidth: 4.43`, terminales redondeados (`strokeLinecap="round"`), sin rellenos pesados.
- **Checkmarks y Badges:**
  - Círculos de verificación verdes (`#10B981`) o violetas (`#a78bfa`) al 15% de opacidad con ícono `✓` interno.

---

## 6. Microinteracciones & Animaciones

1. **Aparición en Scroll (`anim-on-scroll`):**
   - Estado inicial: `opacity: 0`, `transform: translateY(24px)`.
   - Estado visible: `opacity: 1`, `transform: translateY(0)`, `transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Hover Lift:**
   - Desplazamiento sutil hacia arriba de 2px a 4px (`hover:-translate-y-0.5` o `-translate-y-1`) combinado con intensificación de sombra y brillo de borde.
3. **Rotación de Palabra Clave:**
   - Transición vertical 3D (`rotateX(90deg)` / `rotateX(0deg)`) entre palabras destacadas (ej. *"empresa"* / *"marca"*).

---

## 7. Instrucciones para la Creación de Contenido por IA

Cuando utilices otra IA (diseño gráfico, generador de video, creador de diapositivas o maquetador), incluye las siguientes pautas:

### 7.1 Para Imágenes y Banners Promocionales (Midjourney / DALL-E / Canva)
> *"Diseña una imagen en estilo Dark Mode Premium con fondo grafito y violeta oscuro (#0e0817). Utiliza halos lumínicos tenues en violeta (#7c3aed) y destellos cian (#00d2ff). El estilo debe ser tecnológico, elegante, moderno y limpio, con tipografía geométrica sans-serif (Inter/Plus Jakarta Sans), tarjetas de vidrio esmerilado con bordes muy sutiles de 1px al 10% de opacidad y sombras suaves."*

### 7.2 Para Presentaciones y Diapositivas (Pitch Decks / Keynote)
- **Fondo de Slide:** `#0e0817` o `#0a0514`.
- **Títulos de Diapositiva:** Blanco puro (`#FFFFFF`) en ExtraBold, tamaño grande.
- **Acento y Números de Lista:** Violeta brillante (`#a78bfa`) o gradiente `Violeta a Cian`.
- **Cajas de Contenido:** Superficie `#1f162d` con borde `1px solid rgba(255, 255, 255, 0.08)` y esquinas redondeadas (`16px`).
- **Gráficos y Métricas:** Resaltar valores numéricos en Blanco o Violeta brillante, acompañados de badges de estado en verde esmeralda (`#10B981`).

### 7.3 Para Edición de Video (Reels, TikToks, Shorts, YouTube)
- **Subtítulos y Lower Thirds:**
  - Caja contenedora: Píldora redondeada en `#1f162d` con opacidad del 85% y borde sutil.
  - Tipografía: Inter / Plus Jakarta Sans en negrita (700/800).
  - Palabra destacada: Violeta claro (`#a78bfa`) o amarillo oro (`#E9C46A`).
- **Animaciones de Texto:** Fade up con rebote sutil (ease-out).
- **Fondos y Overlays:** Gradientes oscuros con partículas o halos desenfocados en violeta profundo.

---

*Fin de la especificación técnica de diseño de **agustindev**.*
