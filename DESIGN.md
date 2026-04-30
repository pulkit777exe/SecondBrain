---
name: SecondBrain
description: Personal bookmarking app for researchers and students
colors:
  background: "#fafaf9"
  text-primary: "#1c1917"
  text-secondary: "#57534e"
  text-muted: "#a8a29e"
  border-default: "#e7e5e4"
  border-hover: "#a8a29e"
  surface-white: "#ffffff"
  surface-hover: "#f5f5f4"
  accent-youtube: "#ef4444"
  accent-twitter: "#0ea5e9"
  accent-instagram: "#ec4899"
  accent-reddit: "#f97316"
  accent-github: "#6b7280"
  accent-linkedin: "#3b82f6"
  accent-spotify: "#22c55e"
  accent-loom: "#a855f7"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontWeight: 400
  body:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, sans-serif"
    fontWeight: 400
rounded:
  sm: "2px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "#1c1917"
    textColor: "#ffffff"
    rounded: "8px"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "#57534e"
    textColor: "#ffffff"
    rounded: "8px"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#a8a29e"
    rounded: "8px"
    padding: "10px 16px"
  card:
    backgroundColor: "#ffffff"
    borderColor: "#e7e5e4"
    rounded: "2px"
    padding: "16px"
  input:
    backgroundColor: "#ffffff"
    borderColor: "#e7e5e4"
    rounded: "8px"
    padding: "10px 16px"
---

# Design System: SecondBrain

## 1. Overview

**Creative North Star: "The Personal Archive"**

A quiet digital notebook for personal knowledge — not social performance. This design system recedes entirely, letting saved content take center stage. The interface should feel like a well-worn, well-organized library: sophisticated, deep, and deeply personal. Nothing competes for attention. Every interaction is understated.

**Key Characteristics:**
- Content first — the UI fades away
- Warm stone palette with sophisticated depth
- Flat by default, tonal shifts on interaction
- Playfair Display for editorial elegance, DM Sans for readability
- 2px radius for cards, 8px for interactive elements — restraint, not roundness
- No shadows at rest, subtle border shifts on hover

## 2. Colors

**The Deep & Moody Palette.** Warm stone foundation with rich, saturated accents for platform identification. The palette prioritizes sophistication over brightness — no harsh whites or blacks, everything tinted warm.

### Neutral
- **Background** (#fafaf9): The canvas. Warm stone, never white.
- **Text Primary** (#1c1917): Rich warm black for headings and important text.
- **Text Secondary** (#57534e): Muted stone for body text and labels.
- **Text Muted** (#a8a29e): Subtle text for timestamps, secondary labels.
- **Border Default** (#e7e5e4): Subtle dividers and card outlines.
- **Border Hover** (#a8a29e): Darker border on interactive states.
- **Surface White** (#ffffff): Card backgrounds, elevated elements.
- **Surface Hover** (#f5f5f4): Subtle background shift on hover.

### Platform Accents (used in 2px badges)
- **YouTube** (#ef4444): Video content indicator.
- **Twitter/X** (#0ea5e9): Social post indicator.
- **Instagram** (#ec4899): Visual content indicator.
- **Reddit** (#f97316): Discussion indicator.
- **GitHub** (#6b7280): Code repository indicator.
- **LinkedIn** (#3b82f6): Professional content indicator.
- **Spotify** (#22c55e): Audio content indicator.
- **Loom** (#a855f7): Video recording indicator.

### Named Rules
**The Restraint Rule.** The interface uses no color for decoration. Accent colors appear only in platform badges to identify content type. The system is primarily monochrome.

## 3. Typography

**Display Font:** Playfair Display (Georgia fallback)
**Body Font:** DM Sans (system sans fallback)

**Character:** Editorial elegance meets functional utility. Playfair Display brings sophistication and warmth to headings — like a well-printed book. DM Sans is invisible, readable, and modern without being cold.

### Hierarchy
- **Display** (Playfair Display, 24-48px, line-height 1.2): Page titles, major headings.
- **Title** (Playfair Display, 18-24px, line-height 1.3): Card titles, section headers.
- **Body** (DM Sans, 14-16px, line-height 1.5): Content, descriptions. Cap at 65-75ch for readability.
- **Label** (DM Sans, 12px, letter-spacing 0.02em): Tags, metadata, timestamps.

### Named Rules
**The Typography Rule.** Headings use Playfair Display for editorial warmth. Everything else uses DM Sans. Never mix — serif is for display, sans is for utility.

## 4. Elevation

**The Flat + Tonal System.** This design has no shadows at rest. Depth is communicated through:
- Border color shifts (stone-200 to stone-400 on hover)
- Subtle background tints (white to #f5f5f4)
- No elevation changes, no drop shadows, no gradients

### When elevation appears
- Cards: flat white with subtle border, darkens border on hover
- Buttons: flat, border shift on hover, no shadow
- Inputs: flat with subtle border, border color change on focus

**The Flat-By-Default Rule.** Surfaces are flat. Elevation comes only from tonal shifts in background and border, never from shadows. This keeps the interface clean and editorial.

## 5. Components

### Buttons
- **Shape:** rounded-md (8px radius)
- **Primary:** background #1c1917, text white, padding 10px 16px
- **Secondary:** background #57534e, text white
- **Ghost:** transparent background, text #a8a29e, hover text white with subtle bg
- **Hover:** 200ms transition, subtle border or background shift
- **Focus:** 2px outline with 30% opacity black

### Cards
- **Corner Style:** rounded-sm (2px) — sharp, editorial
- **Background:** white (#ffffff)
- **Border:** 1px solid #e7e5e4
- **Hover:** border shifts to #a8a29e, 300ms transition
- **Padding:** 16px
- **Shadow Strategy:** none — flat with border

### Inputs / Fields
- **Style:** 1px solid border, white background, rounded-md (8px)
- **Padding:** 10px 16px
- **Focus:** border shifts to #a8a29e, 2px outline
- **Placeholder:** text #a8a29e

### Tags / Chips
- **Style:** background #f5f5f4, text #57534e, rounded-sm (2px)
- **Hover:** background #e7e5e4
- **Padding:** 2px 8px (py-0.5 px-2)

### Navigation (Sidebar)
- **Style:** flat, no background, text-only
- **Default:** text #a8a29e
- **Hover:** text #1c1917
- **Active:** text #1c1917, subtle indicator

## 6. Do's and Don'ts

### Do:
- **Do** use the warm stone background (#fafaf9) — never pure white for the page background.
- **Do** use 2px radius on cards and tags — keep them sharp and editorial.
- **Do** use 8px radius on interactive elements (buttons, inputs) — softer touch targets.
- **Do** use Playfair Display for headings — it adds the editorial warmth.
- **Do** use DM Sans for body text — it's readable and invisible.
- **Do** use platform accent colors only in small badges — never as backgrounds or decoration.
- **Do** respect reduced motion preferences — 200ms transitions are already subtle.

### Don't:
- **Don't** use shadows — this is a flat design.
- **Don't** use gradients — no decorative treatments.
- **Don't** use glassmorphism — no blurs or transparency layers.
- **Don't** use border-left or border-right as accent stripes — full borders only.
- **Don't** use gradient text — solid colors only for emphasis.
- **Don't** make cards larger than needed — content first, containers second.
- **Don't** default to modals — exhaust inline and progressive options first.