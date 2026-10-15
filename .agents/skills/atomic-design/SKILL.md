---
name: atomic-design
description: Architecting and organizing UI components using Brad Frost's Atomic Design methodology modernized with Tailwind CSS (v4), Quarks (design tokens / @theme), and Core UI primitives replacing traditional atoms (src/components/core/). Enforces hierarchical import boundaries, component classification (quarks, core primitives, molecules, organisms, templates, pages), and subskill routing.
when_to_use: "When organizing, creating, or refactoring UI components into an atomic hierarchy (quarks, core primitives, molecules, organisms, templates, pages); setting up design system component folders; enforcing strict upward/downward import boundaries between component levels; or designing scalable Tailwind CSS component libraries. Routes to specialized subskills for fundamentals, quarks, atoms (core UI primitives), molecules, organisms, templates, and framework integration."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Atomic Design — Component Hierarchy & Subskill Orchestrator

> Modernized Brad Frost Atomic Design methodology featuring **Quarks (Tailwind v4 @theme & CSS Tokens)**, **Core UI Primitives (`components/core/`) replacing traditional Atoms**, **Strict Hierarchical Import Validation**, and **Tailwind CSS (`cva` + `cn`) Utility Architecture**.
> Master router providing foundational principles, architectural boundaries, and direct routing to deep-dive subskills.

---

## 📑 Subskill Routing (Specialized Knowledge)

Atomic Design in Anti-Kit is organized into modular subskills. Use this routing matrix to load the exact deep-dive guide needed:

| Subskill | Focus Area & When to Read | Quick Link |
|---|---|---|
| **Fundamentals** | Core philosophy, the 6 stages, naming standards, barrel exports, and composition rules | [Read Fundamentals](./fundamentals/SKILL.md) |
| **Quarks** | Design tokens, Tailwind CSS v4 `@theme` directives, CSS variables, and theme contracts | [Read Quarks](./quarks/SKILL.md) |
| **Atoms (Core UI)** | Indivisible Core UI primitives in `components/core/` (Button, Input, Label, Icon, Avatar, Badge, Checkbox, Typography) styled with Tailwind CSS & `cva` | [Read Atoms / Core UI](./atoms/SKILL.md) |
| **Molecules** | Functional combinations of core primitives (FormField, SearchInput, MediaObject, NavItem, CardHeader, StatItem) | [Read Molecules](./molecules/SKILL.md) |
| **Organisms** | Standalone complex sections (Header, Footer, ProductCard, CommentSection, Sidebar, DataTable) | [Read Organisms](./organisms/SKILL.md) |
| **Templates** | Page layout skeletons, slot-based architectures, responsive layout grids, and placeholder systems | [Read Templates](./templates/SKILL.md) |
| **Integration** | Framework patterns (React/Next.js, Vue 3, Angular), Tailwind CSS setup, Storybook workshops, Vitest/RTL unit tests, and path aliases | [Read Integration](./integration/SKILL.md) |

---

## 1. The Six Stages Overview

Atomic Design models user interfaces hierarchically, inspired by chemistry, unified with modern utility-first component engineering:

```
[Level 0: Quarks]          Design tokens (Tailwind @theme tokens, CSS variables, colors, spacing, radii, shadows)
       ↓
[Level 1: Core Primitives] Indivisible Core UI primitives in components/core/ (Button, Input, Label, Icon, Badge, Box)
       ↓
[Level 2: Molecules]       Functional groups of core primitives (SearchBar, FormField, StatItem, NavLink)
       ↓
[Level 3: Organisms]       Complex UI sections (Header, Footer, DataTable, ProductCard)
       ↓
[Level 4: Templates]       Layout skeletons with slots & placeholders (PageLayout, DashboardTemplate)
       ↓
[Level 5: Pages]           Concrete route views populated with real data (HomePage, DashboardPage)
```

### Core Hierarchy Definitions

1. **Quarks (Level 0)**: Pure design values and constants without DOM elements. Colors, typography clamp scales, spacing increments, elevation shadows declared via Tailwind CSS v4 `@theme` or CSS variables. See [Quarks Subskill](./quarks/SKILL.md).
2. **Core Primitives / Atoms (Level 1)**: Smallest functional, indivisible UI elements that cannot be broken down further without losing utility (`<Button>`, `<Input>`, `<Icon>`). In this architecture, they reside in `src/components/core/` and are built using Tailwind CSS utility classes and `cva` (Class Variance Authority). See [Atoms / Core UI Subskill](./atoms/SKILL.md).
3. **Molecules (Level 2)**: Focused combinations of multiple core primitives acting together as a single functional unit (`<FormField>` = Label + Input + Error). See [Molecules Subskill](./molecules/SKILL.md).
4. **Organisms (Level 3)**: Distinct, self-contained sections of an interface that could stand alone (`<Header>`, `<DataTable>`, `<ProductCard>`). Composed of molecules, core primitives, and layout utilities. See [Organisms Subskill](./organisms/SKILL.md).
5. **Templates (Level 4)**: Page-level skeletal layouts that position organisms into responsive grids using slots or children, without real data. Built with Tailwind flex/grid layout utilities. See [Templates Subskill](./templates/SKILL.md).
6. **Pages (Level 5)**: Concrete route instances of templates hydrated with live data, route parameters, and API queries.

---

## 2. Component Classification Decision Tree

When building or reviewing a component, use this mental flow to classify it into the correct atomic layer:

```
Is it a raw design value (color, spacing, font, shadow) without DOM elements?
  ├── YES → QUARK (Level 0 - Tailwind @theme / CSS vars)
  └── NO  → Does it render HTML?
             ├── Can it be decomposed into smaller functional UI elements?
             │     ├── NO  → CORE PRIMITIVE / ATOM (Level 1: components/core/)
             │     └── YES → Does it represent a standalone, full-featured UI section?
             │                ├── NO  → Is it a tight group of core primitives with a single purpose (e.g. search bar)?
             │                │          ├── YES → MOLECULE (Level 2: components/molecules/)
             │                │          └── NO  → ORGANISM (Level 3: components/organisms/)
             │                └── YES → Does it define entire viewport layout with placeholders?
             │                           ├── YES → TEMPLATE (Level 4: components/templates/)
             │                           └── NO  → Does it bind real data / route parameters?
             │                                      ├── YES → PAGE (Level 5: app/ or pages/)
             │                                      └── NO  → ORGANISM (Level 3: components/organisms/)
```

---

## 3. Hierarchical Import Rules (The Dependency Law)

The foundational rule of Atomic Design is **unidirectional downward imports**. A component may only import from its own level (if explicitly permitted) or lower levels:

| Level | Allowed Imports | Strictly Forbidden Imports |
|---|---|---|
| **Quarks** (Tokens) | *(None - foundational axioms)* | Core, Molecules, Organisms, Templates, Pages |
| **Core Primitives** (`components/core/`) | Quarks / Tailwind tokens | Molecules, Organisms, Templates, Pages |
| **Molecules** (`components/molecules/`) | Quarks, Core Primitives | Organisms, Templates, Pages |
| **Organisms** (`components/organisms/`) | Quarks, Core Primitives, Molecules, sibling Organisms (`=organisms`) | Templates, Pages |
| **Templates** (`components/templates/`) | Quarks, Core Primitives, Molecules, Organisms | Pages |
| **Pages** (`app/` or `pages/`) | Quarks, Core Primitives, Molecules, Organisms, Templates | *(Top-level view consumer)* |

### Forbidden vs. Allowed Import Examples

```tsx
// ❌ ILLEGAL: Core primitive importing a Molecule (Upward import violation)
// src/components/core/Button/Button.tsx
import { FormField } from '@/components/molecules/FormField'; // ERROR

// ❌ ILLEGAL: Molecule importing an Organism (Upward import violation)
// src/components/molecules/SearchBar/SearchBar.tsx
import { Header } from '@/components/organisms/Header'; // ERROR

// ❌ ILLEGAL: Molecule importing another Molecule (Molecules compose Core Primitives only)
// src/components/molecules/StatItem/StatItem.tsx
import { SearchInput } from '@/components/molecules/SearchInput'; // ERROR

// ✅ LEGAL: Organism composing Molecules, Core Primitives, and sibling Organisms
// src/components/organisms/ProductCard/ProductCard.tsx
import { Button } from '@/components/core/Button';
import { Badge } from '@/components/core/Badge';
import { FormField } from '@/components/molecules/FormField';
import { UserAvatarMini } from '@/components/organisms/UserAvatarMini';
```

---

## 4. State & Logic Distribution Matrix

Distribute state across the hierarchy according to responsibility:

| Level | State Type Allowed | Handling Pattern |
|---|---|---|
| **Core Primitives** | None | Pure controlled component via props (`value`, `onChange`, `disabled`, `variant`) |
| **Molecules** | Ephemeral UI State | Local `useState` for focus, hover, disclosure, or search debouncing |
| **Organisms** | Composite UI State | Custom hooks (`useHeaderNavigation`, `useTableSort`), local UI reducers |
| **Templates** | Responsive Layout State | Media query hooks, sidebar collapse toggle, slot layout state |
| **Pages** | Application & Server State | Server Components, TanStack Query, URL `searchParams`, Zustand/Redux |

---

## 5. Recommended Directory Structure

Modernized for **Tailwind CSS (v4)**, `cva`, and **`components/core/`**:

```text
src/
├── app/
│   ├── globals.css               # Level 0: Quarks / Tailwind v4 @theme directive & CSS tokens
│   ├── layout.tsx                # App root layout
│   └── page.tsx                  # Level 5: Concrete Page
├── lib/
│   └── utils.ts                  # cn() helper: clsx + tailwind-merge
├── components/
│   ├── core/                     # Level 1: Core UI Primitives (Atoms)
│   │   ├── Button/
│   │   │   ├── Button.tsx        # Styled with cva & Tailwind utility classes
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Label/
│   │   ├── Checkbox/
│   │   └── index.ts              # Barrel export for Core primitives
│   ├── molecules/                # Level 2: Molecules
│   │   ├── FormField/
│   │   │   ├── FormField.tsx     # Composes Label + Input from @/components/core
│   │   │   └── index.ts
│   │   ├── SearchInput/
│   │   ├── StatItem/
│   │   └── index.ts              # Barrel export for molecules
│   ├── organisms/                # Level 3: Organisms
│   │   ├── Header/
│   │   ├── ProductCard/
│   │   ├── DataTable/
│   │   └── index.ts              # Barrel export for organisms
│   ├── templates/                # Level 4: Templates
│   │   ├── PageLayout/
│   │   ├── DashboardTemplate/
│   │   └── index.ts              # Barrel export for templates
│   └── index.ts                  # Unified component barrel
└── pages/                        # Alternative Pages directory (if Pages router)
```

---

## 6. Automated ESLint & Boundary Enforcement

Enforce hierarchical import boundaries automatically in your project's ESLint configuration:

### Option A: `eslint-plugin-boundaries` (Recommended for modern ESLint flat config)

```javascript
// eslint.config.js
import boundaries from 'eslint-plugin-boundaries';

export default [
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'quarks', pattern: 'src/{quarks,styles,app/globals.css}**' },
        { type: 'core', pattern: 'src/components/core/**' },
        { type: 'molecules', pattern: 'src/components/molecules/**' },
        { type: 'organisms', pattern: 'src/components/organisms/**' },
        { type: 'templates', pattern: 'src/components/templates/**' },
        { type: 'pages', pattern: 'src/{pages,app}/**' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'quarks', allow: [] },
            { from: 'core', allow: ['quarks'] },
            { from: 'molecules', allow: ['quarks', 'core'] },
            { from: 'organisms', allow: ['quarks', 'core', 'molecules', 'organisms'] },
            { from: 'templates', allow: ['quarks', 'core', 'molecules', 'organisms'] },
            { from: 'pages', allow: ['quarks', 'core', 'molecules', 'organisms', 'templates'] },
          ],
        },
      ],
    },
  },
];
```

### Option B: `eslint-plugin-atomic-design`

```json
{
  "plugins": ["atomic-design"],
  "rules": {
    "atomic-design/hierarchical-import": ["error", {
      "levels": ["quarks", "core", "molecules", "=organisms", "templates", "pages"],
      "excludes": ["node_modules"],
      "module": "loose"
    }]
  }
}
```

---

## 7. Common Anti-Patterns to Avoid

| Anti-Pattern | Manifestation | Correct Remediation |
|---|---|---|
| **Custom CSS Island** | Creating separate `.module.css` or ad-hoc style files for primitives | Use Tailwind CSS utility classes and `cva` variant definitions |
| **The Molecule Skip** | Jumping directly from core primitives to 800-line organisms without molecules | Group related input/label/action pairs into reusable molecules |
| **The God Organism** | Putting an entire page layout, data fetching, and 12 sections into one organism | Extract layout into a Template; divide sections into independent organisms |
| **Domain Leakage** | Passing complex backend DTOs into primitive core components (`<Button order={order} />`) | Pass only UI primitives (`variant`, `onClick`, `children`, `disabled`) |
| **Upward Leakage** | Importing a molecule inside a core primitive, or an organism inside a molecule | Refactor the composite component upward into an organism |
| **Hardcoded Templates** | Writing text, API calls, and domain copy directly inside templates | Use slots (`children`, `header`, `sidebar`) and pass content from the Page |

---

## 8. Subskill Quick Links

For comprehensive implementations, code examples, TypeScript interfaces, and framework patterns:

- [0. Quarks Deep Dive](./quarks/SKILL.md) — Design tokens, Tailwind CSS v4 `@theme` tokens, and CSS variables
- [1. Atoms / Core UI Deep Dive](./atoms/SKILL.md) — Indivisible Core UI primitives (Button, Input, Checkbox, Avatar, Badge, Icon, Typography) built with Tailwind & `cva`
- [2. Molecules Deep Dive](./molecules/SKILL.md) — FormField, SearchForm, MediaObject, NavItem, CardHeader, and StatItem
- [3. Organisms Deep Dive](./organisms/SKILL.md) — Header, Footer, ProductCard, CommentSection, Sidebar, and DataTable
- [4. Templates Deep Dive](./templates/SKILL.md) — MainLayout, DashboardLayout, AuthLayout, BlogPostLayout, and slot patterns
- [5. Fundamentals Deep Dive](./fundamentals/SKILL.md) — Methodology philosophy, barrel exports, and composition laws
- [6. Framework Integration](./integration/SKILL.md) — React/Next.js, Vue 3, Tailwind configuration, Storybook, Vitest, RTL, and path aliases
