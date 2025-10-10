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