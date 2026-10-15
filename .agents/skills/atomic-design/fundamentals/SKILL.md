---
name: atomic-design-fundamentals
description: Core Atomic Design methodology modernized with Tailwind CSS (v4), 6-tier hierarchy (quarks, core primitives, molecules, organisms, templates, pages), organization strategies, and composition rules.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Atomic Design Fundamentals

Master Brad Frost's Atomic Design methodology modernized for **Tailwind CSS (v4)** and component-driven architecture. In this modernized framework, design tokens map to **Quarks via Tailwind `@theme`**, and traditional Atoms are structured as **Core UI Primitives under `src/components/core/`**.

---

## Overview

Atomic Design models user interfaces hierarchically, inspired by chemistry. Just as atoms combine to form molecules, which combine to form organisms, UI components follow a strict hierarchical structure:

0. **Quarks (Level 0)** — Design tokens declared via Tailwind CSS v4 `@theme` & CSS variables (colors, spacing, typography scales, shadows, radii)
1. **Core Primitives / Atoms (Level 1)** — Indivisible UI primitives in `components/core/` (Button, Input, Label, Badge, Avatar, Checkbox, Icon) built with Tailwind & `cva`
2. **Molecules (Level 2)** — Groups of core primitives functioning together (SearchForm, FormField, NavItem, MediaObject)
3. **Organisms (Level 3)** — Complex, standalone UI sections (Header, Footer, Sidebar, DataTable, ProductCard)
4. **Templates (Level 4)** — Layout skeletons with responsive grids/slots without hardcoded data
5. **Pages (Level 5)** — Concrete route views populated with live data, route parameters, and API queries

---

## The Six Stages

### 0. Quarks (Level 0)

The foundational design values and constants that define your design language. Quarks are pure values declared via Tailwind CSS v4 `@theme` or CSS variables, not DOM components:

**Examples:**
- Semantic color tokens (`--color-primary`, `--color-destructive`, `--color-background`)
- Spacing scales (`--spacing-xs`, `--spacing-md`, `--spacing-xl`)
- Typography clamps & font families (`--font-sans`, `--font-mono`)
- Border radii (`--radius-sm`, `--radius-md`, `--radius-lg`)
- Elevation shadows (`--shadow-sm`, `--shadow-md`)

**Characteristics:**
- Pure tokens and values, no DOM elements
- Cannot import from any component layer
- Single source of truth for design tokens

---

### 1. Core Primitives / Atoms (Level 1)

The smallest functional, indivisible UI units of your interface. In modern architecture, **Core Primitives live in `src/components/core/`**, replacing legacy `components/atoms/` and custom `.module.css` files:

**Examples:**
- `<Button>`
- `<Input>`
- `<Label>`
- `<Icon>`
- `<Badge>`
- `<Avatar>`
- `<Checkbox>`
- `<Typography>` (Heading, Text)

**Characteristics:**
- Reside under `src/components/core/`
- Styled exclusively with Tailwind CSS utility classes and `cva`
- Strictly controlled and stateless (no business logic)
- Extends native HTML element attributes and forwards refs
- Merges classNames via `cn()` helper

---

### 2. Molecules (Level 2)

Focused combinations of core primitives working together as a single functional unit:

**Examples:**
- `FormField` (`Label` + `Input` + error `Text`)
- `SearchForm` (`Input` + `Button` + `Icon`)
- `MediaObject` (`Avatar` + `Heading` + `Text`)
- `CardHeader` (`Icon` + title `Heading` + action `Button`)
- `NavItem` (`Icon` + label `Text` + active state)

**Characteristics:**
- Composed of Core primitives and Tailwind utility layouts
- Single focused purpose
- May contain ephemeral UI state (e.g. open/closed, focus, hover)

---

### 3. Organisms (Level 3)

Complex, self-contained sections of an interface that could stand independently:

**Examples:**
- `Header` (Logo + `NavItem` list + `SearchForm` + user `Avatar`)
- `Footer` (Links grid + copyright + newsletter form)
- `ProductCard` (Image + title + price badge + add-to-cart `Button`)
- `DataTable` (Header row + pagination + row action buttons)
- `Sidebar` (Brand header + grouped navigation links + user menu)

**Characteristics:**
- Composed of Molecules, Core primitives, and sibling Organisms
- Distinct, reusable full sections
- May consume custom hooks for composite state management

---

### 4. Templates (Level 4)

Page-level skeletal layouts that position organisms into responsive grids and viewports using slots or children:

**Examples:**
- `MainLayout` (Header + main slot + Footer)
- `DashboardLayout` (Collapsible Sidebar + top bar + main content grid)
- `AuthLayout` (Split screen with brand visual panel + form slot)

**Characteristics:**
- Layout-only skeletons with slots / children
- Responsive layout containers (`min-h-screen`, `grid`, `flex-1`)
- No hardcoded copy, domain state, or API calls

---

### 5. Pages (Level 5)

Concrete route instances that hydrate templates with live data, route params, and user state:

**Examples:**
- `HomePage` with real hero copy and featured products
- `DashboardPage` with live analytics charts and user metrics
- `UserProfilePage` with form validation and profile mutations

---

## Directory Structure

### Modern Recommended Structure

```text
src/
├── app/
│   ├── globals.css               # Level 0: Quarks / Tailwind v4 @theme directive
│   ├── layout.tsx                # App root layout
│   └── page.tsx                  # Level 5: Concrete Page
├── lib/
│   └── utils.ts                  # cn() helper: clsx + tailwind-merge
├── components/
│   ├── core/                     # Level 1: Core UI Primitives (replacing components/atoms/)
│   │   ├── Button/
│   │   │   ├── Button.tsx        # Styled with cva & Tailwind classes
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Label/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Checkbox/
│   │   ├── Icon/
│   │   ├── Typography/
│   │   └── index.ts              # Core primitives barrel
│   ├── molecules/                # Level 2: Molecules
│   │   ├── FormField/
│   │   │   ├── FormField.tsx     # Composes Label + Input from @/components/core
│   │   │   └── index.ts
│   │   ├── SearchForm/
│   │   ├── NavItem/
│   │   └── index.ts              # Molecules barrel
│   ├── organisms/                # Level 3: Organisms
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── ProductCard/
│   │   └── index.ts              # Organisms barrel
│   ├── templates/                # Level 4: Templates
│   │   ├── MainLayout/
│   │   ├── DashboardLayout/
│   │   └── index.ts              # Templates barrel
│   └── index.ts                  # Unified components barrel
```

---

## Import Patterns & Barrel Exports

### 1. Core Primitives Barrel

```typescript
// src/components/core/index.ts
export { Button, buttonVariants } from './Button/Button';
export type { ButtonProps } from './Button/Button';

export { Input, inputVariants } from './Input/Input';
export type { InputProps } from './Input/Input';

export { Label } from './Label/Label';
export { Icon } from './Icon/Icon';
export { Avatar, avatarVariants } from './Avatar/Avatar';
export { Badge, badgeVariants } from './Badge/Badge';
export { Checkbox } from './Checkbox/Checkbox';
export { Text, Heading } from './Typography';
```

### 2. Upward Composition Import

```typescript
// src/components/molecules/FormField/FormField.tsx
import { Label } from '@/components/core/Label';
import { Input } from '@/components/core/Input';
import { Text } from '@/components/core/Typography';
```

```typescript
// Clean consumption from upper layers
import { Button, Input, Badge } from '@/components/core';
import { FormField, SearchForm } from '@/components/molecules';
import { Header, Footer } from '@/components/organisms';
```

---

## Composition Rules

### Strict Hierarchy

```text
Quarks (Tailwind Tokens) -> Used by: Core, Molecules, Organisms, Templates, Pages
Core Primitives          -> Used by: Molecules, Organisms, Templates, Pages
Molecules                -> Used by: Organisms, Templates, Pages
Organisms                -> Used by: Templates, Pages
Templates                -> Used by: Pages
Pages                    -> Root view (not imported by other UI layers)
```

### Valid Compositions

```tsx
// 1. Core primitive using Tailwind theme tokens via cva
// src/components/core/Button/Button.tsx
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90'
);

// 2. Molecule composing Core primitives
// src/components/molecules/SearchForm/SearchForm.tsx
export const SearchForm = ({ onSearch }: { onSearch: (q: string) => void }) => (
  <form className="flex items-center gap-2">
    <Input placeholder="Search..." className="w-64" />
    <Button type="submit">Search</Button>
  </form>
);

// 3. Organism composing Molecules and Core primitives
// src/components/organisms/Header/Header.tsx
export const Header = () => (
  <header className="flex items-center justify-between border-b px-6 py-4">
    <div className="font-bold text-xl">Brand</div>
    <SearchForm onSearch={(q) => console.log(q)} />
    <Avatar src="/avatar.png" alt="User" />
  </header>
);
```

### Invalid Compositions (Strictly Forbidden)

```typescript
// ❌ ILLEGAL: Core primitive importing a Molecule
// src/components/core/Button/Button.tsx
import { FormField } from '@/components/molecules/FormField'; // ERROR: Upward import

// ❌ ILLEGAL: Molecule importing an Organism
// src/components/molecules/SearchForm/SearchForm.tsx
import { Header } from '@/components/organisms/Header'; // ERROR: Upward import

// ❌ ILLEGAL: Core primitive using custom CSS module instead of Tailwind
// src/components/core/Button/Button.tsx
import styles from './Button.module.css'; // ERROR: Anti-pattern, use Tailwind + cva
```

---

## Common Pitfalls & Best Practices

| Pitfall | Problem | Solution |
|---|---|---|
| **Custom CSS Islands** | Breaking design consistency with `.module.css` | Use Tailwind CSS utility classes and `cva` |
| **Over-Atomization** | Wrapping single HTML tags in redundant micro-atoms | Keep primitives practical (`Button`, `Input`, `Badge`) |
| **Business Logic in Core** | Placing API calls or routing in `components/core` | Keep Core primitives pure and presentational; lift logic to hooks or pages |
| **Direct Hex Colors** | Hardcoding `#3b82f6` in utility classes | Use semantic tokens: `bg-primary`, `border-border`, `text-muted-foreground` |

---

## Related Subskills

- [Atomic Design Hub](../SKILL.md) — Master methodology and subskill routing
- [Quarks](../quarks/SKILL.md) — Tailwind v4 `@theme` tokens, CSS variables, and primitive values
- [Atoms (Core UI)](../atoms/SKILL.md) — Indivisible Core UI primitives in `components/core/`
- [Molecules](../molecules/SKILL.md) — Functional atom combinations (form fields, search inputs)
- [Organisms](../organisms/SKILL.md) — Standalone UI sections (headers, footers, data tables)
- [Templates](../templates/SKILL.md) — Page layout skeletons with slot-based content
- [Integration](../integration/SKILL.md) — Framework integration (React/Next.js, Vue 3, Storybook, Vitest)
