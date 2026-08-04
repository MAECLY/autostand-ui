# @autostand/ui

The autostand design system: design tokens, 24 base components, the custom icon set, the self-hosted brand
fonts, and the Storybook that documents all of it.

This package is the single source of truth for how autostand looks. It is consumed by:

| Surface | Repo |
| --- | --- |
| The desktop app | [`MAECLY/autostand`](https://github.com/MAECLY/autostand) |
| The marketing site | [`MAECLY/autostand-landing-page`](https://github.com/MAECLY/autostand-landing-page) |

## Using it

It is a private repo, so consumers install it straight from git:

```jsonc
// package.json
{
  "dependencies": {
    "@autostand/ui": "github:MAECLY/autostand-ui#main"
  }
}
```

The package ships **source**, not a build — one less build step to keep in sync, and consumers already run a
bundler. Next.js needs it added to `transpilePackages`; Vite handles it as-is.

```tsx
import "@autostand/ui/styles.css";                        // Tailwind v4 + tokens + fonts, import once
import { Button } from "@autostand/ui/components/button";
import { PipelineIcon } from "@autostand/ui/icons";
import { cn } from "@autostand/ui/lib/utils";
```

Tailwind v4 cannot auto-detect classes inside `node_modules`, so point it at the package from your own CSS:

```css
@import "@autostand/ui/styles.css";
@source "../node_modules/@autostand/ui/components";
```

### Entry points

| Import | What |
| --- | --- |
| `@autostand/ui/styles.css` | Tailwind v4 + `@theme` token mapping + `@font-face`. The one import that matters. |
| `@autostand/ui/tokens.css` | Raw tokens only, no Tailwind — for a surface with its own Tailwind setup. |
| `@autostand/ui/components/<name>` | A single base component (tree-shakes best). |
| `@autostand/ui/components` | The barrel, for when you want several. |
| `@autostand/ui/icons` | The custom icon set as React components. |
| `@autostand/ui/lib/utils` | `cn()` — clsx + tailwind-merge. |

## Developing

```bash
pnpm install
pnpm storybook          # http://localhost:6006
pnpm lint && pnpm typecheck && pnpm build-storybook
```

Storybook publishes to GitHub Pages on every push to `main`.

## What is here

- `tokens/tokens.css` — primitive scales feeding semantic tokens; `.dark` overrides the semantic layer only.
  Every pair meets WCAG AA in both themes.
- `styles/globals.css` — the Tailwind v4 setup and the `@theme` mapping. Consumers import this, not Tailwind.
- `styles/fonts.css` + `fonts/` — Inter and JetBrains Mono, latin subsets, SIL OFL. Self-hosted so no surface
  depends on a font CDN at runtime.
- `components/` — 24 base components (Radix + CVA), each with a `.stories.tsx`. Pure presentation: no data
  fetching, no app types, no Tauri.
- `icons/` — the six concepts lucide does not cover, drawn to lucide's conventions.

Components use **relative** imports internally (`../lib/utils`): the `@/` alias means something different in
every consuming project, so it is banned here.

## Conventions

Design decisions live in the main repo's docs — `docs/design-system/` in
[`MAECLY/autostand`](https://github.com/MAECLY/autostand) — covering the token inventory, the component specs,
the brand and the Storybook setup.
