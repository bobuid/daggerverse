# Lit Patterns

The following conventions apply to code or parts of code that use lit. 
Ignore when working on non-lit code.
Codes using Adobe Spectrum Web Components libraries are also lit based and subject to these rules.

## Version & Features
- Assume lit latest as the target version and use its new features
- Use decorators for properties and custom elements (`@customElement`, `@property`, `@state`)
- Use `css` tag for styles and `html` tag for templates

## Component Patterns
- **Adobe Spectrum**: Use Adobe Spectrum Web Components (`@spectrum-web-components/*`) for UI primitives.
- **React Interop**: Use `@lit/react` to wrap Lit components for React consumption if needed, or use the `AppMainWc` pattern for the shell.
- **Shadow DOM**: Default to Shadow DOM for style encapsulation. Use `createRenderRoot` returning `this` only if global styles (Tailwind) are strictly necessary and cannot be adopted via constructed stylesheets.

## State Management
- **Signals**: Use `@lit-labs/preact-signals` to consume signals in Lit components.
- **Reactive Properties**: Use `@property` for public API and `@state` for internal reactive state.
- **Context**: Use `@lit/context` for dependency injection and cross-component state where signals are not appropriate.

## Performance
- **Render Updates**: Ensure `render()` is pure and fast.
- **Directives**: Use directives like `repeat`, `when`, `classMap`, and `styleMap` for efficient rendering.
- **Lazy Loading**: Use dynamic imports for heavy dependencies or routes.
