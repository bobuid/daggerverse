# Styling Conventions

Different packages may use different UI frameworks and styling conventions, see the local AGENTS.md for details.

## Design Tokens
- **Lit Components**: Use CSS Custom Properties (Variables) derived from the design system (e.g., `var(--primary)`, `var(--radius)`).
- **React Components**: Use Tailwind utility classes which map to these same tokens.
- **Consistency**: Ensure both frameworks consume the same source of truth for colors, spacing, and typography.

## UI frameworks
- **Preferred architecture** is hybrid (again see the local AGENTS.md for details): Lit (App Shell) + React (Views)
- [Adobe's Spectrum 2](https://react-spectrum.adobe.com/s2/index.html?path=/) (CSS, w/c, React)
- ByteDance's Semi Design (@douyinfe/semi-ui-19@alpha or newer) |

## Tailwind CSS
- Tailwind CSS is not our primary styling framework, we use it for inline handy corrections mostly 
- Prefer Tailwind utilities over inline styles
- Use custom CSS variables for theming
- Apply glassmorphism effects with backdrop blur
- When using imported components, use direct style props when necessary to override defaults

## Color System
- Use OKLCH color space for consistency
- Primary palette: Slate, blue, purple, pink gradients
- Semantic colors: Green (success), gray (neutral)
- Glass effects: White/10 to White/20 transparency

## Visual Effects
- Backdrop blur: xl (24px) to 2xl (40px)
- Transitions: 150ms duration with ease timing
- Border radius: 2xl (1rem), 3xl (1.5rem)

## Typography
- Font families:
  - Brand: ALC Copycat
  - Normal: Adobe Clean
  - Major headings: Podkova
  - Minor headings and emphasis: Sofia Sans
  - Code: Victor
- Scale: xs (0.75rem) to 7xl (4.5rem)
- Weights: normal (400), medium (500)
