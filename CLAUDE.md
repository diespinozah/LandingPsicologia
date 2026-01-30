# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for "MenteSerena" psychology clinic. Static frontend with serverless backend for email handling.

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
        └── send-email.js   # Email sending function
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
    primary: '#2D6A4F',    // Verde bosque
    secondary: '#40916C',  // Verde suave
    accent: '#74C69D',     // Verde claro
    background: '#F8FAF9', // Fondo
    darkText: '#1B4332',   // Texto
}
```

### JavaScript Modules (script.js)
- Mobile menu toggle with hamburger animation
- Header scroll effect (adds `.scrolled` class)
- Smooth scroll for anchor links
- Active navigation link tracking via IntersectionObserver
- Fade-in animations on scroll (`.fade-in` → `.visible`)
- Testimonial slider with auto-play, dots, arrows, and touch/swipe support
- Contact form with async submission to Netlify Function

### Netlify Function (send-email.js)
- Receives JSON payload from contact form
- Validates required fields (nombre, email, mensaje)
- Sends formatted HTML email via Resend API
- Returns success/error response

### CSS Classes (styles.css)
- `.fade-in` / `.visible` - Scroll-triggered animations
- `.nav-link.active` - Current section indicator
- `.form-success` / `.form-error` - Form feedback messages
- Responsive adjustments for mobile (`max-width: 480px`, `max-width: 399px`)
- Respects `prefers-reduced-motion`

## Deployment

Push to `main` branch triggers automatic deploy on Netlify.

**Live site:** https://menteserena-psicologia.netlify.app
