# Overview

Metronic 9 is a comprehensive Next.js template for modern web applications, built on Tailwind CSS 4.x and React 19.x. It serves as a complete admin dashboard and application framework with multiple layout demos, authentication system, user management, and various UI components. The project integrates ReUI (an open-source React component library) and provides a foundation for building scalable web applications with modern design patterns.

**Project**: Jain Automart - Complete commercial vehicle marketplace with public-facing homepage and secure admin panel.

## Public Homepage (`/`)
- **Purpose**: Lead generation and vehicle discovery for commercial vehicle buyers
- **Target**: Fleet owners, logistics companies, individual buyers looking for trucks, trailers, tippers, and commercial vehicles
- **Tech Stack**: Next.js 15, React 19, Tailwind CSS 4 with custom JAM brand design system
- **Design**: High-conversion landing page following growth UX best practices

## Admin Panel (`/jammanage`)
- **Purpose**: Vehicle inventory management, vocabulary administration, and system controls
- **Access**: Secure site-owner login with rate limiting and JWT sessions
- **Modules**: Service Centers, Vehicles (with 9 vocabulary categories)

# User Preferences

Preferred communication style: Simple, everyday language.

# Jain Automart Public Homepage

## Overview (`/`)
The public-facing homepage at the root route serves as a high-conversion lead generation landing page for commercial vehicle buyers. Built with a custom brand design system derived from the Jain Automart logo (deep blue primary, vibrant yellow accent).

## Brand Design System (`/css/jainautomart.css`)
- **Colors**: Deep blue primary (#1E4A7C), vibrant yellow/gold accent (#F59E0B), WCAG AA compliant neutral scale
- **Typography**: Responsive scale (H1: 40/48px desktop → 28/36px mobile)
- **Components**: jam-btn-primary, jam-btn-secondary, jam-card, jam-listing-card, jam-badge-*, jam-chip, jam-sticky-bar
- **Motion**: Fast (120ms), base (180ms), slow (300ms) cubic-bezier transitions
- **Elevation**: 3-level shadow system (elev-1/2/3)

## Homepage Sections (in order)
1. **Header** (`components/jam/Header.tsx`)
   - Logo, mega-menu (Categories dropdown), navigation links (Brands, New, Used, Service Centers, Finance, Blog)
   - Right cluster: Search icon, Compare, Call, WhatsApp buttons
   - Mobile hamburger menu with slide-out navigation

2. **Hero** (`components/jam/Hero.tsx`)
   - Headline: "Heavy Vehicles. Verified. Delivered."
   - Tabbed search bar (New/Used) with dropdowns (Body Type*, Make, City, State)
   - Primary CTAs: Get Best Price, Request Callback, WhatsApp Us
   - Trust badges: RC Verified, Financing Available, Pan-India Delivery, Warranty Options

3. **Category Navigator** (`components/jam/CategoryNavigator.tsx`)
   - 8 vehicle type cards with icons: Truck, Trailer, Tipper, Tanker, Reefer, Container, Tractor, Bus
   - Each shows listing count and "View All" CTA

4. **Featured Listings** (`components/jam/FeaturedListings.tsx`)
   - New/Used toggle tabs
   - Horizontal scrollable carousel with arrow controls
   - Listing cards: 4:3 image with verified ribbon, year/make/model/variant, specs (Axle•GVW•Emission•City), price + negotiable pill
   - CTAs: View Details, Get Best Price, WhatsApp

5. **Brands Section** (`components/jam/BrandsSection.tsx`)
   - Animated horizontal marquee of brand logos
   - Filter chips for popular brands (Tata, Ashok Leyland, Mahindra, Bharat Benz, Eicher, Volvo)

6. **Body Type Finder** (`components/jam/BodyTypeFinder.tsx`)
   - 5 iconic tiles with gradient backgrounds (Tipper, Trailer, Reefer, Container, Tanker)
   - Vehicle counts and deep-links to filtered product listing pages

7. **Why Jain Automart** (`components/jam/WhyJainAutomart.tsx`)
   - 4 value propositions with icons (Verified Docs, Cities Served, Finance/Insurance, Expert Inspection)
   - Statistics band: "10K+ Vehicles • 100+ Cities • 1.5K+ Fleet Owners • 4.7★ Rating"
   - Partner bank logos (HDFC, ICICI, SBI, Axis, Tata Capital, Mahindra Finance)

8. **Finance Section** (`components/jam/FinanceSection.tsx`)
   - Split panel: Pre-approval form (Name, Phone, Vehicle Type, City) + partner information
   - Form validation with success state

9. **Testimonials** (`components/jam/Testimonials.tsx`)
   - Customer testimonials carousel with prev/next controls and dot indicators
   - Each testimonial: photo, quote, star rating, city

10. **Blog Section** (`components/jam/BlogSection.tsx`)
    - 6 blog cards with category badges, images, titles, read time
    - "Read More" CTAs to blog articles

11. **FAQ** (`components/jam/FAQ.tsx`)
    - Accessible accordion with 8 FAQs (finance, RC transfer, delivery, warranty, inspection, EMI, insurance, used vehicles)
    - Collapsible panels with smooth transitions and proper ARIA attributes

12. **Footer** (`components/jam/Footer.tsx`)
    - Logo, social links (Facebook, Twitter, Instagram, LinkedIn, YouTube)
    - Categories, Brands, Quick Links columns
    - Contact information (Phone, Email, WhatsApp, Address)
    - Conversion CTAs: Get Best Price, Call Now, WhatsApp
    - Copyright and compliance links

## Mobile Components
- **Sticky Mobile CTA Bar** (`components/jam/StickyMobileCTA.tsx`)
  - Fixed bottom bar visible only on mobile (<768px)
  - 4 action buttons: Call, WhatsApp, Get Best Price, Filters
  - Auto-hide on scroll down, reveal on scroll up
  - iOS safe area padding support

## Lead Capture System
- **Lead Modal** (`components/jam/LeadModal.tsx`)
  - Triggered by all "Get Best Price" and "Request Callback" CTAs across:
    - Hero section (2 buttons)
    - Featured Listings cards (Best Price buttons)
    - Footer (Get Best Price button)
    - Sticky Mobile CTA bar (Best Price button)
  - Form fields: Name (required), Phone (+91 pattern, required), City (required), State (required), Interest (dropdown: New/Used/Service/Finance), Notes (optional, 280 chars)
  - Consent checkbox: "I agree to be contacted via phone/WhatsApp"
  - Validation states with error messages
  - Success state with WhatsApp deep link (prefilled message)
  - Accessible with proper ARIA attributes

## Implementation Details
- **Main Page**: `app/page.tsx` - Client component managing lead modal state
- **State Management**: React useState for modal open/close, passed via onOpenLeadModal prop to all CTA components
- **Analytics**: data-test-id attributes on all interactive elements for tracking events
- **Accessibility**: WCAG AA contrast, focus states (jam-focus-ring), ARIA labels, keyboard navigation
- **Responsive**: Mobile-first design with tablet/desktop breakpoints
- **Performance**: Optimized images (Next.js Image), scroll-based visibility, transition timing
- **SEO-Ready**: Semantic HTML structure (H1/H2), proper heading hierarchy, ready for structured data implementation

## Technical Stack
- **Framework**: Next.js 15 with App Router, React 19 (client components)
- **Styling**: Tailwind CSS 4 with custom JAM brand tokens
- **Icons**: Lucide React for all iconography
- **Forms**: React Hook Form + Zod validation (LeadModal, FinanceSection)
- **Images**: Next.js Image component with placeholder support
- **TypeScript**: Full type safety with proper interfaces for all component props

# Jain Automart Admin System

## Site Owner Login (`/jammanage`)
- **Route**: `/jammanage` - Secure login portal for site administrators
- **Dashboard**: `/jammanage/dashboard` - Protected admin dashboard (requires authentication)
- **Authentication**: NextAuth.js with custom admin credentials provider
- **Security Features**:
  - bcrypt password hashing for secure credential storage
  - Rate limiting: 5 login attempts per 10 minutes per IP address
  - JWT-based session management
  - Middleware-based route protection
  - No hardcoded credentials (uses environment variables)
- **Design**: 
  - Login page uses Metronic BrandedLayout (2-column grid with branded background)
  - Dashboard uses full Demo4Layout with icon-based sidebar, expandable menu, toolbar, and responsive header/footer
  - All components follow Metronic design system (Alert, Card, Form, Input, Button)
- **Credentials**: Stored in Replit Secrets as `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`

## Implementation Files
- `/app/jammanage/page.tsx` - Login page with Metronic BrandedLayout
- `/app/jammanage/(dashboard)/layout.tsx` - Demo4Layout wrapper for all dashboard routes
- `/app/jammanage/(dashboard)/dashboard/page.tsx` - Protected dashboard with Metronic components
- `/components/jammanage/LoginForm.tsx` - Login form with React Hook Form and Zod validation
- `/app/components/layouts/demo4/components/sidebar-menu-jammanage.tsx` - Custom Jain Automart sidebar menu
- `/app/components/layouts/demo4/components/sidebar-primary.tsx` - Icon-based sidebar with Car icon for Jain Automart
- `/app/components/layouts/demo4/components/sidebar-secondary.tsx` - Expandable menu with route detection
- `/lib/crypto.ts` - bcrypt password verification utilities
- `/lib/rateLimit.ts` - In-memory rate limiting for login attempts
- `/app/api/auth/[...nextauth]/auth-options.ts` - NextAuth configuration with admin provider
- `/middleware.ts` - Route protection for `/jammanage/*` routes

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15.3.x with App Router
- **UI Library**: React 19.x with TypeScript support
- **Styling**: Tailwind CSS 4.x with custom CSS variables and design tokens
- **Component System**: ReUI-based components with shadcn/ui compatibility
- **State Management**: React Query (TanStack Query) for server state, React Context for global UI state
- **Theme System**: next-themes for dark/light mode with custom theme provider
- **Internationalization**: react-i18next with browser language detection and localStorage persistence

## Authentication & Authorization
- **Authentication**: NextAuth.js v4 with Prisma adapter
- **Session Management**: JWT-based sessions with database persistence
- **User Roles**: Role-based access control with permissions system
- **Password Security**: bcrypt for password hashing

## Database & Data Layer
- **ORM**: Prisma with PostgreSQL 17.4.x
- **Database Structure**: Users, roles, permissions, system settings, and audit logs
- **Seeding**: Automated database seeding with faker.js for development data
- **Migrations**: Prisma-managed database schema evolution

## File Storage & Assets
- **Cloud Storage**: AWS S3-compatible storage with DigitalOcean Spaces support
- **File Upload**: Custom file upload hooks with drag-and-drop support
- **Image Processing**: Built-in image input components with preview functionality
- **CDN**: Configurable CDN support for optimized asset delivery

## Layout & Navigation System
- **Multi-Layout Support**: 10 different demo layouts (demo1-demo10) with dynamic switching
- **Responsive Design**: Mobile-first approach with adaptive navigation
- **Menu System**: Hierarchical menu configuration with active state management
- **Settings Provider**: Global settings management with localStorage persistence

## UI Components & Design System
- **Component Library**: Custom components built on ReUI foundation
- **Design Tokens**: CSS custom properties for consistent theming
- **Icons**: Lucide React icons with custom KeenIcons support
- **Animations**: Framer Motion for smooth transitions and interactions
- **Forms**: React Hook Form integration with validation

## Development & Build System
- **TypeScript**: Full TypeScript support with strict configuration
- **Code Quality**: ESLint and Prettier with custom import sorting
- **Build Optimization**: Next.js optimizations with custom path aliases
- **Development Tools**: React Query DevTools and comprehensive debugging setup

# External Dependencies

## Core Dependencies
- **Next.js 15.3.x**: React framework for production applications
- **React 19.x**: UI library with latest features and improvements
- **Tailwind CSS 4.x**: Utility-first CSS framework
- **TypeScript**: Static type checking and enhanced developer experience

## Authentication & Database
- **NextAuth.js**: Authentication library with multiple provider support
- **Prisma**: Modern database toolkit and ORM
- **PostgreSQL**: Primary database for data persistence
- **bcrypt**: Password hashing and security

## UI & Interaction Libraries
- **ReUI**: Open-source React component library
- **shadcn/ui**: UI component collection with Radix UI primitives
- **Radix UI**: Low-level UI primitives for accessibility
- **Lucide React**: Icon library with extensive icon collection
- **Framer Motion**: Animation library for React applications

## Data Management
- **TanStack React Query**: Powerful data synchronization for React
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation (via @hookform/resolvers)

## Internationalization & Localization
- **react-i18next**: Internationalization framework
- **i18next-browser-languagedetector**: Automatic language detection
- **next-i18next**: Next.js integration for i18next

## File Handling & Storage
- **AWS SDK S3**: Cloud storage integration
- **@faker-js/faker**: Generate fake data for development and testing

## Email & Communication
- **Nodemailer**: Email sending capabilities
- **reCAPTCHA**: Bot protection and form security

## Development & Utilities
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings
- **date-fns**: Modern JavaScript date utility library
- **ApexCharts**: Interactive charts and data visualization
- **Leaflet**: Interactive maps integration