# Vetted - Design Spec & Implementation Notes

## 1. Overview
Vetted is a SaaS platform designed to automate the review of third-party information security questionnaires. This landing page is built to convert security managers and procurement teams into trial users.

## 2. Design System
- **Colors**:
  - Primary: `#0B6FFF` (Blue)
  - Accent: `#00C2A8` (Teal)
  - Neutral Dark: `#0F1724` (Deep Navy)
  - Neutral Light: `#F7FAFC` (Off-white)
  - Warning: `#FFB020`
  - Success: `#16A34A`
- **Typography**:
  - Headings: `Playfair Display` (Serif)
  - Body: `Inter` (Sans-serif)
- **Visuals**: Glassmorphism, subtle gradients, clean lines.

## 3. Architecture
- **Framework**: React 18
- **Styling**: Tailwind CSS (loaded via CDN for this prototype, configurable via `tailwind.config.js` in production).
- **Icons**: Lucide React.
- **State Management**: React `useState` for local interactivity (Modals, Tabs, Upload simulation).

## 4. Implementation Details
- **Hero**: Contains a CSS-only animated visualization of the scanning process.
- **Live Preview**: simulated file upload and parsing logic using `setTimeout` to mimic async processing.
- **Responsiveness**: Mobile-first approach using Tailwind's `sm:`, `md:`, `lg:`, `xl:` prefixes.
- **Accessibility**: Semantic HTML tags (`<nav>`, `<main>`, `<section>`, `<footer>`), ARIA labels on interactive elements.

## 5. Next Steps
Once this landing page is approved, we will proceed to build the actual dashboard application. Please provide the prompt for the actual product logic and dashboard views.