---
name: legend-state
description: Legend State patterns for observable linking and reactive access.
applyTo: "src/**/*.{ts,tsx}"
---

## Legend State Patterns

### Two-way linking with computed observables
- A computed function that returns an observable creates a two-way link
- This works both when defined inside an `observable()` object AND with `useObservable(() => someObservable)`

### Reactive access
- Calling `.get()` or `.peek()` on a computed returns the **value**, not the linked observable
- To maintain the link, access properties on the computed without calling `.get()`
