# Design System Document: Financial Intelligence & Precision

## 1. Overview & Creative North Star

### The Creative North Star: "The Architectural Ledger"
This design system rejects the cluttered, spreadsheet-heavy aesthetic of traditional finance. Instead, it adopts the persona of **The Architectural Ledger**—a digital experience that feels as much like a high-end editorial journal as it does a professional analysis tool. 

We break the "template" look by prioritizing **intentional asymmetry** and **high-contrast typography scales**. Key data points are not just numbers; they are structural anchors. By utilizing breathing room (whitespace) as a functional element rather than a void, we guide the analyst’s eye through complex narratives without cognitive fatigue. The system is characterized by layered depth, subtle tonal shifts instead of rigid lines, and a "glass-on-paper" materiality.

---

## 2. Colors

The palette is rooted in deep, authoritative tones contrasted with surgical accent precision.

*   **Primary & Neutrals:** We use `primary_container` (#131b2e) and `on_primary_fixed` (#131b2e) to establish a foundation of trust. The `surface` (#f7f9fb) provides a crisp, off-white canvas that feels warmer and more premium than pure white.
*   **Success & Growth:** `on_tertiary_container` (#009668) is our signature emerald. It should be used sparingly for high-impact growth metrics.
*   **Alerts & Risks:** `error` (#ba1a1a) and amber tones (on-surface-variant transitions) identify friction points with immediate clarity.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through background color shifts. Use `surface-container-low` (#f2f4f6) sections against a `surface` background to denote change in context. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (#f7f9fb)
*   **Sectioning:** `surface-container-low` (#f2f4f6)
*   **Floating Cards:** `surface-container-lowest` (#ffffff)
This nesting creates natural depth. A white card on a light gray section provides an immediate, "soft" lift that feels sophisticated and modern.

### The "Glass & Gradient" Rule
For floating elements like tooltips or active modals, use **Glassmorphism**. Combine `surface_variant` with a `backdrop-blur` of 12px-20px. 
*   **Signature Textures:** Use subtle linear gradients transitioning from `primary` (#000000) to `primary_container` (#131b2e) for primary CTAs to add "soul" and a sense of metallic depth.

---

## 3. Typography

The typography strategy pairs the structural authority of **Manrope** for headers with the Swiss-style precision of **Inter** for data.

*   **Display & Headlines (Manrope):** Large scales (e.g., `display-lg` at 3.5rem) should be used for hero metrics. The high x-height of Manrope conveys modernism.
*   **Body & Labels (Inter):** Inter is used for all functional text. `body-md` (0.875rem) is our workhorse for analysis descriptions.
*   **Hierarchy as Brand:** Use `label-sm` (#0.6875rem) in all-caps with 0.05em tracking for secondary metadata (e.g., "REPORTED ADD-BACKS"). This creates an editorial look that distinguishes labels from data.

---

## 4. Elevation & Depth

### The Layering Principle
Avoid the "stuck-on" look of traditional shadows. Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.

### Ambient Shadows
When a "floating" effect is mandatory (e.g., a hovered state), use **Ambient Shadows**:
*   **Color:** Use a 6% opacity version of `on_surface` (#191c1e).
*   **Blur:** 24px to 40px. 
*   **Spread:** -4px.
Shadows must feel like natural light diffusion, not a black glow.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., in high-contrast modes), use a **Ghost Border**: `outline-variant` (#c6c6cd) at 15% opacity. **Never use 100% opaque borders.**

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (Primary to Primary Container), `DEFAULT` (0.5rem) roundedness. 
*   **Secondary:** `surface-container-highest` background with `on_surface` text. No border.
*   **Tertiary:** Text-only with `label-md` styling, using `primary` color for the label.

### Input Fields
*   **Style:** `surface-container-lowest` fill. Use a 2px bottom-accent of `outline_variant` instead of a full box.
*   **State:** On focus, the bottom accent transitions to `primary` (#000000).

### Chips (Data Tags)
*   Use `secondary_container` (#d0e1fb) for neutral tags. 
*   Use `tertiary_fixed_dim` (#4edea3) with `on_tertiary_fixed` (#002113) text for positive growth indicators.
*   **Shape:** `full` (9999px) roundedness to contrast with the `md` (0.75rem) corners of cards.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines. 
*   **Separation:** Use `Spacing Scale 4` (1.4rem) or `Spacing Scale 6` (2rem) to separate list items. If separation is visually difficult, use alternating tonal shifts between `surface` and `surface-container-low`.

---

## 6. Do's and Don'ts

### Do
*   **DO** use intentional asymmetry. Align large display metrics to the left while keeping supporting labels right-aligned to create a dynamic visual path.
*   **DO** use `surface_bright` for interactive "zones" within a darker dashboard.
*   **DO** allow metrics to breathe. A single "Net Income" figure should have at least `Spacing Scale 8` (2.75rem) of clear space around it.

### Don't
*   **DON'T** use pure black (#000000) for body text. Use `on_surface_variant` (#45464d) to reduce eye strain.
*   **DON'T** use 1px dividers to separate rows in a financial table. Use a very subtle `surface-container-high` background on hover instead.
*   **DON'T** use sharp 0px corners. Financial data is "hard"; the UI should be "soft" (0.5rem - 1rem) to balance the experience.