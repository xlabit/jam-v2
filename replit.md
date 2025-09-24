# Overview

Metronic 9 is a comprehensive Next.js template for modern web applications, built on Tailwind CSS 4.x and React 19.x. It serves as a complete admin dashboard and application framework with multiple layout demos, authentication system, user management, and various UI components. The project integrates ReUI (an open-source React component library) and provides a foundation for building scalable web applications with modern design patterns.

# User Preferences

Preferred communication style: Simple, everyday language.

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