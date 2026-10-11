---
name: atomic-design
description: Architecting and organizing UI components using Brad Frost's Atomic Design methodology extended with Quarks (design tokens). Enforces hierarchical import boundaries, component classification (quarks, atoms, molecules, organisms, templates, pages), and component colocation.
when_to_use: "When organizing, creating, or refactoring UI components into an atomic hierarchy (quarks, atoms, molecules, organisms, templates, pages); setting up design system component folders; enforcing strict upward/downward import boundaries between component levels; or designing scalable component libraries. Pair with frontend-architecture for layer separation and design-spec for token definitions."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Atomic Design — Component Hierarchy & Architectural Boundaries

> Extended Brad Frost Atomic Design methodology featuring **Quarks (Design Tokens)** and **Strict Hierarchical Import Validation**.
> Synthesized from production design systems and [TheBushidoCollective/han](https://github.com/TheBushidoCollective/han).

---

## 📑 Quick Navigation

- [1. Overview & The Six Stages](#1-overview--the-six-stages)
- [2. The Six Levels in Depth](#2-the-six-levels-in-depth)
  - [Level 0: Quarks (Design Tokens)](#level-0-quarks-design-tokens)
  - [Level 1: Atoms (Primitives)](#level-1-atoms-primitives)
  - [Level 2: Molecules (Functional Units)](#level-2-molecules-functional-units)
  - [Level 3: Organisms (Standalone Sections)](#level-3-organisms-standalone-sections)
  - [Level 4: Templates (Layout Wireframes)](#level-4-templates-layout-wireframes)
  - [Level 5: Pages (Concrete Views)](#level-5-pages-concrete-views)
- [3. Hierarchical Import Rules (The Dependency Law)](#3-hierarchical-import-rules-the-dependency-law)
- [4. Recommended Directory Structure](#4-recommended-directory-structure)
- [5. Component Colocation & Anatomy](#5-component-colocation--anatomy)
- [6. State & Logic Distribution](#6-state--logic-distribution)
- [7. Data Colocation Pattern (RSC / GraphQL / REST)](#7-data-colocation-pattern)
- [8. ESLint & Quality Enforcement](#8-eslint--quality-enforcement)
- [9. Common Anti-Patterns to Avoid](#9-common-anti-patterns-to-avoid)

---

## 1. Overview & The Six Stages

Atomic Design models user interfaces hierarchically, inspired by natural chemistry. By introducing **Quarks** below Atoms, design tokens become first-class citizens:

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

### Core Principles

1. **Unidirectional Dependency Flow**: Code only imports from equal or lower levels. Upward imports are strictly prohibited.
2. **Context Independence at the Base**: Atoms and molecules know nothing about domain business logic; they only know visual styling and user events.
3. **Colocation of Concerns**: Types, styles, tests, and documentation live alongside the component file.
4. **Token-First Styling**: All visual styles trace back to Quarks (or `DESIGN.md`), preventing rogue magic values.

---

## 2. The Six Levels in Depth

### Level 0: Quarks (Design Tokens)

Quarks are the sub-atomic building blocks of the visual language. They are **pure values and constants**, not UI components.

- **Examples:** Color palettes (`primary-500`, `neutral-900`), spacing scales (`4px`, `8px`, `16px`), typography tokens (font families, weights, fluid clamp scales), border radii, elevation shadows, animation curves, breakpoints.
- **Lives in:** `src/theme.ts`, `src/tokens/`, `DESIGN.md`, or Tailwind `@theme` CSS tokens.
- **Rule:** Quarks cannot import anything. They represent the foundational axioms of your design system.

```typescript
// theme.ts or tokens/colors.ts
export const colors = {
  primary: { 50: '#f0fdf4', 500: '#22c55e', 700: '#15803d' },
  neutral: { 50: '#fafafa', 200: '#e5e5e5', 900: '#171717' },
  danger: { 500: '#ef4444' },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const;
```

---

### Level 1: Atoms (Primitives)

Atoms are the smallest functional UI elements. They cannot be broken down further without losing their essential identity or utility.

- **Examples:**
  - *Interactive:* `Button`, `IconButton`, `Checkbox`, `Radio`, `Input`, `Switch`, `Link`.
  - *Display:* `Badge`, `Avatar`, `Spinner`, `Skeleton`, `Divider`, `Kbd`.
  - *Typography:* `Heading`, `Text`, `Label`, `CodeBlock`.
  - *Layout Primitives:* `Box`, `Flex`, `HStack`, `VStack`, `Center`, `Container`.
- **Characteristics:**
  - Consumes only Quarks (via classes, CSS variables, or styled tokens).
  - Purely presentational (stateless or minimal controlled props).
  - Built with accessibility (ARIA roles, focus-visible states) baked in.
  - Zero domain knowledge (accepts `src` and `alt`, never a domain entity like `user: User`).

```tsx
// components/atoms/Button/Button.tsx
import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
```

---

### Level 2: Molecules (Functional Units)

Molecules combine multiple atoms to form a single, focused, functional unit with a single responsibility.

- **Examples:**
  - *Form:* `FormField` (`Label` + `Input` + `ErrorMessage`), `SearchInput` (`Input` + `SearchIcon` + `ClearButton`).
  - *Navigation:* `NavLink` (`Icon` + `Text` + `Badge`), `BreadcrumbItem` (`Link` + `SeparatorIcon`).
  - *Display:* `StatItem` (`LabelText` + `ValueText` + `TrendBadge`), `MediaObject` (`Avatar` + `Heading` + `Subtext`).
  - *Actions:* `ButtonGroup`, `DropdownTrigger` (`Button` + `ChevronIcon`).
- **Characteristics:**
  - Composed strictly of **Atoms** and styled by **Quarks**.
  - **Never imports other molecules** (if it needs multiple molecules, it is an Organism).
  - May encapsulate minor transient UI state (e.g., input focused, hover disclosure).

```tsx
// components/molecules/FormField/FormField.tsx
import React, { useId } from 'react';
import { Label } from '@/components/atoms/Label';
import { Input, type InputProps } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({ label, error, hint, id: customId, ...inputProps }: FormFieldProps) {
  const autoId = useId();
  const fieldId = customId || autoId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...inputProps}
      />
      {error && (
        <Text id={errorId} variant="caption" className="text-danger-500">
          {error}
        </Text>
      )}
      {!error && hint && (
        <Text id={hintId} variant="caption" className="text-neutral-500">
          {hint}
        </Text>
      )}
    </div>
  );
}
```

---

### Level 3: Organisms (Standalone Sections)

Organisms are complex, self-contained sections of an interface composed of molecules, atoms, and sometimes other organisms. They represent distinct modular sections that could exist on their own.

- **Examples:**
  - *Global Chrome:* `Header`, `Footer`, `SidebarNavigation`.
  - *Content Cards:* `ProductCard`, `UserProfileCard`, `SessionListItem`.
  - *Data Presentation:* `DataTable`, `MetricsGrid`, `VirtualList`, `ActivityTimeline`.
  - *Forms & Modals:* `RegistrationForm`, `ConfirmationModal`, `CheckoutSummary`.
- **Characteristics:**
  - Composed of **Molecules**, **Atoms**, and **Quarks**.
  - May compose sibling organisms (`=organisms`, e.g., `Header` containing `UserMenuDropdown`).
  - Can manage composite UI state (tabs, modals, accordion states) or custom hooks (`useHeaderNavigation`).
  - Can accept data entities or fragment references to populate internal molecules.

```tsx
// components/organisms/Header/Header.tsx
import React from 'react';
import { HStack, Center } from '@/components/atoms/Layout';
import { Button } from '@/components/atoms/Button';
import { NavLink } from '@/components/molecules/NavLink';
import { SearchInput } from '@/components/molecules/SearchInput';
import { UserMenu } from '@/components/organisms/UserMenu';

export interface HeaderProps {
  currentPath: string;
  onSearch?: (term: string) => void;
}

export function Header({ currentPath, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <HStack gap="md" align="center">
          <Center className="font-bold text-lg">Acme Corp</Center>
          <nav className="flex items-center gap-1">
            <NavLink href="/dashboard" active={currentPath === '/dashboard'}>Dashboard</NavLink>
            <NavLink href="/projects" active={currentPath === '/projects'}>Projects</NavLink>
          </nav>
        </HStack>
        <HStack gap="sm" align="center">
          <SearchInput onSubmit={onSearch} placeholder="Quick search..." />
          <UserMenu />
        </HStack>
      </div>
    </header>
  );
}
```

---

### Level 4: Templates (Layout Wireframes)

Templates define the skeletal layout structure of a page. They arrange organisms, molecules, and layout atoms into a cohesive viewport system without binding to specific, concrete data.

- **Examples:** `PageLayout`, `DashboardTemplate`, `AuthSplitTemplate`, `DocumentationTemplate`.
- **Characteristics:**
  - Content-agnostic: accepts content through React `children` or named slots.
  - Dictates responsive breakpoints, grid columns, sidebars, headers, and footers.
  - Zero data fetching and zero network business logic.

```tsx
// components/templates/DashboardTemplate/DashboardTemplate.tsx
import React, { type ReactNode } from 'react';

export interface DashboardTemplateProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  banner?: ReactNode;
}

export function DashboardTemplate({ header, sidebar, children, banner }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {header}
      {banner}
      <div className="mx-auto flex max-w-7xl px-4 py-8">
        <aside className="w-64 shrink-0 hidden md:block pr-6">
          {sidebar}
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### Level 5: Pages (Concrete Views)

Pages are specific instances of templates hydrated with real application data, routing parameters, and API queries.

- **Examples:** `DashboardPage`, `SessionDetailPage`, `SettingsProfilePage`.
- **Characteristics:**
  - Lives in `src/pages/` or Next.js `app/[route]/page.tsx`.
  - Connects Server Components, queries (TanStack Query, SWR, Relay), or route params.
  - Handles page-level metadata, loading skeletons, and error boundaries.

---

## 3. Hierarchical Import Rules (The Dependency Law)

The foundational rule of Atomic Design is **unidirectional downward imports**. A component may only import from its own level (if explicitly permitted) or lower levels:

| Level | Allowed Imports | Forbidden Imports |
|---|---|---|
| **Quarks** (Tokens) | *(None - foundational)* | Atoms, Molecules, Organisms, Templates, Pages |
| **Atoms** | Quarks | Molecules, Organisms, Templates, Pages |
| **Molecules** | Quarks, Atoms | Organisms, Templates, Pages |
| **Organisms** | Quarks, Atoms, Molecules, other Organisms (`=organisms`) | Templates, Pages |
| **Templates** | Quarks, Atoms, Molecules, Organisms | Pages |
| **Pages** | Quarks, Atoms, Molecules, Organisms, Templates | *(Top level - consumer only)* |

### Forbidden Import Examples

```tsx
// ❌ WRONG: Atom importing a Molecule (Upward import violation)
// src/components/atoms/Button/Button.tsx
import { FormField } from '@/components/molecules/FormField'; // ILLEGAL

// ❌ WRONG: Molecule importing an Organism (Upward import violation)
// src/components/molecules/SearchBar/SearchBar.tsx
import { Header } from '@/components/organisms/Header'; // ILLEGAL

// ❌ WRONG: Molecule importing another Molecule (Molecules compose Atoms only)
// src/components/molecules/StatItem/StatItem.tsx
import { SearchInput } from '@/components/molecules/SearchInput'; // ILLEGAL

// ✅ CORRECT: Organism composing Molecules, Atoms, and sibling Organisms
// src/components/organisms/ProductCard/ProductCard.tsx
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { FormField } from '@/components/molecules/FormField';
import { UserAvatarMini } from '@/components/organisms/UserAvatarMini';
```

---

## 4. Recommended Directory Structure

```text
src/
├── theme/                        # Level 0: Quarks
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── index.ts
├── components/
│   ├── atoms/                    # Level 1: Atoms
│   │   ├── Button/
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
│   │   └── index.ts
│   └── index.ts                  # Root component export (optional)
└── pages/                        # Level 5: Pages (or Next.js app/)
    ├── DashboardPage.tsx
    └── SessionDetailPage.tsx
```

---

## 5. Component Colocation & Anatomy

Every atom, molecule, and organism should be self-contained in its own directory:

```text
components/atoms/Button/
├── Button.tsx             # Component implementation & display name
├── Button.types.ts        # TypeScript props, variants, and enums
├── Button.module.css      # Scoped CSS module (or Tailwind classes)
├── Button.test.tsx        # Unit tests with React Testing Library / Vitest
├── Button.stories.tsx     # Storybook / component workshop documentation
└── index.ts               # Clean export: export * from './Button'
```

---

## 6. State & Logic Distribution

Distribute state across the hierarchy according to responsibility:

| Level | State Type Allowed | Handling Pattern |
|---|---|---|
| **Atoms** | None | Pure controlled component via props (`value`, `onChange`, `isOpen`) |
| **Molecules** | Ephemeral UI State | Local `useState` for focus, hover, or disclosure animations |
| **Organisms** | Composite UI State | Custom hooks (`useHeaderState`, `useTableSort`), local UI reducers |
| **Templates** | Responsive Layout State | Media query hooks, sidebar collapsed toggles, layout slot state |
| **Pages** | Application & Server State | React Server Components, TanStack Query, URL `searchParams`, global store |

---

## 7. Data Colocation Pattern

When using React Server Components, GraphQL (Relay/Apollo), or API services:

1. **Pages fetch**: The route page handles the primary data loading or suspense boundary.
2. **Organisms declare data requirements**: Organisms define the shape or fragment of data they need (`ProductCardFragment` or `interface ProductCardData`).
3. **Molecules & Atoms receive primitives**: Never pass a top-level entity into an atom. Deconstruct into primitive types (`label: string`, `src: string`).

```tsx
// ❌ WRONG: Leaking full domain entity into an Atom
<Avatar user={userRecord} />

// ✅ CORRECT: Primitive props for Atoms
<Avatar src={userRecord.avatarUrl} alt={userRecord.displayName} size="md" />
```

---

## 8. ESLint & Quality Enforcement

Enforce hierarchical import boundaries automatically in your project's ESLint configuration using `eslint-plugin-boundaries` or `eslint-plugin-atomic-design`:

```javascript
// .eslintrc.js or eslint.config.js
module.exports = {
  plugins: ['boundaries'],
  settings: {
    'boundaries/elements': [
      { type: 'quarks', pattern: 'src/theme/**' },
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
};
```

---

## 9. Common Anti-Patterns to Avoid

| Anti-Pattern | Description | Remediation |
|---|---|---|
| **The Molecule Skip** | Jumping directly from atoms to 600-line organisms | Group related input/label/action pairs into reusable molecules |
| **The God Organism** | Putting an entire page layout, data fetching, and 12 sections in one organism | Extract layout into a Template; break sections into separate organisms |
| **Domain Leakage** | Passing complex backend DTOs into primitive atoms (`<Button order={order} />`) | Pass only UI props (`variant`, `onClick`, `children`) |
| **Upward Leakage** | Importing a molecule inside an atom, or an organism inside a molecule | Refactor the composite component upward into an organism |
| **Hardcoded Templates** | Writing text, API calls, and domain copy directly inside templates | Use slots (`children`, `header`, `sidebar`) and pass data from the Page |
