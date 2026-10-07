---
name: Covert Syndicate
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Syne
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a high-stakes, suspenseful "neon noir" digital tabletop atmosphere tailored for social deduction, hidden roles, and strategic deception. The aesthetic blends tactical intelligence dossiers, cinematic crime thrillers, and sleek modern esports interfaces.

Key design principles:
- **Submerged Espionage:** The canvas rests in ultra-deep slate voids, allowing role identities and critical evidence cues to cut through the dark with lethal clarity.
- **Electric Tension:** Subtle luminous neon accents emit directed focal energy, signaling danger, surveillance, and concealed allegiances without cluttering legibility.
- **Tactile Cryptography:** Interface elements simulate high-end physical clearance credentials, classified incident logs, and field operative consoles.

## Colors

The palette establishes an unmistakable hierarchy between environment, tactical neutral data, and faction dynamics:

- **Neutral Foundation (`#0B0F19` & `#111827`):** Deep stealth slate navy forms the operational surface layer. Elevated panels sit on `#1F2937` with borders at `#374151` (and `rgba(255, 255, 255, 0.08)` for hairline dividers). Text defaults to `#F9FAFB` (high-contrast operative text) and `#9CA3AF` (classified subtext).
- **Primary Accent (`#6366F1` - Tactical Violet):** Handles systemic actions, focus states, voting mechanics, and confidential game triggers.
- **Faction Tokens:**
  - **Police / Innocents (`#10B981` - Covert Emerald):** Represents verified clearances, justice, active surveillance pings, and confirmed alibis.
  - **Undercover Agents (`#F59E0B` - Hazard Amber):** Signals ambiguity, compromised channels, timers, warnings, and neutral-infiltrator status.
  - **Thieves / Impostors (`#EF4444` - Crimson Danger):** Indicates critical breach, treason, eliminated players, kill phases, and active theft vectors.

## Typography

The typographic hierarchy builds narrative tension through distinct structural roles:

- **Syne (Headlines & Phase Banners):** Expressive, angular, and imposing. Used for role declarations, win-condition banners, and high-impact countdown headers.
- **Space Grotesk (Labels, Badges, Field Identifiers & Timers):** Tech-forward, monospaced-adjacent grotesque with military-terminal sharpness. Always uppercase on badges and chips for an authenticated clearance aesthetic.
- **Inter (Body, Dossier Briefings, Voting Logs):** Highly legible, neutral workhorse that delivers instant reading comprehension during fast-paced rounds and heated voice debates.

## Layout & Spacing

The layout is built around a flexible 12-column tactical grid on desktop and a compact single-to-dual column grid on mobile devices.

- **Mobile Viewport (<768px):** Uses `margin` (`1rem`) and `gutter` (`1rem`). The primary view anchors game boards and role dossiers in the upper viewport, while actionable deduction mechanics (voting grids, suspect rosters) utilize horizontal swipe rails or stacked vertical cards.
- **Desktop/Tablet (>768px):** Scales to `margin-desktop` (`2.5rem`) and `gutter-desktop` (`1.5rem`). Operates split HUD layouts: Left operative roster (4 columns), center tactical table / evidence log (5 columns), right real-time transcript & role abilities (3 columns).
- **Rhythm & Gaps:** Component clusters adhere strictly to 8pt increments using `space-xs` through `space-xl` to maintain balanced visual density across dense party play scenarios.

## Elevation & Depth

Visual hierarchy leverages a combination of layered dark slate surfaces, subtle glass transmittances, and faction-driven neon perimeter glows:

- **Level 0 (Canvas):** Pure `#0B0F19` base canvas with an ultra-faint radial gradient from the center (`#111827`).
- **Level 1 (Panels & Roster Trays):** `#111827` surface topped with a 1px hairline stroke of `rgba(255, 255, 255, 0.08)`.
- **Level 2 (Tactile Cards & Floating Containers):** `#1F2937` with 12px blur backdrop-filter (`rgba(17, 24, 39, 0.75)`), finished with dual-stage ambient depth:
  - Base shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
  - Rim highlight: 1px continuous inset border `rgba(255, 255, 255, 0.12)`.
- **Level 3 (Active Interrogation / Selected Suspect):** High-tension state highlighted by colored neon halos:
  - Faction glow: `0 0 20px -2px var(--faction-glow-color)` paired with a matching 1.5px solid border (`#EF4444`, `#10B981`, `#F59E0B`, or `#6366F1`).

## Shapes

The design system implements a controlled `roundedness: 2` (0.5rem base radius) philosophy. 

- Interactive controls, status badges, and input nodes share 8px (`0.5rem`) corner radials, striking an equilibrium between military hardware chiseled precision and modern mobile ergonomics.
- Role cards, identity dossier modals, and overlay slates utilize 16px (`1rem`) to establish a physical card-stock feel reminiscent of tangible tabletop deception cards.
- Micro-elements such as notification counters, radio indicators, and status dots leverage circular geometries (`9999px`) to create functional contrast against boxy tactical modules.

## Components

### Role & Evidence Cards
- **Base Surface:** 16px rounded rectangular cards constructed with high-density `#1F2937`, framing suspect portraits or role seals.
- **Tactile State:** Subtle top-edge inner specular highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.15)`). Hover tilts card +2px on the Y-axis.
- **Concealed State:** Patterned grid overlay using angled hatching; tap-and-hold gestures reveal classified roles through a dynamic chromatic wipe animation.

### Buttons & Action Triggers
- **Primary Action (Accuse / Vote / Confirm):** High-saturation Violet (`#6366F1`) or Threat Crimson (`#EF4444`) with dark bold uppercase text (`#0B0F19`) or high-contrast white (`#FFFFFF`). Backlit with a focused 12px ambient glow of the same hue on hover.
- **Secondary (Inspect / Skip / Inquire):** Semi-transparent slate (`rgba(31, 41, 55, 0.6)`) with 1px border (`#374151`) and text in `#F9FAFB`.
- **Destructive / Elimination:** Outlined in Crimson Danger with smooth pulse keyframe on countdown.

### Chips & Clearance Badges
- Built using `label-sm` or `label-md` uppercase typography.
- Filled with low-opacity alpha tint (e.g., `rgba(16, 185, 129, 0.15)` for Innocents) and framed with a 1px solid rim (`#10B981`).
- Contains leading circular indicator: Solid green (Verified Detective), amber diamond (Undercover Suspect), or pulsing crimson skull (Confirmed Impostor).

### Input Fields & Secret Prompts
- Low-lit inputs (`#0B0F19`) with sharp 8px corners, framed in `#374151`.
- On focus, stroke transitions to `#6366F1` with an outer box shadow of `0 0 0 3px rgba(99, 102, 241, 0.25)`. Monospaced text cursor simulates an encrypted field terminal.

### Turn Timers & Voting Slates
- Circular SVG countdown gauges utilizing amber (`#F59E0B`) that shift smoothly to crimson (`#EF4444`) when under 5 seconds, accompanied by an amplified border pulse.