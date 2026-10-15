---
name: atomic-design-organisms
description: Complex standalone UI sections like headers, footers, product cards, comment sections, sidebars, and data tables built with Tailwind CSS.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Atomic Design: Organisms

Master the creation of organisms — complex, distinct sections of an interface composed of molecules and Core UI primitives (`src/components/core/`). Organisms represent standalone UI sections that could exist independently and are styled using **Tailwind CSS utility classes**, responsive design modifiers, and the `cn()` helper without custom `.module.css` files.

---

## What Are Organisms?

Organisms are relatively complex UI components that form distinct sections of an interface:

- **Composed of molecules and core primitives**: Combines `components/core/` primitives, `components/molecules/`, and sibling organisms
- **Standalone sections**: Distinct UI regions that can function as cohesive interface blocks
- **Utility-first layout**: Structured with Tailwind flex, grid, sticky positioning, container queries, and responsive variants
- **Context-aware & Stateful**: Often tied to feature domain needs and custom state hooks (e.g. `useHeader`, `useTableSort`)
- **Reusable**: Reusable across templates and concrete pages

---

## Common Organism Types

| Category | Organisms | Composed Parts |
|---|---|---|
| **Navigation** | Header, Footer, Sidebar | NavItem, SearchForm, Avatar, Icon, Button |
| **Content Sections** | ProductCard, CommentSection, ArticlePreview | MediaObject, Badge, Button, Heading, Text |
| **Data Display** | DataTable, StatGrid, ActivityTimeline | Checkbox, Button, Icon, Text, Pagination |
| **Complex Forms** | MultiStepForm, CheckoutSummary, FilterDrawer | FormField, Checkbox, ButtonGroup, Separator |

---

## 1. Header Organism Example

Combines `Avatar`, `Button`, `Icon` from `components/core/` with `NavItem` and `SearchForm` molecules:

```typescript
// src/components/organisms/Header/Header.tsx
import React, { useState } from 'react';
import { Icon } from '@/components/core/Icon';
import { Button } from '@/components/core/Button';
import { Avatar } from '@/components/core/Avatar';
import { NavItem } from '@/components/molecules/NavItem';
import { SearchForm } from '@/components/molecules/SearchForm';
import { cn } from '@/lib/utils';

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface HeaderProps {
  /** Logo element or brand component */
  logo: React.ReactNode;
  /** Navigation links */
  navigation: NavLink[];
  /** Current active nav item ID */
  activeNavId?: string;
  /** Authenticated user */
  user?: User | null;
  /** Show search form */
  showSearch?: boolean;
  /** Search submit handler */
  onSearch?: (query: string) => void;
  /** Login click handler */
  onLogin?: () => void;
  /** Logout click handler */
  onLogout?: () => void;
  /** Profile click handler */
  onProfileClick?: () => void;
  /** Custom wrapper class */
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navigation,
  activeNavId,
  user,
  showSearch = true,
  onSearch,
  onLogin,
  onLogout,
  onProfileClick,
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div className="shrink-0">{logo}</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                href={item.href}
                icon={item.icon}
                badge={item.badge}
                isActive={item.id === activeNavId}
              />
            ))}
          </nav>
        </div>

        {/* Search */}
        {showSearch && onSearch && (
          <div className="hidden lg:block w-72 max-w-sm">
            <SearchForm
              onSubmit={onSearch}
              placeholder="Search..."
              size="sm"
            />
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full p-1 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  initials={user.name.slice(0, 2).toUpperCase()}
                  size="sm"
                />
                <span className="hidden sm:inline-block font-medium text-foreground">{user.name}</span>
                <Icon name="chevron-down" size="xs" className="text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground z-50">
                  <button
                    onClick={onProfileClick}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Icon name="user" size="sm" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Icon name="log-out" size="sm" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={onLogin}>
              Login
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size="md" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2">
          {showSearch && onSearch && (
            <div className="mb-4">
              <SearchForm onSubmit={onSearch} placeholder="Search..." size="sm" />
            </div>
          )}
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navigation.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                href={item.href}
                icon={item.icon}
                badge={item.badge}
                isActive={item.id === activeNavId}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

Header.displayName = 'Header';
```

---

## 2. Footer Organism Example

```typescript
// src/components/organisms/Footer/Footer.tsx
import React from 'react';
import { Icon } from '@/components/core/Icon';
import { Text } from '@/components/core/Typography';
import { cn } from '@/lib/utils';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface FooterProps {
  logo: React.ReactNode;
  tagline?: string;
  sections: FooterSection[];
  socialLinks?: SocialLink[];
  copyright?: string;
  legalLinks?: FooterLink[];
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  tagline,
  sections,
  socialLinks = [],
  copyright,
  legalLinks = [],
  className,
}) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `${currentYear} Company. All rights reserved.`;

  return (
    <footer className={cn('border-t border-border bg-muted/30 text-muted-foreground', className)}>
      <div className="container mx-auto px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div>{logo}</div>
            {tagline && (
              <Text size="sm" color="muted" className="max-w-sm">
                {tagline}
              </Text>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.href}
                    className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-foreground transition-colors"
                    aria-label={`Follow on ${link.platform}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={link.icon} size="sm" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links Grid */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </div>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row text-xs">
          <div>{copyrightText}</div>
          {legalLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
```

---

## 3. ProductCard Organism Example

Combines `Button`, `Badge`, `Icon`, and `Typography` primitives from `components/core/`:

```typescript
// src/components/organisms/ProductCard/ProductCard.tsx
import React from 'react';
import { Button } from '@/components/core/Button';
import { Badge } from '@/components/core/Badge';
import { Icon } from '@/components/core/Icon';
import { Text, Heading } from '@/components/core/Typography';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  badge?: string;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
  isFavorite?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onFavorite,
  isFavorite = false,
  className,
}) => {
  const currency = product.currency || '$';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className={cn('group relative flex flex-col rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xs transition-all hover:shadow-md', className)}>
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {product.badge && (
          <div className="absolute top-2 left-2">
            <Badge variant="default">{product.badge}</Badge>
          </div>
        )}

        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(product)}
            className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-xs hover:bg-background transition-colors cursor-pointer"
            aria-label="Add to favorites"
          >
            <Icon
              name="heart"
              size="sm"
              className={cn(isFavorite ? 'text-destructive fill-destructive' : 'text-muted-foreground')}
            />
          </button>
        )}
      </div>

      {/* Info Block */}
      <div className="flex flex-1 flex-col pt-4">
        {product.rating !== undefined && (
          <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
            <Icon name="star" size="xs" />
            <span>{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span className="text-muted-foreground">({product.reviewCount})</span>
            )}
          </div>
        )}

        <Heading level={4} className="mt-1 font-semibold text-base truncate">
          {product.name}
        </Heading>

        {product.description && (
          <Text size="sm" color="muted" truncate className="mt-1">
            {product.description}
          </Text>
        )}

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-foreground">
              {currency}{product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {currency}{product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            disabled={product.inStock === false}
            onClick={() => onAddToCart?.(product)}
          >
            {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

ProductCard.displayName = 'ProductCard';
```

---

## 4. Sidebar Organism Example

```typescript
// src/components/organisms/Sidebar/Sidebar.tsx
import React from 'react';
import { Avatar } from '@/components/core/Avatar';
import { Text } from '@/components/core/Typography';
import { NavItem } from '@/components/molecules/NavItem';
import { cn } from '@/lib/utils';

export interface SidebarLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface SidebarSection {
  title?: string;
  links: SidebarLink[];
}

export interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  sections: SidebarSection[];
  activeLinkId?: string;
  onLinkClick?: (id: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  sections,
  activeLinkId,
  onLinkClick,
  isCollapsed = false,
  className,
}) => {
  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* User Header */}
      {user && (
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Avatar src={user.avatar} alt={user.name} initials={user.name.slice(0, 2).toUpperCase()} size="sm" />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">{user.name}</div>
              <Text size="xs" color="muted" truncate>
                {user.email}
              </Text>
            </div>
          )}
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={section.title || idx} className="space-y-1">
            {section.title && !isCollapsed && (
              <div className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </div>
            )}
            <nav className="space-y-0.5">
              {section.links.map((link) => (
                <NavItem
                  key={link.id}
                  label={isCollapsed ? '' : link.label}
                  href={link.href}
                  icon={link.icon}
                  badge={isCollapsed ? undefined : link.badge}
                  isActive={link.id === activeLinkId}
                  onClick={() => onLinkClick?.(link.id)}
                />
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
```

---

## Best Practices for Organisms

### 1. Composes Core Primitives and Molecules
Organisms should delegate lower-level rendering to `components/core` primitives (`Button`, `Avatar`, `Badge`, `Icon`) and `components/molecules` (`NavItem`, `SearchForm`, `FormField`).

### 2. Pure Tailwind Styling
Avoid separate `.module.css` files. Build responsive sections cleanly with Tailwind utilities (`grid`, `flex`, `sticky`, `container`, `@container`).

### 3. State Decoupling via Custom Hooks
When an organism requires complex UI state (like pagination, filtering, or multi-step progression), extract state into a dedicated custom hook (`useHeader`, `useDataTable`, `useProductFilter`) to keep the component presentationally clear.

---

## Related Subskills

- [Atomic Design Hub](../SKILL.md) — Master methodology and subskill routing
- [Fundamentals](../fundamentals/SKILL.md) — Core hierarchy, directory layouts, and composition rules
- [Quarks](../quarks/SKILL.md) — Tailwind v4 `@theme` tokens, CSS variables, and primitive values
- [Atoms (Core UI)](../atoms/SKILL.md) — Indivisible Core UI primitives in `components/core/`
- [Molecules](../molecules/SKILL.md) — Functional atom combinations (form fields, search inputs)
- [Templates](../templates/SKILL.md) — Page layout skeletons with slot-based content
- [Integration](../integration/SKILL.md) — Framework integration (React/Next.js, Vue 3, Storybook, Vitest)
