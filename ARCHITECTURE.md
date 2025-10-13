# 🏗️ DocLink Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DocLink Platform                         │
│                  Healthcare Appointment System                   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              ┌─────▼─────┐              ┌─────▼─────┐
              │  Next.js  │              │ Firebase  │
              │ Frontend  │              │  Backend  │
              └───────────┘              └───────────┘
```

---

## Application Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION                             │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃                      /app (Pages)                           ┃  │
│  ┃  ┌─────────────┬──────────────┬──────────────┬───────────┐ ┃  │
│  ┃  │  / (Home)   │ /appointments │   /doctor    │  /admin   │ ┃  │
│  ┃  │             │     /book     │ /appointments│/doctors   │ ┃  │
│  ┃  │             │    /[id]      │  /patients   │/patients  │ ┃  │
│  ┃  └─────────────┴──────────────┴──────────────┴───────────┘ ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    /components                               │ │
│  │  ┌─────────────┬─────────────┬─────────────┬──────────────┐ │ │
│  │  │   /ui       │   /shared   │  /layout    │   /icons     │ │ │
│  │  │  (shadcn)   │  EmptyState │  Navbar     │  Custom SVG  │ │ │
│  │  │   Button    │  Loading    │  Footer     │              │ │ │
│  │  │   Card      │  DataTable  │             │              │ │ │
│  │  └─────────────┴─────────────┴─────────────┴──────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│                       FEATURE LAYER (NEW ⭐)                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     /features                                │ │
│  │  ┌──────────────┬─────────────┬─────────────┬─────────────┐ │ │
│  │  │ appointments │   doctors   │  patients   │    admin    │ │ │
│  │  ├──────────────┼─────────────┼─────────────┼─────────────┤ │ │
│  │  │ components/  │ components/ │ components/ │ components/ │ │ │
│  │  │ hooks/       │ hooks/      │ hooks/      │ hooks/      │ │ │
│  │  │ services/    │ services/   │ services/   │ services/   │ │ │
│  │  │ actions/     │ actions/    │ actions/    │ actions/    │ │ │
│  │  │ utils/       │ utils/      │ utils/      │ utils/      │ │ │
│  │  │ constants/   │ constants/  │ constants/  │ constants/  │ │ │
│  │  │ types/       │ types/      │ types/      │ types/      │ │ │
│  │  └──────────────┴─────────────┴─────────────┴─────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                          │
│  ┌─────────────┬──────────────┬──────────────┬─────────────────┐  │
│  │    /lib     │   /hooks     │   /config    │     /types      │  │
│  │  Firebase   │  useDebounce │   routes.js  │  global.types   │  │
│  │  utils.js   │  useToast    │ constants.js │   api.types     │  │
│  │ validators  │  useMobile   │              │                 │  │
│  └─────────────┴──────────────┴──────────────┴─────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                      Firebase/Firestore                      │ │
│  │  ┌─────────────┬─────────────┬──────────────┬─────────────┐ │ │
│  │  │appointments │   doctors   │   patients   │   activity  │ │ │
│  │  │ collection  │ collection  │  collection  │    logs     │ │ │
│  │  └─────────────┴─────────────┴──────────────┴─────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

---

## Feature Module Architecture

```
                    ┌─────────────────────────────┐
                    │   Feature Module Pattern    │
                    └─────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐         ┌───────────────┐       ┌───────────────┐
│  COMPONENTS   │         │     HOOKS     │       │   SERVICES    │
│               │         │               │       │               │
│  FeatureCard  │◄────────│ useFeature    │◄──────│ getFeatures   │
│  FeatureForm  │         │ useFeatureOps │       │ createFeature │
│  FeatureList  │         │               │       │ updateFeature │
└───────────────┘         └───────────────┘       └───────────────┘
        │                         │                         │
        │                         ▼                         │
        │                 ┌───────────────┐                 │
        │                 │   CONSTANTS   │                 │
        └────────────────►│               │◄────────────────┘
                          │  STATUS       │
                          │  TYPES        │
                          │  DEFAULTS     │
                          └───────────────┘
                                  │
                                  ▼
                          ┌───────────────┐
                          │     UTILS     │
                          │               │
                          │  formatters   │
                          │  validators   │
                          │  helpers      │
                          └───────────────┘
```

---

## Data Flow Diagram

```
┌──────────┐         ┌──────────────┐         ┌────────────┐
│   User   │────────►│  Next.js UI  │────────►│  Feature   │
│ Actions  │         │  Components  │         │   Hooks    │
└──────────┘         └──────────────┘         └────────────┘
                                                      │
                                                      ▼
                                              ┌────────────┐
                                              │  Services  │
                                              │   (API)    │
                                              └────────────┘
                                                      │
                                                      ▼
                                              ┌────────────┐
                                              │  Firebase  │
                                              │ Firestore  │
                                              └────────────┘
                                                      │
                                                      ▼
                                              ┌────────────┐
                                              │   State    │
                                              │  Update    │
                                              └────────────┘
                                                      │
                                                      ▼
                                              ┌────────────┐
                                              │  Re-render │
                                              │     UI     │
                                              └────────────┘
```

---

## Appointments Feature Detailed View

```
┌──────────────────────────────────────────────────────────────────┐
│              features/appointments/ (Example)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  components/                                                     │
│  ├── AppointmentCard.jsx           Display single appointment   │
│  ├── AppointmentsList.jsx          List view with filtering     │
│  ├── AppointmentForm.jsx           Create/Edit form             │
│  ├── AppointmentSearch.jsx         Search with debounce         │
│  ├── AppointmentDetailsModal.jsx   Details dialog               │
│  ├── RescheduleDialog.jsx          Reschedule functionality     │
│  └── CancelDialog.jsx              Cancellation flow            │
│                                                                  │
│  hooks/                                                          │
│  ├── useAppointments.js            Fetch & state management ✅  │
│  ├── useAppointmentActions.js      CRUD operations              │
│  └── useAppointmentSearch.js       Search with debounce         │
│                                                                  │
│  services/                                                       │
│  └── appointmentService.js         Firestore operations         │
│      ├── getAppointments()                                      │
│      ├── getAppointmentById()                                   │
│      ├── createAppointment()                                    │
│      ├── updateAppointment()                                    │
│      └── deleteAppointment()                                    │
│                                                                  │
│  actions/                                                        │
│  └── appointmentActions.js         Server actions               │
│      ├── createAppointmentAction()                              │
│      └── updateStatusAction()                                   │
│                                                                  │
│  utils/                                                          │
│  └── appointmentHelpers.js         Helper functions ✅          │
│      ├── formatAppointmentDate()                                │
│      ├── formatAppointmentTime()                                │
│      ├── isUpcoming()                                           │
│      ├── isPast()                                               │
│      └── calculateAppointmentStats()                            │
│                                                                  │
│  constants/                                                      │
│  └── appointmentStatus.js          Status definitions ✅        │
│      ├── APPOINTMENT_STATUS                                     │
│      ├── APPOINTMENT_STATUS_LABELS                              │
│      ├── APPOINTMENT_STATUS_COLORS                              │
│      └── APPOINTMENT_STATUS_VARIANTS                            │
│                                                                  │
│  types/                                                          │
│  └── appointment.types.js          TypeScript/JSDoc types       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## User Role Flow Diagram

```
                        ┌──────────────┐
                        │    USERS     │
                        └──────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
    ┌─────────┐          ┌─────────┐          ┌─────────┐
    │ PATIENT │          │ DOCTOR  │          │  ADMIN  │
    └─────────┘          └─────────┘          └─────────┘
         │                     │                     │
         │                     │                     │
    ┌────▼─────┐          ┌────▼─────┐          ┌────▼─────┐
    │  /app/   │          │ /app/    │          │ /app/    │
    │appointments│        │  doctor/ │          │  admin/  │
    │  /book   │          │appointments│        │appointments│
    └──────────┘          │ /patients│          │ /doctors │
                          └──────────┘          │ /patients│
                                                └──────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Feature Modules │
                    │   (Shared Logic) │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │    Firestore     │
                    └──────────────────┘
```

---

## Component Hierarchy

```
App
│
├── RootLayout
│   ├── Navbar
│   ├── Main Content
│   │   │
│   │   ├── HomePage
│   │   │   ├── Hero Section
│   │   │   ├── Features Cards
│   │   │   └── CTA Buttons
│   │   │
│   │   ├── AppointmentsPage
│   │   │   ├── SearchBar
│   │   │   ├── Stats Cards
│   │   │   └── AppointmentsList
│   │   │       └── AppointmentCard
│   │   │           ├── Badge (Status)
│   │   │           ├── Dialog (Details)
│   │   │           └── Actions Menu
│   │   │
│   │   ├── DoctorPortal
│   │   │   ├── DoctorSidebar
│   │   │   ├── DoctorHeader
│   │   │   └── DoctorContent
│   │   │       ├── Dashboard
│   │   │       ├── Appointments
│   │   │       └── Patients
│   │   │
│   │   └── AdminPanel
│   │       ├── Sidebar
│   │       ├── Stats Dashboard
│   │       ├── Data Visualizations
│   │       └── Management Tables
│   │
│   ├── Footer
│   └── Toaster
│
└── Providers
    ├── I18nProvider
    └── AuthProvider (future)
```

---

## Request Flow (Example: Book Appointment)

```
1. User Action
   └─► Click "Book Appointment" button
        │
2. Navigation
   └─► router.push('/appointments/book')
        │
3. Page Load
   └─► /app/appointments/book/page.jsx renders
        │
4. Form Display
   └─► AppointmentForm component shows
        │
5. User Fills Form
   └─► React Hook Form manages state
        │
6. Form Submit
   └─► onSubmit handler triggered
        │
7. Server Action
   └─► createAppointmentAction() called
        │
8. Service Layer
   └─► appointmentService.createAppointment()
        │
9. Firebase Call
   └─► Firestore.collection('appointments').add()
        │
10. Response
    └─► Success/Error returned
         │
11. UI Update
    └─► Toast notification shown
         │
12. Revalidation
    └─► Next.js revalidates /appointments
         │
13. Redirect
    └─► router.push('/appointments')
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Component                         │
│                                                             │
│  1. Component mounts                                        │
│     └─► useAppointments() hook called                      │
│                                                             │
│  2. Hook initialization                                     │
│     └─► useState([]) - Initialize empty state              │
│     └─► useState(false) - Loading state                    │
│                                                             │
│  3. useEffect triggered                                     │
│     └─► fetchAppointments() called                         │
│                                                             │
│  4. Fetch data                                              │
│     └─► appointmentService.getAppointments()               │
│                                                             │
│  5. Service calls Firebase                                  │
│     └─► Firestore query executed                           │
│                                                             │
│  6. Data received                                           │
│     └─► setAppointments(data)                              │
│     └─► setLoading(false)                                  │
│                                                             │
│  7. Component re-renders                                    │
│     └─► UI updates with new data                           │
│                                                             │
│  8. User action triggers update                             │
│     └─► Server action called                               │
│     └─► refresh() method called                            │
│                                                             │
│  9. State updates                                           │
│     └─► Component re-renders with fresh data               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure Visualization

```
DocLink/
│
├── 📱 src/
│   │
│   ├── 📄 app/                      # Next.js routes
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── 📁 appointments/
│   │   ├── 📁 doctor/
│   │   └── 📁 admin/
│   │
│   ├── ✨ features/                 # NEW: Feature modules
│   │   ├── 📁 appointments/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── actions/
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   └── types/
│   │   ├── 📁 doctors/
│   │   ├── 📁 patients/
│   │   └── 📁 admin/
│   │
│   ├── 🧩 components/               # Shared components
│   │   ├── 📁 ui/
│   │   ├── 📁 shared/
│   │   ├── 📁 layout/
│   │   └── 📁 icons/
│   │
│   ├── 🔧 lib/                      # Utilities
│   │   ├── firebase.js
│   │   ├── utils.js
│   │   └── constants.js
│   │
│   ├── 🎣 hooks/                    # Global hooks
│   │   ├── use-toast.js
│   │   ├── use-mobile.jsx
│   │   └── useDebounce.js
│   │
│   ├── ⚙️  config/                   # Configuration
│   │   ├── routes.js
│   │   └── app.config.js
│   │
│   ├── 📝 types/                    # Type definitions
│   │   └── global.types.js
│   │
│   ├── 🌍 locales/                  # i18n
│   │   ├── en.json
│   │   ├── hi.json
│   │   └── ta.json
│   │
│   └── 🎨 context/                  # React contexts
│       └── i18n.js
│
├── 📚 Documentation
│   ├── STRUCTURE_GUIDE.md           # ✅ Full guide
│   ├── MIGRATION_CHECKLIST.md       # ✅ Migration plan
│   ├── QUICK_START.md               # ✅ Quick reference
│   └── ARCHITECTURE.md              # ✅ This file
│
└── 🔥 Firebase
    ├── dataconnect/
    ├── firebase.json
    └── apphosting.yaml
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                       │
├─────────────────────────────────────────────────────────┤
│  Framework          │  Next.js 15 (App Router)         │
│  Language           │  JavaScript (with JSDoc types)    │
│  UI Library         │  React 19                         │
│  Styling            │  Tailwind CSS 4                   │
│  Components         │  shadcn/ui + Radix UI             │
│  Icons              │  Lucide React                     │
│  Forms              │  React Hook Form + Zod            │
│  Date Management    │  date-fns                         │
│  Charts             │  Recharts                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                        │
├─────────────────────────────────────────────────────────┤
│  Database           │  Firebase Firestore               │
│  Authentication     │  Firebase Auth                    │
│  Storage            │  Firebase Storage                 │
│  Hosting            │  Firebase App Hosting             │
│  Data Connect       │  Firebase Data Connect            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Development Tools                       │
├─────────────────────────────────────────────────────────┤
│  Package Manager    │  npm                              │
│  Version Control    │  Git                              │
│  Linting            │  ESLint                           │
│  Deployment         │  Firebase App Hosting             │
└─────────────────────────────────────────────────────────┘
```

---

## Key Architectural Decisions

### 1. Feature-Based Organization ✅
- **Why**: Better scalability and maintainability
- **Impact**: Easier to add/remove features
- **Status**: In progress (10% complete)

### 2. Server Components by Default
- **Why**: Better performance, smaller bundles
- **Impact**: Faster page loads
- **Status**: Implemented

### 3. Server Actions for Mutations
- **Why**: Type-safe, no API routes needed
- **Impact**: Simpler data mutations
- **Status**: Implemented

### 4. shadcn/ui for Components
- **Why**: Customizable, accessible, modern
- **Impact**: Consistent design system
- **Status**: Fully implemented

### 5. JSDoc for Type Safety
- **Why**: Type hints without TypeScript migration
- **Impact**: Better IDE support
- **Status**: Partially implemented

### 6. Firestore for Database
- **Why**: Real-time, scalable, serverless
- **Impact**: No backend maintenance
- **Status**: Fully implemented

---

**Last Updated**: October 13, 2025  
**Architecture Version**: 2.0 - Feature-Based
