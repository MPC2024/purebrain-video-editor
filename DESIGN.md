---
name: "PureBrain Video Editor"
description: "Professional video editing platform for content creators, groomers, and social media professionals"
colors:
  - name: "background"
    light: "oklch(1 0 0)"
    dark: "oklch(0.08 0.005 280)"
    usage: "Primary background, editor canvas area"
  - name: "foreground"
    light: "oklch(0 0 0)"
    dark: "oklch(0.95 0.01 280)"
    usage: "Primary text, high contrast"
  - name: "card"
    light: "oklch(1 0 0)"
    dark: "oklch(0.12 0.005 280)"
    usage: "Panels, sidebars, property sheets"
  - name: "primary"
    light: "oklch(0.8512 0.1254 73.9788)"
    dark: "oklch(0.58 0.22 30)"
    usage: "Action buttons, active states, focus"
  - name: "accent"
    light: "oklch(0.9197 0.0677 76.018)"
    dark: "oklch(0.25 0.02 30)"
    usage: "Playback indicators, timeline markers, hover states"
  - name: "secondary"
    light: "oklch(0.9458 0.0454 76.3285)"
    dark: "oklch(0.20 0.01 280)"
    usage: "Secondary actions, tool buttons"
  - name: "destructive"
    light: "oklch(0.6356 0.2082 25.3782)"
    dark: "oklch(0.39 0.13 25)"
    usage: "Delete, remove, critical actions"
  - name: "muted"
    light: "oklch(0.9593 0.011 76.5971)"
    dark: "oklch(0.18 0.005 280)"
    usage: "Disabled states, secondary UI elements"
  - name: "border"
    light: "oklch(0.8978 0.0278 76.4745)"
    dark: "oklch(0.25 0.005 280)"
    usage: "Dividers, separators, panel borders"

typography:
  sans:
    name: "Outfit"
    weights: [300, 400, 500, 600, 700]
    usage: "Primary UI, buttons, labels, body text"
  mono:
    name: "Geist Mono"
    weights: [400, 500]
    usage: "Timecodes, technical values, frame counts, property inspector"
  heading:
    name: "Outfit"
    weights: [600, 700]
    usage: "Titles, section headers, modal titles"

spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"

radius:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"

shadows:
  xs: "0px 1px 3px 0px hsl(0 0% 0% / 0.09)"
  sm: "0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)"
  md: "0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17)"
  lg: "0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17)"
  xl: "0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17)"
  2xl: "0px 1px 3px 0px hsl(0 0% 0% / 0.43)"

---

## Overview

PureBrain Video Editor is a professional yet approachable video editing platform designed for content creators, pet groomers, and social media professionals who need powerful editing capabilities without complexity.

The design prioritizes a dark, professional editor environment (inspired by Premiere Pro, DaVinci Resolve) with vibrant accent colors to highlight important actions and states. The interface emphasizes ease of use through clear visual hierarchy, intuitive layouts, and consistent interaction patterns that work across desktop and mobile.

**Core Design Principles:**
- Dark editor aesthetic reduces eye strain during long editing sessions
- Vibrant primary accent (red/orange) for actions, selections, and important states
- Consistent spacing and alignment for predictability
- Clear information architecture: assets (left), canvas (center), properties (right), timeline (bottom)
- Resizable panels allow customization for different workflows
- Touch-friendly mobile tab bar for smaller screens

---

## Colors

### Dark Theme Palette (Primary)

The dark theme is the default, optimized for extended editing work:

| Token | Value | Purpose |
|-------|-------|---------|
| **background** | `oklch(0.08 0.005 280)` | Main canvas and editor background |
| **foreground** | `oklch(0.95 0.01 280)` | Primary text on dark backgrounds |
| **card** | `oklch(0.12 0.005 280)` | Panels, sidebars, property sheets |
| **card-foreground** | `oklch(0.95 0.01 280)` | Text on card backgrounds |
| **border** | `oklch(0.25 0.005 280)` | Panel borders, separators, dividers |
| **primary** | `oklch(0.58 0.22 30)` | Primary CTA buttons, active timeline elements |
| **primary-foreground** | `oklch(0.98 0 0)` | Text on primary buttons |
| **accent** | `oklch(0.25 0.02 30)` | Timeline markers, selection indicators |
| **accent-foreground** | `oklch(0.95 0.01 280)` | Text on accent elements |
| **secondary** | `oklch(0.20 0.01 280)` | Secondary action buttons, tool states |
| **muted** | `oklch(0.18 0.005 280)` | Disabled states, placeholders |
| **muted-foreground** | `oklch(0.65 0.01 280)` | Low-emphasis text |
| **destructive** | `oklch(0.39 0.13 25)` | Delete actions, warnings |

### Light Theme Palette (Secondary)

Available for users preferring a light interface:

| Token | Value | Purpose |
|-------|-------|---------|
| **background** | `oklch(1 0 0)` | White background |
| **foreground** | `oklch(0 0 0)` | Black text |
| **card** | `oklch(1 0 0)` | White card surfaces |
| **primary** | `oklch(0.8512 0.1254 73.9788)` | Golden/orange primary actions |

### Specialized Colors

| Token | Value | Usage |
|-------|-------|-------|
| **timeline-track** | `oklch(17.081% 0.02708 78.21)` | Timeline clip background, audio waveform |
| **guide-line** | `#00d8d6` | Alignment guides, snapping indicators (cyan) |
| **selection** | `rgba(0, 216, 214, 0.1)` | Selection highlight on clips |

---

## Typography

### Font Families

**Outfit** (Primary UI Font)
- Weights: 300, 400, 500, 600, 700
- Use for: All UI text, buttons, labels, body copy
- Characteristics: Modern, clean, excellent readability at all sizes

**Geist Mono** (Technical Information)
- Weights: 400, 500
- Use for: Timecodes (00:00:00.000), frame numbers, numerical property values
- Characteristics: Clear distinction for technical data, precise alignment

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1 / Modal Title** | 24px | 600 | 32px | Export modal titles, section headers |
| **H2 / Card Title** | 20px | 600 | 28px | Panel section titles |
| **H3 / Label** | 14px | 600 | 20px | Form labels, property panel headers |
| **Body / Regular** | 14px | 400 | 20px | UI body text, descriptions |
| **Body / Small** | 12px | 400 | 18px | Secondary text, timestamps |
| **Mono / Timecode** | 12px | 500 | 16px | Timeline timecodes, frame numbers |
| **Button** | 14px | 500 | 20px | All button text |

### Text Hierarchy

1. **Primary Action Text**: 500-600 weight, foreground color
2. **Secondary Information**: 400 weight, muted-foreground color
3. **Disabled/Placeholder**: 400 weight, muted color with reduced opacity
4. **Emphasis**: 600 weight on same color (no color change for accessibility)

---

## Layout

### Editor Layout Structure

The editor follows a 4-panel layout with flexible resizing:

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar (52px height) - Project name, save, export buttons    │
├────────────────────┬──────────────────────────────────────────┤
│                    │                                          │
│  Left Sidebar      │         Scene Canvas                     │
│  (Asset Library)   │      (Preview/Center)                    │
│  30% width         │        70% width                         │
│  Resizable         │                                          │
│                    │                                          │
├────────────────────┼──────────────────────────────────────────┤
│                    │                                          │
│  (Right panel      │     Timeline (Bottom)                    │
│   shown on         │     25-35% of screen height             │
│   tablet/desktop)  │     Resizable height                     │
│                    │                                          │
└────────────────────┴──────────────────────────────────────────┘
```

### Left Sidebar (Asset Library)
- **Width**: 30% default, 20-40% resizable range
- **Content**: Media browser, templates, stickers, music, sound effects
- **Sections**: Tabbed interface with smooth transitions
- **Scrolling**: Vertical scroll with custom scrollbar styling
- **Background**: Card color with subtle border

### Center Canvas (Scene Preview)
- **Background**: Dark background color
- **Content**: Video scene with playback controls overlaid
- **Responsive**: Fills remaining horizontal space
- **Resizing handles**: Distinct visual indicators between panels

### Timeline (Bottom)
- **Height**: 25-35% of viewport, user-resizable
- **Content**: Tracks, clips, transitions, keyframes on horizontal scroll
- **Appearance**: Clean grid with alternating track backgrounds
- **Interaction**: Click-to-select clips, drag-to-move, scrub playhead

### Mobile Layout (< 768px)
- **Stack vertically**: Scene 50% height, Timeline 50% height
- **Tab bar**: Bottom navigation for tool access (Media, Music, Effects, etc.)
- **No sidebar**: All tools accessible via mobile tab bar
- **Full-width**: Both canvas and timeline use full width

---

## Elevation & Depth

### Layering Strategy

**Layer 0 (Base)**
- Editor background
- Timeline background
- Panel backgrounds

**Layer 1 (Cards)**
- Property panels
- Sidebar sections
- Timeline tracks

**Layer 2 (Hoverable Elements)**
- Buttons, interactive controls
- Toolbar items
- Timeline clips (slight lift on hover)

**Layer 3 (Floating/Modal)**
- Floating control panels
- Tooltips
- Dropdown menus

**Layer 4 (Top)**
- Modal dialogs (export, project settings)
- Alert dialogs
- Loading indicators

### Shadow Depths

| Element | Shadow | Z-Index | Usage |
|---------|--------|---------|-------|
| Base surfaces | none | 0 | Backgrounds |
| Card/panel | shadow-sm | 10 | Sidebar, properties |
| Hover states | shadow-md | 20 | Buttons, toolbar items |
| Floating controls | shadow-lg | 30 | Floating toolbar |
| Modal overlay | shadow-xl | 40 | Semi-transparent overlay |
| Modal dialog | shadow-2xl | 50 | Modal dialogs |
| Tooltip | shadow-lg | 60 | Tooltip content |

### Color Depth (Dark Theme)

Subtle luminosity shifts create perceived depth without relying solely on shadows:

- **Base**: `oklch(0.08 0.005 280)` - Darkest
- **Panels**: `oklch(0.12 0.005 280)` - Slightly lighter
- **Accents**: `oklch(0.25 0.02 30)` - Distinctly lighter for interaction
- **Highlights**: Primary color at full saturation for focus states

---

## Shapes

### Rounded Corners

| Element | Radius | CSS Class |
|---------|--------|-----------|
| **Card/Panel** | 8px (md) | `rounded-md` |
| **Button** | 6px (sm) | `rounded-md` |
| **Input fields** | 6px (sm) | `rounded-md` |
| **Timeline clips** | 2px (sm) | `rounded-sm` |
| **Modal** | 12px (lg) | `rounded-lg` |
| **Badge/Tag** | 9999px (full) | `rounded-full` |

### Timeline Elements

- **Clips**: Sharp corners for professional appearance, 2px radius for selection handles
- **Playhead**: Sharp vertical line with accent color triangle pointer
- **Markers**: Circle shape with border for timeline marks
- **Keyframes**: Diamond shape with primary accent fill

### Button Shapes

- **Icon buttons**: Square with slight radius (6px)
- **Text buttons**: Pill-shaped with left/right padding
- **Split buttons**: Sharp divider between button and dropdown
- **Toggle buttons**: Rounded on all corners with active state indicator

---

## Components

### Navigation & Bars

**Navbar (Top)**
- Height: 52px
- Background: Card color with bottom border
- Content: Project name (editable), spacer, save/export buttons
- Sticky: Always visible when scrolling panels

**Mobile Tab Bar (Bottom)**
- Height: Varies (~64px)
- Background: Card color with top border
- Content: 8-12 icon buttons for major features (Media, Music, Effects, etc.)
- Scrollable: Horizontal scroll if icons exceed viewport
- Active state: Accent color underline or background

**Toolbar (Horizontal)**
- Height: 36px
- Icons: 20x20px, 4px gaps between
- Hover: Subtle background highlight
- Active: Accent color or primary color
- Groups: Separator lines between logical groups

### Panels

**Property Panel (Right Side)**
- Width: 280px (fixed or adaptive)
- Sections: Collapsible with disclosure triangles
- Spacing: 12px between sections, 8px padding inside
- Fields: Input, select, slider, color picker variants
- Labels: 12px, muted-foreground, above input

**Asset Library (Left Sidebar)**
- Tabs: Media, Templates, Stickers, Music, Sound Effects, Brand Kit
- Tab styling: Underline on active, text color change
- Grid layout: 2-3 column masonry for thumbnail items
- Item styling: Rounded corners, subtle shadow on hover
- Context menu: Right-click for actions (delete, duplicate, rename)

### Timeline

**Track Container**
- Background: Alternating dark/slightly lighter rows
- Height: 32px per track, vertical scroll
- Labels: 120px fixed left panel showing track name
- Draggable: Reorder tracks by dragging header

**Clip Element**
- Shape: Rectangle with 2px radius corners
- Background: Secondary color (muted orange/brown in dark theme)
- Border: 1px border on selection
- Text: Clip name (white, 11px mono), centered
- Handles: Resize handles on left/right edges (6px wide)
- Selection: Accent color border (2px), soft shadow

**Playhead**
- Height: Full timeline height
- Indicator: Thin accent color line with triangle pointer at top
- Draggable: Scrub along timeline
- Timecode display: Position above playhead

### Buttons

**Primary Button**
- Background: primary color
- Foreground: primary-foreground (white)
- Size: 36px height, 12px side padding
- Icon + text: 4px gap
- Hover: 10% darker background
- Active: 20% darker, accent color outline
- Disabled: Muted background, muted-foreground text

**Secondary Button**
- Background: secondary color or transparent
- Foreground: foreground color
- Border: 1px border when outline style
- Hover: Slight background shift
- Size: Same as primary (36px)

**Icon Button (Square)**
- Size: 36x36px
- Background: Transparent or secondary
- Icon: 20x20px centered
- Hover: Background tint
- Active: Background tint + border

**Ghost Button (Minimal)**
- Background: None
- Border: None
- Foreground: primary or accent color
- Hover: Subtle background highlight
- Used for: Secondary actions, links

### Inputs & Controls

**Text Input**
- Height: 32px
- Border: 1px border color
- Background: Input background (darker in dark theme)
- Padding: 8px left/right
- Border radius: 6px
- Focus: Ring color outline, 3px width
- Placeholder: Muted foreground at 60% opacity

**Select Dropdown**
- Similar to text input
- Chevron icon right-aligned
- Dropdown: Positioned below, card background
- Options: 32px height each, hover state
- Separator: Between grouped options

**Slider**
- Track: Muted background, 4px height
- Thumb: Primary color, 16px diameter circle
- Focus: Ring around thumb
- Labels: Mono font for numeric display
- Responsive: Full width of container

**Color Picker**
- Button style: Show current color swatch
- Picker: Popover-style modal
- Grid: Color palette or hue/saturation selector
- Input: Hex code input field below

### Timeline Player Controls

**Play/Pause Button**
- Triangle (play) or double bar (pause) icon
- Size: 24x24px
- Background: Primary color with rounded corners
- Hover: Slightly lighter primary
- Position: Bottom center of timeline

**Playback Speed Select**
- Display: Current speed (1.0x, 0.5x, etc.)
- Dropdown: Common speeds (0.25x - 2.0x)
- Style: Secondary button style
- Position: Timeline bottom left

**Volume Control**
- Icon: Speaker symbol
- Slider: Horizontal or vertical
- Range: 0-100%
- Position: Timeline bottom right

### Modals & Dialogs

**Export Modal**
- Width: 90% viewport or 500px max
- Background: Card color with border
- Header: Title + close button
- Content: Form fields (resolution, codec, quality)
- Actions: Cancel, Export buttons at bottom
- Overlay: Semi-transparent dark background

**Confirmation Dialog**
- Width: 400px
- Title: Bold, clear action description
- Message: Supporting text explaining action
- Actions: Primary (action), Secondary (cancel)
- Icon: Optional visual indicating action type

---

## Do's and Don'ts

### DO's ✓

- **DO** use the dark theme as primary UI
- **DO** use accent colors (orange/red family) for interactive elements and selections
- **DO** maintain consistent spacing using the spacing scale
- **DO** show clear visual feedback on hover and active states
- **DO** use Geist Mono for all timecodes and technical values
- **DO** keep panels resizable for flexibility
- **DO** provide keyboard shortcuts for power users
- **DO** group related tools in logical sections
- **DO** use tooltips to explain icon-only buttons
- **DO** test mobile layout with actual touch interactions
- **DO** provide clear visual indication of current tool/mode
- **DO** use accessibility-friendly contrast ratios (WCAG AA minimum)

### DON'Ts ✗

- **DON'T** use light theme as default (save for accessibility preference)
- **DON'T** create color contrast less than 4.5:1 for text
- **DON'T** use inline styles; always use Tailwind classes
- **DON'T** add emojis to UI; use icon library instead (Lucide, Phosphor, or Font Awesome)
- **DON'T** create fixed-width panels; always provide resizing handles
- **DON'T** hide critical tools behind multiple clicks
- **DON'T** use hover effects on touch devices without fallback
- **DON'T** display timecodes in non-monospace fonts
- **DON'T** create modals that block the entire timeline view
- **DON'T** use pure black or white; stick to color tokens
- **DON'T** nest more than 2 levels deep in dropdown menus
- **DON'T** ignore keyboard navigation; all UI must be keyboard accessible

---

## Video Editor Specific Rules

### Timeline Interaction Model
1. **Single-click**: Select clip
2. **Drag from edge**: Resize clip boundaries
3. **Drag from center**: Move clip to new position
4. **Double-click**: Open clip properties
5. **Right-click**: Context menu (delete, duplicate, effects)
6. **Shift+click**: Multi-select clips
7. **Ctrl+click**: Add/remove from selection

### Visual Feedback for Editor States
- **Playback active**: Primary color playhead indicator + animation
- **Clip selected**: Accent color 2px border + shadow
- **Clip hovered**: Shadow-md + slight highlight
- **Scrubbing timeline**: Accent color with no snap effect until release
- **Editing property**: Primary color indicator in property panel
- **Unsaved changes**: Indicator in navbar (dot or asterisk)

### Performance Considerations
- Lazy-load large media in library
- Virtualize long timeline tracks (render only visible)
- Debounce property panel inputs (200ms)
- Cache rendered thumbnails for clips
- Use CSS transforms for smooth animations (not layout changes)

---

## Accessibility

### Color Accessibility
- All UI has minimum 4.5:1 contrast ratio for text
- Don't rely on color alone for status indication
- Provide text labels for all icon buttons
- Test with contrast checkers (WebAIM)

### Motion & Animation
- Respect `prefers-reduced-motion` media query
- Avoid autoplay animations
- Allow animation to be pausable
- Keep animations under 500ms for most interactions

### Keyboard Navigation
- All interactive elements reachable via Tab key
- Logical tab order (left-to-right, top-to-bottom)
- Keyboard shortcuts displayed in tooltips
- Escape key closes modals/dropdowns

### Screen Readers
- Use semantic HTML elements
- Provide alt text for visual indicators
- Announce state changes (e.g., "clip selected")
- Use `aria-label` for icon buttons

---

## Design Tokens Reference

See `src/app/globals.css` for complete token definitions.

**Color Token Naming Convention:**
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--card`, `--card-foreground`
- `--background`, `--foreground`
- `--border`, `--input`, `--ring`
- `--muted`, `--muted-foreground`

**Spacing Token Naming Convention:**
- `p-*` (padding): `p-1`, `p-2`, `p-3`, `p-4`, `p-6` (uses 4px base)
- `m-*` (margin): `m-1`, `m-2`, etc.
- `gap-*` (flex gap): `gap-2`, `gap-3`, etc.

**Radius Token Naming Convention:**
- `rounded-sm`: 2px (sharp, technical elements)
- `rounded-md`: 6px (buttons, inputs, cards)
- `rounded-lg`: 8px (panels, modals)
- `rounded-full`: 9999px (badges, pills)

---

**Document Version**: 1.0
**Last Updated**: 2026-05-28
**Maintained By**: Design System Team
