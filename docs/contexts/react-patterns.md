# React Patterns

The following conventions apply to all react code. 
Ignore when working on non-react code.

## Version & Features
- Assume React 19.2 as the target version and use its new features
- Use JSX without explicit imports (React 19)
- Use built-in hooks for state management (useState, useEffect, use())
- Use native Suspense and error boundaries
- Use functional components with explicit return types

## Component Patterns
- Functional components with explicit return types
- Prefer composition over inheritance
- Use custom hooks for reusable logic
- Implement proper error boundaries

## State Management
- **Signals**: Use `@preact/signals-react` for shared state, especially when bridging with Lit.
- `useState` for local component state
- `useEffect` for side effects and lifecycle
- `use()` for concurrent features
- Context API for cross-component state when appropriate

## Hybrid Interop
- **Events**: Listen for custom events dispatched by parent Lit components using standard React event handlers (or `useLayoutEffect` for custom events if needed).
- **Props**: Pass data to React components via standard props.
- **Context**: Be aware that React Context does not automatically traverse the Shadow DOM boundary. Use Signals or specific bridges for cross-boundary state.

## Performance
- Use React.memo for expensive components
- Implement proper key props in lists
- Avoid unnecessary re-renders with useCallback/useMemo
