---
name: atomic-design
description: Architecting and organizing UI components using Brad Frost's Atomic Design methodology extended with Quarks (design tokens). Enforces hierarchical import boundaries, component classification (quarks, atoms, molecules, organisms, templates, pages), and subskill routing.
when_to_use: "When organizing, creating, or refactoring UI components into an atomic hierarchy (quarks, atoms, molecules, organisms, templates, pages); setting up design system component folders; enforcing strict upward/downward import boundaries between component levels; or designing scalable component libraries. Routes to specialized subskills for fundamentals, quarks, atoms, molecules, organisms, templates, and framework integration."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Atomic Design — Component Hierarchy & Subskill Orchestrator

> Extended Brad Frost Atomic Design methodology featuring **Quarks (Design Tokens)**, **Strict Hierarchical Import Validation**, and **Specialized Modular Subskills**.
> Master router providing foundational principles, architectural boundaries, and direct routing to deep-dive subskills.

---

## 📑 Subskill Routing (Specialized Knowledge)

Atomic Design in Anti-Kit is organized into modular subskills. Use this routing matrix to load the exact deep-dive guide needed:

| Subskill | Focus Area & When to Read | Quick Link |
|---|---|---|
| **Fundamentals** | Core philosophy, the 6 stages, naming standards, barrel exports, and composition rules | [Read Fundamentals](./fundamentals/SKILL.md) |
| **Quarks** | Design tokens, color scales, spacing aliases, typography scales, shadows, CSS variables, and theme contracts | [Read Quarks](./quarks/SKILL.md) |
| **Atoms** | Indivisible UI primitives (Button, Input, Label, Icon, Avatar, Badge, Checkbox, Typography) | [Read Atoms](./atoms/SKILL.md) |
| **Molecules** | Functional combinations of atoms (FormField, SearchInput, MediaObject, NavItem, CardHeader, StatItem) | [Read Molecules](./molecules/SKILL.md) |
| **Organisms** | Standalone complex sections (Header, Footer, ProductCard, CommentSection, Sidebar, DataTable) | [Read Organisms](./organisms/SKILL.md) |
| **Templates** | Page layout skeletons, slot-based architectures, responsive layout grids, and placeholder systems | [Read Templates](./templates/SKILL.md) |
| **Integration** | Framework patterns (React, Vue 3, Angular), Storybook workshops, Vitest/RTL unit tests, and path aliases | [Read Integration](./integration/SKILL.md) |

---

## 1. The Six Stages Overview

Atomic Design models user interfaces hierarchically, inspired by chemistry:

```
[Level 0: Quarks]      Design tokens (colors, spacing, typography scales, radii, shadows)
       ↓
[Level 1: Atoms]       Indivisible UI primitives (Button, Input, Label, Icon, Badge, Box)
       ↓
[Level 2: Molecules]   Functional groups of atoms (SearchBar, FormField, StatItem, NavLink)
       ↓
[Level 3: Organisms]   Complex UI sections (Header, Footer, DataTable, ProductCard)
       ↓
[Level 4: Templates]   Layout skeletons with slots & placeholders (PageLayout, DashboardTemplate)
       ↓
[Level 5: Pages]       Concrete route views populated with real data (HomePage, DashboardPage)
```

### Core Hierarchy Definitions

1. **Quarks (Level 0)**: Pure design values and constants (not UI elements). Colors, typography clamp scales, spacing increments, elevation shadows. See [Quarks Subskill](./quarks/SKILL.md).
2. **Atoms (Level 1)**: Smallest functional UI elements that cannot be broken down further without losing utility (`<Button>`, `<Input>`, `<Icon>`). See [Atoms Subskill](./atoms/SKILL.md).
3. **Molecules (Level 2)**: Focused combinations of multiple atoms acting together as a single functional unit (`<FormField>` = Label + Input + Error). See [Molecules Subskill](./molecules/SKILL.md).
4. **Organisms (Level 3)**: Distinct, self-contained sections of an interface that could stand alone (`<Header>`, `<DataTable>`, `<ProductCard>`). See [Organisms Subskill](./organisms/SKILL.md).
5. **Templates (Level 4)**: Page-level skeletal layouts that position organisms into responsive grids using slots or children, without real data. See [Templates Subskill](./templates/SKILL.md).
6. **Pages (Level 5)**: Concrete route instances of templates hydrated with live data, route parameters, and API queries.

---

## 2. Component Classification Decision Tree

When building or reviewing a component, use this mental flow to classify it into the correct atomic layer:

```
Is it a raw design value (color, spacing, font, shadow) without DOM elements?
  ├── YES → QUARK (Level 0)
  └── NO  → Does it render HTML?
             ├── Can it be decomposed into smaller functional UI elements?
             │     ├── NO  → ATOM (Level 1)
             │     └── YES → Does it represent a standalone, full-featured UI section?
             │                ├── NO  → Is it a tight group of atoms with a single purpose (e.g. search bar)?
             │                │          ├── YES → MOLECULE (Level 2)
             │                │          └── NO  → ORGANISM (Level 3)
             │                └── YES → Does it define entire viewport layout with placeholders?
             │                           ├── YES → TEMPLATE (Level 4)
             │                           └── NO  → Does it bind real data / route parameters?
             │                                      ├── YES → PAGE (Level 5)
             │                                      └── NO  → ORGANISM (Level 3)
```

---

## 3. Hierarchical Import Rules (The Dependency Law)

The foundational rule of Atomic Design is **unidirectional downward imports**. A component may only import from its own level (if explicitly permitted) or lower levels:

| Level | Allowed Imports | Strictly Forbidden Imports |
|---|---|---|
| **Quarks** (Tokens) | *(None - foundational axioms)* | Atoms, Molecules, Organisms, Templates, Pages |
| **Atoms** | Quarks | Molecules, Organisms, Templates, Pages |
| **Molecules** | Quarks, Atoms | Organisms, Templates, Pages |
| **Organisms** | Quarks, Atoms, Molecules, sibling Organisms (`=organisms`) | Templates, Pages |
| **Templates** | Quarks, Atoms, Molecules, Organisms | Pages |
| **Pages** | Quarks, Atoms, Molecules, Organisms, Templates | *(Top-level view consumer)* |

### Forbidden vs. Allowed Import Examples

```tsx
// ❌ ILLEGAL: Atom importing a Molecule (Upward import violation)
// src/components/atoms/Button/Button.tsx
import { FormField } from '@/components/molecules/FormField'; // ERROR

// ❌ ILLEGAL: Molecule importing an Organism (Upward import violation)
// src/components/molecules/SearchBar/SearchBar.tsx
import { Header } from '@/components/organisms/Header'; // ERROR

// ❌ ILLEGAL: Molecule importing another Molecule (Molecules compose Atoms only)
// src/components/molecules/StatItem/StatItem.tsx
import { SearchInput } from '@/components/molecules/SearchInput'; // ERROR

// ✅ LEGAL: Organism composing Molecules, Atoms, and sibling Organisms
// src/components/organisms/ProductCard/ProductCard.tsx
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { FormField } from '@/components/molecules/FormField';
import { UserAvatarMini } from '@/components/organisms/UserAvatarMini';
```

---

## 4. State & Logic Distribution Matrix

Distribute state across the hierarchy according to responsibility:

| Level | State Type Allowed | Handling Pattern |
|---|---|---|
| **Atoms** | None | Pure controlled component via props (`value`, `onChange`, `isOpen`, `disabled`) |
| **Molecules** | Ephemeral UI State | Local `useState` for focus, hover, disclosure, or search debouncing |
| **Organisms** | Composite UI State | Custom hooks (`useHeaderNavigation`, `useTableSort`), local UI reducers |
| **Templates** | Responsive Layout State | Media query hooks, sidebar collapse toggle, slot layout state |
| **Pages** | Application & Server State | Server Components, TanStack Query, URL `searchParams`, Zustand/Redux |

---

## 5. Recommended Directory Structure

```text
src/
├── quarks/                       # Level 0: Design Tokens
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── shadows.ts
│   └── index.ts
├── components/
│   ├── atoms/                    # Level 1: Atoms
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── index.ts              # Barrel export for atoms
│   ├── molecules/                # Level 2: Molecules
│   │   ├── FormField/
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
└── pages/                        # Level 5: Pages (or app/ in Next.js)
    ├── HomePage.tsx
    └── DashboardPage.tsx
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
        { type: 'quarks', pattern: 'src/quarks/**' },
        { type: 'atoms', pattern: 'src/components/atoms/**' },
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
            { from: 'atoms', allow: ['quarks'] },
            { from: 'molecules', allow: ['quarks', 'atoms'] },
            { from: 'organisms', allow: ['quarks', 'atoms', 'molecules', 'organisms'] },
            { from: 'templates', allow: ['quarks', 'atoms', 'molecules', 'organisms'] },
            { from: 'pages', allow: ['quarks', 'atoms', 'molecules', 'organisms', 'templates'] },
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
      "levels": ["quarks", "atoms", "molecules", "=organisms", "templates", "pages"],
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
| **The Molecule Skip** | Jumping directly from atoms to 800-line organisms without molecules | Group related input/label/action pairs into reusable molecules |
| **The God Organism** | Putting an entire page layout, data fetching, and 12 sections into one organism | Extract layout into a Template; divide sections into independent organisms |
| **Domain Leakage** | Passing complex backend DTOs into primitive atoms (`<Button order={order} />`) | Pass only UI primitives (`variant`, `onClick`, `children`, `disabled`) |
| **Upward Leakage** | Importing a molecule inside an atom, or an organism inside a molecule | Refactor the composite component upward into an organism |
| **Hardcoded Templates** | Writing text, API calls, and domain copy directly inside templates | Use slots (`children`, `header`, `sidebar`) and pass content from the Page |

---

## 8. Subskill Quick Links

For comprehensive implementations, code examples, TypeScript interfaces, and framework patterns:

- [0. Quarks Deep Dive](./quarks/SKILL.md) — Design tokens, color scales, typography clamp scales, and CSS variables
- [1. Atoms Deep Dive](./atoms/SKILL.md) — Button, Input, Checkbox, Avatar, Badge, Icon, and Typography components
- [2. Molecules Deep Dive](./molecules/SKILL.md) — FormField, SearchForm, MediaObject, NavItem, CardHeader, and StatItem
- [3. Organisms Deep Dive](./organisms/SKILL.md) — Header, Footer, ProductCard, CommentSection, Sidebar, and DataTable
- [4. Templates Deep Dive](./templates/SKILL.md) — MainLayout, DashboardLayout, AuthLayout, BlogPostLayout, and slot patterns
- [5. Fundamentals Deep Dive](./fundamentals/SKILL.md) — Methodology philosophy, barrel exports, and composition laws
- [6. Framework Integration](./integration/SKILL.md) — React, Vue 3, Angular, Storybook, Vitest, RTL, and path aliases
