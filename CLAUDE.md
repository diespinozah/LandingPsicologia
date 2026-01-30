# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for "MenteSerena" psychology clinic. Static site with no build process.

## Tech Stack

- **HTML5** - Single page (`index.html`)
- **Tailwind CSS** - Via CDN with custom config in `<script>` tag
- **Vanilla JavaScript** - No framework dependencies
- **Formspree** - Contact form backend (endpoint configured in form action)

## Development

Open `index.html` directly in a browser. No build step required.

## Architecture

### Custom Tailwind Config (in index.html)
```javascript
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
- Contact form with async Formspree submission and loading states

### CSS Classes (styles.css)
- `.fade-in` / `.visible` - Scroll-triggered animations
- `.nav-link.active` - Current section indicator
- `.form-success` / `.form-error` - Form feedback messages
- Respects `prefers-reduced-motion`
