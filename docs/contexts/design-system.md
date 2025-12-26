# Design System

## Color Palette
- **Primary**: Slate, blue, purple, pink gradients
- **Semantic**: Green (success), gray (neutral)
- **Glass Effects**: White/10 to White/20 transparency
- **Backdrop Blur**: xl (24px) to 2xl (40px)

## Typography
- **Font Families**: System fonts with fallbacks
- **Scale**: xs (0.75rem) to 7xl (4.5rem)
- **Weights**: normal (400), medium (500)
- **Custom**: Podkova, Sofia Sans

## Spacing & Layout
- **Breakpoints**: SM (640px), MD (768px), LG (1024px), XL (1280px)
- **Max Widths**: 2xl (42rem) to 7xl (80rem)
- **Border Radius**: 2xl (1rem), 3xl (1.5rem)
- **Transitions**: 150ms duration with ease timing

## Component Architecture

### BaseGlassBanner
Responsive banner with 4 variants:
- **XL (1280px+)**: Full features - subtitle, pills, image, badge, bottom strip
- **LG (1024px+)**: No bottom strip, no floating badge
- **MD (768px+)**: No subtitle, no info pills
- **SM (640px+)**: Text only, minimal design

### ShaderBackground
Canvas-based animated background:
- Dynamic gradient animations
- Moving circular elements
- Blend mode effects for visual depth
