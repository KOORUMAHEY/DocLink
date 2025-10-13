# DocLink

DocLink is a full-stack Next.js application for a hospital doctor appointment system. It allows patients to book appointments with doctors directly, and provides an admin interface for management.

## Getting Started

### 1. Environment Variables

First, you need to set up your environment variables. Create a file named `.env.local` in the root of the project and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace `your_*` with your actual Firebase project credentials.

### 2. Installing Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Running the Development Server

To run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Build and Run

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 📚 Documentation

Comprehensive documentation for the improved file structure is available:

- **[📋 INDEX.md](./INDEX.md)** - Start here! Navigation guide to all documentation
- **[📝 STRUCTURE_RECOMMENDATIONS.md](./STRUCTURE_RECOMMENDATIONS.md)** - Executive summary of improvements
- **[📖 STRUCTURE_GUIDE.md](./STRUCTURE_GUIDE.md)** - Complete file structure documentation
- **[✅ MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Step-by-step migration plan
- **[⚡ QUICK_START.md](./QUICK_START.md)** - Quick reference for daily development
- **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture & diagrams

### Quick Links

**New Developer?** Start with:
1. [INDEX.md](./INDEX.md)
2. [STRUCTURE_RECOMMENDATIONS.md](./STRUCTURE_RECOMMENDATIONS.md)
3. [QUICK_START.md](./QUICK_START.md)

**Ready to Code?** Use:
- [QUICK_START.md](./QUICK_START.md) - Code examples and patterns

**Migrating Code?** Follow:
- [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) - Phase-by-phase tasks

## 🏗️ Architecture

DocLink uses a **feature-based architecture** for better organization:

```
src/
├── features/           # Feature modules (NEW)
│   ├── appointments/   # All appointment-related code
│   ├── doctors/        # All doctor-related code
│   └── patients/       # All patient-related code
├── components/         # Shared UI components
├── app/               # Next.js App Router pages
├── lib/               # Utility libraries
└── config/            # Configuration files
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams.

## ✨ New Features & Utilities

### Shared Components
- `EmptyState` - Display when no data available
- `LoadingSpinner` - Loading indicators

### Appointment Utilities
- `useAppointments` - Hook for fetching appointments
- `appointmentHelpers` - Date formatting, status helpers
- `appointmentStatus` - Status constants

### Global Configuration
- `routes.js` - Centralized route definitions
- `constants.js` - App-wide constants

See [QUICK_START.md](./QUICK_START.md) for usage examples
