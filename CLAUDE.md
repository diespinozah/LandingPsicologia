# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page B2B for "Axia" - Consultora en Desarrollo Organizacional. Static frontend with serverless backend for email handling.

## Tech Stack

### Frontend
- **HTML5** - Single page (`index.html`)
- **Tailwind CSS** - Via CDN with custom config (includes `xs` breakpoint at 400px)
- **Vanilla JavaScript** - No framework dependencies
- **Google Fonts** - Poppins typeface

### Backend
- **Netlify Functions** - Serverless functions (Node.js)
- **Resend** - Email API for contact form

### Infrastructure
- **Netlify** - Hosting, CDN, SSL, Functions
- **GitHub** - Repository and version control

## Project Structure

```
LandingPsicologia/
├── index.html              # Main page with all sections
├── styles.css              # Custom styles and animations
├── script.js               # Interactivity and form handling
├── package.json            # Dependencies (resend)
├── netlify.toml            # Netlify configuration
├── CLAUDE.md               # Project documentation
└── netlify/
    └── functions/
        └── send-email.js   # Email sending function (B2B fields)
```

## Development

Open `index.html` directly in a browser. No build step required.

For testing Netlify Functions locally:
```bash
npm install
netlify dev
```

## Environment Variables (Netlify)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from resend.com |
| `EMAIL_DESTINO` | Email address to receive contact form submissions |

## Architecture

### Custom Tailwind Config (in index.html)
```javascript
screens: {
    'xs': '400px',    // Extra small devices
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
},
colors: {
    primary: '#1E3A5F',      // Azul profundo (confianza)
    secondary: '#2E5077',    // Azul medio
    accent: '#3D8B7A',       // Verde azulado (crecimiento)
    accentLight: '#5BA88F',  // Verde claro
    background: '#F7F9FC',   // Gris muy claro
    darkText: '#1A2B3C',     // Texto oscuro
    lightText: '#64748B',    // Texto secundario
    warm: '#E8B059',         // Dorado (premium)
}
```

### Page Sections
1. **Header/Nav** (`header`) - Fixed navigation + CTA "Agenda una reunión"
2. **Hero** (`inicio`) - Value proposition + 2 CTAs
3. **Desafíos** (`desafios`) - 6 pain point cards
4. **Servicios** (`servicios`) - 4 service cards (Consultoría, Capacitaciones, Charlas, Coaching)
5. **Sectores** (`sectores`) - 4 sector cards (Salud/APS, Educación, Empresas, Sector Público)
6. **Metodología** (`metodologia`) - 4 pillars (Integral, Inclusivo, Liderazgo Positivo, Transformacional)
7. **Resultados** (`resultados`) - 4 expected outcomes + disclaimer
8. **Testimonios** (`testimonios`) - Slider with placeholders
9. **CTA Final** (`cta-final`) - Conversion section
10. **Contacto** (`contacto`) - B2B form + contact info
11. **Footer** (`footer`) - Links, legal, social

### B2B Contact Form Fields
| Campo | ID | Requerido |
|-------|-----|-----------|
| Nombre completo | `nombre` | Sí |
| Organización | `organizacion` | Sí |
| Cargo | `cargo` | Sí |
| Correo electrónico | `email` | Sí |
| Teléfono | `telefono` | No |
| Tipo de servicio | `tipoServicio` | No |
| Mensaje | `mensaje` | Sí |

**Opciones de tipoServicio:**
- `consultoria` - Consultoría organizacional
- `capacitacion` - Capacitación o taller
- `charla` - Charla o seminario
- `coaching` - Coaching ejecutivo
- `diagnostico` - Diagnóstico de clima
- `otro` - Otro

### JavaScript Modules (script.js)
- Mobile menu toggle with hamburger animation
- Header scroll effect (adds `.scrolled` class)
- Smooth scroll for anchor links
- Active navigation link tracking via IntersectionObserver
- Fade-in animations on scroll (`.fade-in` → `.visible`)
- Testimonial slider with auto-play, dots, arrows, and touch/swipe support
- Contact form with async submission to Netlify Function (B2B fields)

### Netlify Function (send-email.js)
- Receives JSON payload from contact form (B2B fields)
- Validates required fields (nombre, organizacion, cargo, email, mensaje)
- Sends formatted HTML email via Resend API with Axia branding
- Returns success/error response

### CSS Classes (styles.css)
- `.fade-in` / `.visible` - Scroll-triggered animations
- `.nav-link.active` - Current section indicator
- `.form-success` / `.form-error` - Form feedback messages
- `.sector-card` - Sector card hover effects
- `.gradient-text` - Gradient text effect
- `.badge-*` - Badge styles (primary, accent, warm)
- Responsive adjustments for mobile (`max-width: 480px`, `max-width: 399px`)
- Respects `prefers-reduced-motion`

## Deployment

Push to `main` branch triggers automatic deploy on Netlify.

## Brand Guidelines

### Axia - Consultoría en Desarrollo Organizacional

**Tagline:** "Transformamos organizaciones a través de su gente"

**Value Proposition:**
- Enfoque integral
- Perspectiva inclusiva (género y diversidad)
- Basado en liderazgo positivo
- Cambio transformacional sostenible

**Target Sectors:**
- Salud y APS (CESFAM, hospitales, clínicas)
- Educación (colegios, universidades)
- Empresas (PyMEs, corporaciones)
- Sector Público (municipalidades, servicios públicos)

**Services:**
1. Consultoría Organizacional
2. Capacitaciones y Talleres
3. Charlas y Seminarios
4. Coaching Ejecutivo
