# Overview

Metronic 9 is a comprehensive Next.js template for modern web applications, built on Tailwind CSS 4.x and React 19.x. It serves as a complete admin dashboard and application framework.

The project, Jain Automart, is a complete commercial vehicle marketplace with two main components:
- **Public Homepage (`/`)**: A public-facing homepage focused on lead generation and vehicle discovery for commercial vehicle buyers, including fleet owners, logistics companies, and individual buyers.
- **Admin Panel (`/jammanage`)**: A secure admin panel for vehicle inventory management, vocabulary administration, and system controls, accessible via secure site-owner login.

The project integrates ReUI (an open-source React component library) and provides a foundation for building scalable web applications with modern design patterns, emphasizing a custom brand design system for the public homepage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15.3.x with App Router.
- **UI Library**: React 19.x with TypeScript.
- **Styling**: Tailwind CSS 4.x with custom CSS variables and design tokens.
- **Component System**: ReUI-based components with shadcn/ui compatibility.
- **State Management**: React Query (TanStack Query) for server state, React Context for global UI state.
- **Theme System**: next-themes for dark/light mode.
- **Internationalization**: react-i18next with browser language detection.

## Authentication & Authorization
- **Authentication**: NextAuth.js v4 with Prisma adapter.
- **Session Management**: JWT-based sessions with database persistence.
- **User Roles**: Role-based access control.
- **Password Security**: bcrypt for password hashing.
- **Security Features**: Rate limiting (5 login attempts per 10 minutes per IP), environment variables for credentials.

## Database & Data Layer
- **ORM**: Prisma with PostgreSQL 17.4.x.
- **Database Structure**: Users, roles, permissions, system settings, audit logs.
- **Seeding**: Automated database seeding with faker.js for development.
- **Migrations**: Prisma-managed database schema evolution.

## File Storage & Assets
- **Cloud Storage**: AWS S3-compatible storage with DigitalOcean Spaces support.
- **File Upload**: Custom file upload components with drag-and-drop.
- **Image Processing**: Built-in image input components with preview.
- **CDN**: Configurable CDN support.

## Layout & Navigation System
- **Multi-Layout Support**: 10 different demo layouts with dynamic switching.
- **Responsive Design**: Mobile-first approach.
- **Menu System**: Hierarchical menu configuration.
- **Settings Provider**: Global settings management with localStorage persistence.

## UI Components & Design System
- **Component Library**: Custom components built on ReUI foundation.
- **Design Tokens**: CSS custom properties for consistent theming.
- **Icons**: Lucide React icons with custom KeenIcons support.
- **Animations**: Framer Motion for transitions.
- **Forms**: React Hook Form integration with validation.
- **UI/UX Decisions**: Custom brand design system for the public homepage (deep blue primary, vibrant yellow accent), WCAG AA compliant neutral scale, responsive typography, and accessibility features like `.jam-focus-ring`. Admin panel uses Metronic BrandedLayout and Demo4Layout.

## Development & Build System
- **TypeScript**: Full TypeScript support.
- **Code Quality**: ESLint and Prettier.
- **Build Optimization**: Next.js optimizations.
- **Development Tools**: React Query DevTools.

# External Dependencies

## Core Dependencies
- **Next.js 15.3.x**
- **React 19.x**
- **Tailwind CSS 4.x**
- **TypeScript**

## Authentication & Database
- **NextAuth.js**
- **Prisma**
- **PostgreSQL**
- **bcrypt**

## UI & Interaction Libraries
- **ReUI**
- **shadcn/ui**
- **Radix UI**
- **Lucide React**
- **Framer Motion**

## Data Management
- **TanStack React Query**
- **React Hook Form**
- **Zod** (via @hookform/resolvers)

## Internationalization & Localization
- **react-i18next**
- **i18next-browser-languagedetector**
- **next-i18next**

## File Handling & Storage
- **AWS SDK S3**
- **@faker-js/faker**

## Email & Communication
- **Nodemailer**
- **reCAPTCHA**

## Development & Utilities
- **class-variance-authority**
- **clsx**
- **date-fns**
- **ApexCharts**
- **Leaflet**

# Jain Automart Public Homepage - Recent Updates

## Hero Section Redesign (`components/jam/Hero.tsx`)
✅ **UPDATED** - Modern industrial blue gradient background for premium brand perception.

### Visual Design
- **Modern Gradient**: Linear gradient at 135deg from deep navy (#002b4f) → blue steel (#004a7c) → vibrant cyan (#0073c0)
- **Radial Glow**: Subtle 10% opacity cyan glow centered on search area to draw user attention to CTAs
- **Decorative Elements**: Geometric shapes (squares, circle) at 5% opacity for industrial/technical aesthetic
- **Grid Pattern**: Subtle 3% opacity grid overlay for depth and precision feel

### Accessibility
- **WCAG AA Compliant**: All text maintains ≥4.5:1 contrast ratio
- **Card Backgrounds**: Black/30 with backdrop blur for optimal white text readability (10.8:1 contrast)
- **Text Opacity**: White text at 90% opacity for clear readability across gradient

### Design Intent
- **Premium Industrial Feel**: Reflects trust, engineering precision, and durability
- **Conversion Focus**: Radial glow subtly directs attention to search form and CTAs
- **Visual Hierarchy**: Gradient creates depth from darker edges to lighter center
- **Performance**: Pure CSS implementation with no heavy assets

## CTA Cards Section (`components/jam/CTACards.tsx`)
✅ **ADDED** - High-conversion CTA cards section positioned directly below Hero banner.

### Purpose
Drive engagement and conversions through three visually stunning, action-oriented cards targeting different user journeys:
1. **Parts Browsing** - Encourage exploration of truck & trailer parts inventory
2. **Import Inquiry** - Target international buyers/importers 
3. **Vehicle Listing** - Motivate sellers to list their vehicles

### Design & Layout
- **Responsive Grid**: 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- **Brand Colors**: Navy blue backgrounds (#0C2C52, gradient variants), orange CTAs (#FFA726)
- **Visual Elements**: 
  - Icon badges (Wrench, Globe, Truck icons)
  - Background images with 20% opacity overlay
  - Decorative blur elements
  - Badge highlights ("Global Shipping", "Free Listing")

### Features
- **Full Card Clickable**: Entire card acts as CTA for better UX
- **Smooth Animations**: Fade-in-up entrance with staggered delay (0.1s per card)
- **Hover Effects**: Scale transform (1.02), shadow lift, button gap animation
- **Analytics Ready**: data-event attributes for conversion tracking
- **Accessibility**: Proper ARIA labels, semantic HTML, WCAG AA contrast

### CTA Routes
1. `/parts-online` - Browse truck & trailer parts
2. `/contact` - Start import inquiry  
3. `/add-listing` - List vehicle for sale

### Technical Implementation
- Next.js Image component with responsive sizes
- Z-index layering for proper content/image stacking
- CSS-in-JS animations with @keyframes
- Lucide React icons for visual hierarchy


## Manufacturing Category Section (`components/jam/ManufacturingCategory.tsx`)
✅ **NEW** - Conversion-optimized category grid replacing Browse by Category section.

### Section Overview
- **Section ID**: `our-manufacturing-category`
- **Title**: "Our Manufacturing Category"
- **Subtitle**: "Discover the core categories we manufacture & supply."
- **Categories**: Exactly 6 categories in specified order

### Categories (in order)
1. **Trailers** - Heavy-duty trailers for long-haul transport
2. **Tippers** - Durable tippers for mining & construction
3. **Tankers & Bulkers** - Safe transport for liquids & bulk materials
4. **Body Building** - Custom body solutions for diverse payloads
5. **Container** - Standard & specialized containers for logistics
6. **Tip Trailers** - High-strength tip trailers for heavy loads

### Responsive Layout
- **Desktop**: 3 columns × 2 rows (grid-cols-3)
- **Tablet**: 2 columns (md:grid-cols-2)
- **Mobile**: 1 column stacked (grid-cols-1)
- **Gap**: 24px between cards
- **Min Height**: 200px per card

### Card Design
- **Layout**: Image (48% width desktop) + Content area (52%)
- **Background**: White with 1px border (#e8edf3)
- **Border Radius**: 12px (rounded-xl)
- **Shadow**: sm (hover: xl)
- **Padding**: 24px

### Interactive Features
- **Hover Effects**: 
  - translateY(-8px) + scale(1.02)
  - Image scale 1.1
  - 12% brand-primary tint overlay
  - Shadow elevation increase
- **CTA**: "Explore" text + chevron icon with gap animation
- **Full Card Clickable**: Entire card acts as navigation link

### Admin Editability
Each category card includes data-cms-key attributes for content management:
- `category-N-title` - Category title
- `category-N-image` - Category image
- `category-N-desc` - Category description
- `category-N-link` - Category link URL

### Analytics & Testing
- **Analytics**: `data-event="category_click_{name}"` on each card
- **QA Testing**: `data-test-id="cat-{name}"` for automated tests
- **Events**: category_click_trailers, category_click_tippers, category_click_tankers, category_click_bodybuilding, category_click_container, category_click_tiptrailers

### Accessibility (WCAG AA)
- **Semantic HTML**: `<section>`, `<ul>`, `<li>`, proper heading hierarchy
- **ARIA**: `aria-labelledby` linking cards to titles
- **Keyboard Navigation**: Full tab navigation with jam-focus-ring
- **Alt Text**: Descriptive alt text on all images
- **Contrast**: #0b2f4d text on white background (>7:1 ratio)

### Performance
- **Lazy Loading**: All images use `loading="lazy"`
- **Responsive Images**: Next.js Image with responsive srcset
- **Optimized Sizes**: (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw
- **Image Format**: WebP with JPEG/PNG fallback
- **File Size**: <500KB per image, optimized for web

### Image Assets
Located in `public/media/categories/`:
- trailers.jpg
- tippers.jpg
- tankers.jpg
- bodybuilding.jpg
- container.jpg
- tiptrailers.jpg
