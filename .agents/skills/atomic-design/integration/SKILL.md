---
name: atomic-design-integration
description: Framework-specific patterns for React/Next.js, Tailwind CSS (v4), Storybook workshops, testing strategies, and path aliases.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Atomic Design: Framework Integration

Master the integration of modern Atomic Design with **Tailwind CSS (v4)**, `cva`, Next.js/React, and testing setups. In this architecture, atoms are structured as **Core UI primitives under `src/components/core/`**, styled with utility classes and merged via `cn()`.

---

## React & Next.js Integration

### Project Structure

```text
src/
├── app/
│   ├── globals.css               # Level 0: Quarks / Tailwind v4 @theme & CSS vars
│   ├── layout.tsx                # App root layout
│   └── page.tsx                  # Level 5: Concrete Page
├── lib/
│   └── utils.ts                  # cn() helper: clsx + tailwind-merge
├── components/
│   ├── core/                     # Level 1: Core UI Primitives (Atoms)
│   │   ├── Button/
│   │   │   ├── Button.tsx        # Styled with cva & Tailwind classes
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Label/
│   │   ├── Checkbox/
│   │   ├── Icon/
│   │   └── index.ts              # Core primitives barrel
│   ├── molecules/                # Level 2: Molecules
│   │   ├── FormField/
│   │   │   ├── FormField.tsx
│   │   │   ├── FormField.test.tsx
│   │   │   └── index.ts
│   │   ├── SearchForm/
│   │   └── index.ts              # Molecules barrel
│   ├── organisms/                # Level 3: Organisms
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── useHeader.ts      # Custom state hook
│   │   │   └── index.ts
│   │   └── index.ts              # Organisms barrel
│   ├── templates/                # Level 4: Templates
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.tsx
│   │   │   └── index.ts
│   │   └── index.ts              # Templates barrel
│   └── index.ts                  # Unified components barrel
```

---

## Barrel Exports Pattern

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
```

### 2. Unified Components Barrel

```typescript
// src/components/index.ts
export * from './core';
export * from './molecules';
export * from './organisms';
export * from './templates';
```

---

## Component Template (React / TypeScript / Tailwind / `cva`)

```typescript
// src/components/core/Button/Button.tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8 text-base',
        icon: 'size-9 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {isLoading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

## Storybook Integration

Organize stories according to the modernized atomic tiers:

```typescript
// src/components/core/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Loading: Story = {
  args: { isLoading: true, children: 'Submitting...' },
};
```

### Storybook Hierarchy Tiers

```typescript
// Title format: "Tier/ComponentName"
title: 'Core/Button'           // Level 1: Core primitives
title: 'Core/Input'
title: 'Molecules/FormField'   // Level 2: Molecules
title: 'Molecules/SearchForm'
title: 'Organisms/Header'      // Level 3: Organisms
title: 'Organisms/ProductCard'
title: 'Templates/Dashboard'   // Level 4: Templates
title: 'Pages/DashboardPage'   // Level 5: Pages
```

---

## Testing Integration (Vitest & React Testing Library)

Test for accessibility and Tailwind class output:

```typescript
// src/components/core/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies destructive styling variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('disables button when loading or disabled', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('triggers onClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Path Aliases Configuration

### 1. TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/core/*": ["src/components/core/*"],
      "@/core": ["src/components/core/index.ts"],
      "@/molecules/*": ["src/components/molecules/*"],
      "@/organisms/*": ["src/components/organisms/*"],
      "@/templates/*": ["src/components/templates/*"],
      "@/lib/*": ["src/lib/*"]
    }
  }
}
```

### 2. Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/components/core'),
      '@/molecules': path.resolve(__dirname, './src/components/molecules'),
      '@/organisms': path.resolve(__dirname, './src/components/organisms'),
      '@/templates': path.resolve(__dirname, './src/components/templates'),
    },
  },
});
```

---

## Related Subskills

- [Atomic Design Hub](../SKILL.md) — Master methodology and subskill routing
- [Fundamentals](../fundamentals/SKILL.md) — Core hierarchy, directory layouts, and composition rules
- [Quarks](../quarks/SKILL.md) — Tailwind v4 `@theme` tokens, CSS variables, and primitive values
- [Atoms (Core UI)](../atoms/SKILL.md) — Indivisible Core UI primitives in `components/core/`
- [Molecules](../molecules/SKILL.md) — Functional atom combinations (form fields, search inputs)
- [Organisms](../organisms/SKILL.md) — Standalone UI sections (headers, footers, data tables)
- [Templates](../templates/SKILL.md) — Page layout skeletons with slot-based content
