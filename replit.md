# Restaurant Menu Manager

## Overview

A restaurant management system with two main interfaces: an admin dashboard for restaurant owners to manage their menu, categories, branches, and settings, and a customer-facing digital menu accessible via QR codes. The system supports multi-language content (English, Spanish, French, Persian, Turkish) with RTL support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: tsx for TypeScript execution, Vite dev server for frontend

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Validation**: drizzle-zod for schema-to-Zod type generation
- **Storage Interface**: Abstract storage pattern in `server/storage.ts` allowing different implementations (currently MemStorage for development)

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (admin/, menu/, ui/, examples/)
    pages/        # Route pages (admin/, menu)
    lib/          # Utilities, types, mock data, query client
    hooks/        # Custom React hooks
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
```

### Key Design Decisions
1. **Dual Interface Strategy**: Admin uses Material Design principles; digital menu uses food-app inspired design with visual appeal
2. **Multi-language Support**: All content stored with language-keyed objects (Record<string, string>), supporting LTR and RTL layouts
3. **Mock Data Development**: Uses mock data in `client/src/lib/mockData.ts` for UI development before backend integration
4. **Component Examples**: Example components in `client/src/components/examples/` for development reference

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema management

### UI Libraries
- **Radix UI**: Headless component primitives (dialog, dropdown, accordion, etc.)
- **Lucide React**: Icon library
- **QRCode.react**: QR code generation for menu links
- **Embla Carousel**: Carousel functionality
- **Vaul**: Drawer component

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Runtime schema validation
- **@hookform/resolvers**: Zod integration with React Hook Form

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Tailwind CSS**: Utility-first CSS framework

### Session Management (configured in package.json)
- **connect-pg-simple**: PostgreSQL session store
- **express-session**: Session middleware
- **memorystore**: Development session storage