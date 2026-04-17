# VrVitalis

React Native / Expo app targeting **low-end Android 11 and iOS 15 devices** with small RAM and slow CPUs, built for **users aged 60+**. Performance, accessibility, and clarity are non-negotiable.

## Stack

- **Runtime:** Expo 55, React Native 0.83, React 19
- **Language:** TypeScript 5.9 (`strict: true`)
- **UI:** [gluestack-ui v3](src/components/ui/) + [NativeWind 4](tailwind.config.js) (Tailwind classes via `className`)
- **Navigation:** `@react-navigation/native` v7
- **State:** Zustand 5 (no React Context)
- **Data fetching:** TanStack Query 5 + Axios
- **Lists:** `@shopify/flash-list` (never `FlatList`)
- **Animation / gestures:** `react-native-reanimated` 4 + `react-native-worklets` + `react-native-gesture-handler`
- **i18n:** `i18next` (no hardcoded user-facing strings)
- **Testing:** Jest + `jest-expo`

Path alias: `@/*` → `src/*`. Asset alias: `@/assets/*` → `assets/*`.

## Folder layout

```
src/
  api/         axios clients, query/mutation hooks, endpoint wrappers
  components/  shared presentational + ui/ (gluestack primitives — do not edit)
  hooks/       reusable hooks (non-data; data hooks live in api/)
  routes/      react-navigation stacks, navigators, linking config
  screens/     screen-level components; can nest their own types/, components/
  stores/      zustand stores (one file per slice)
  tests/       jest suites for core logic
  types/       global shared types (domain-scoped types live next to their screen/feature)
```

Domain-scoped types live in `<domain>/types/`. Only put a type in `src/types/` if it is truly global.

## Core rules

### Components
- **Always `function Foo() {}`, never `const Foo = () => {}`.** Clean stack traces matter for debugging on-device.
- Every user-facing component gets accessibility props: `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` where relevant. Hit targets ≥ 48dp. Default font sizes generous — our users are 60+.
- Import UI primitives from [src/components/ui/](src/components/ui/) (Button, Input, VStack, HStack, Text, Heading, Card, Modal, Select, Toast, Spinner, Skeleton, Pressable, FormControl, Avatar, Icon, Image, Menu, Grid, Tooltip). Do not reach for raw `react-native` `View`/`Text` when a gluestack equivalent exists.
- Style with NativeWind `className`. **Do not use `StyleSheet.create` unless you have a concrete reason** (e.g. dynamic style that truly cannot be expressed in classes). Prefer `className` + `tailwind-variants` for variants.

### React patterns
- **Avoid `useEffect`.** Derive values during render, use event handlers, `useSyncExternalStore`, TanStack Query for async, and Zustand subscriptions. Only reach for `useEffect` for genuine subscriptions/imperative DOM-like setup with cleanup — and document *why* in a one-line comment.
- **No React Context.** Use Zustand.
- Memoize hot paths (`useMemo`, `useCallback`, `React.memo`) — we are on slow CPUs. Trade memory for speed on large/common operations (precompute lookup maps, cache derived lists, stable selector references).
- Move animation and scroll-derived math into **Reanimated worklets** (`useAnimatedStyle`, `useDerivedValue`, `runOnUI`) to stay off the JS thread.

### TypeScript
- **Never `any`.** Use `unknown` + narrowing, or generics.
- Prefer `Pick`, `Omit`, `Partial`, `Required`, template literal types, `satisfies`, and user-defined **type guards** (`function isX(v: unknown): v is X`) for boundary validation (API responses, storage reads).
- Target latest language features available in TS 5.9 (`satisfies`, const type params, `using`/`Symbol.dispose` when useful).
- Export types from a `types.ts` barrel within each domain folder.

### Zustand
- One store per domain slice; colocate in [src/stores/](src/stores/).
- **Always subscribe with narrow selectors** to avoid rerenders:
  ```ts
  // good
  const name = useUserStore((s) => s.name);
  // bad — rerenders on any store change
  const { name } = useUserStore();
  ```
- For multi-field reads use `useShallow` from `zustand/react/shallow`.
- Keep actions in the store (`set`, `get`), not in components. Components read state + call actions.
- Split hot/cold state into separate stores when a slice grows — rerender cost is per-store.

### Data fetching
- Axios instance(s) in [src/api/](src/api/) with interceptors for auth, error normalization, and i18n-aware error messages.
- Wrap every endpoint in a TanStack Query hook (`useXQuery`, `useXMutation`) — screens never call axios directly.
- Use stable query keys (`['user', id] as const`). Set sane `staleTime` / `gcTime` — on low-RAM devices we want caches to evict.
- Use `select` to narrow query data so consumers rerender only when their slice changes.

### Lists
- `FlashList` only. Provide `estimatedItemSize`, stable `keyExtractor`, and memoized `renderItem`. For heterogeneous rows set `getItemType`.

### i18n
- All user-visible strings go through `i18next` (`t('namespace.key')`). No inline English in JSX.
- Keys grouped by screen/domain namespace. Plurals and interpolation via i18next, not manual string concat.

### Accessibility & UX for 60+ users
- Large default type, high contrast, clear focus states, descriptive labels, confirmations before destructive actions, forgiving tap targets, minimal jargon.
- Respect system font scaling — do not lock font sizes.
- Show `Skeleton` / `Spinner` from the gluestack primitives during loading; never a blank screen.

### Performance on low-end devices
- Prefer precomputed maps/indexes over repeated `Array.find` in render.
- Avoid unnecessary re-encoding (e.g. JSON) in render paths.
- Keep bundle lean; lazy-load heavy screens via navigation.
- Animate on UI thread (Reanimated), not JS thread.
- Avoid large inline object/array literals in props — they break memoization.

## Testing

- Jest via `jest-expo`. Tests live in [src/tests/](src/tests/) or colocated `__tests__`.
- Test **core logic** (stores, reducers, type guards, api transformers, hook logic). Do not aim for coverage of trivial presentational components.

## Tooling

- `npm run lint` / `npm run lint:fix` — ESLint flat config
- `npm run format` / `npm run format:check` — Prettier (with `prettier-plugin-tailwindcss` for class sorting)
- `npm run start` / `npm run android` / `npm run ios`

## Line endings

**All files must use LF (`\n`).** This is enforced by:
- `.gitattributes` — git normalises all text files to LF on checkout
- `.vscode/settings.json` — `"files.eol": "\n"`
- ESLint — `linebreak-style: unix` + Prettier `endOfLine: lf`

## What not to do

- No `any`. No `StyleSheet.create` (by default). No `FlatList`. No React Context. No arrow-function components. No raw hardcoded strings in UI. No `useEffect` as the default for async or derived state. No wide Zustand selectors. No editing of [src/components/ui/](src/components/ui/) generated files.
