# 📁 DocLink File Structure Guide

## 🎯 Architecture Overview

DocLink uses a **feature-based architecture** for better scalability, maintainability, and code organization. This guide explains the complete file structure and best practices.

---

## 📂 Directory Structure

```
src/
├── app/                          # Next.js 15 App Router (Pages & Layouts)
├── features/                     # Feature modules (NEW)
├── components/                   # Shared UI components
├── lib/                          # Utility libraries
├── hooks/                        # Custom React hooks
├── services/                     # API & data services (LEGACY - migrate to features/)
├── actions/                      # Server actions (LEGACY - migrate to features/)
├── config/                       # App configuration
├── types/                        # Type definitions
├── context/                      # React contexts
├── locales/                      # i18n translations
└── styles/                       # Global styles
```

---

## 🏗️ Feature-Based Architecture

### Why Feature-Based?

- **Colocation**: Related code stays together
- **Scalability**: Easy to add/remove features
- **Maintainability**: Clear boundaries and responsibilities
- **Team Collaboration**: Multiple developers can work on different features
- **Code Reusability**: Shared components in `/components/shared`

### Feature Structure Template

```
features/
└── [feature-name]/
    ├── components/          # Feature-specific components
    │   ├── FeatureList.jsx
    │   ├── FeatureCard.jsx
    │   └── FeatureForm.jsx
    ├── hooks/               # Feature-specific hooks
    │   ├── useFeature.js
    │   └── useFeatureActions.js
    ├── services/            # API calls for this feature
    │   └── featureService.js
    ├── actions/             # Server actions for this feature
    │   └── featureActions.js
    ├── utils/               # Helper utilities
    │   └── featureHelpers.js
    ├── constants/           # Feature constants
    │   └── featureConstants.js
    ├── types/               # TypeScript/JSDoc types
    │   └── feature.types.js
    └── README.md            # Feature documentation
```

---

## 📋 Detailed Directory Breakdown

### `/app` - Next.js App Router

**Purpose**: Pages, layouts, and route handlers

```
app/
├── layout.jsx                # Root layout
├── page.jsx                  # Home page
├── globals.css               # Global styles
├── appointments/             # Appointment routes
│   ├── layout.jsx
│   ├── page.jsx
│   ├── [id]/page.jsx        # Dynamic route
│   └── book/page.jsx
├── doctor/                   # Doctor portal routes
│   ├── layout.jsx
│   ├── page.jsx
│   └── appointments/page.jsx
└── admin/                    # Admin panel routes
    ├── layout.jsx
    ├── page.jsx
    └── appointments/page.jsx
```

**Best Practices**:
- Keep page components **lean** - they should orchestrate, not implement
- Move business logic to `/features` or `/services`
- Use Server Components by default, add `'use client'` only when needed
- Create `layout.jsx` for shared UI between related routes

---

### `/features` - Feature Modules (NEW ⭐)

**Purpose**: Self-contained feature modules with all related code

#### Current Features:

##### 1. **Appointments Feature**
```
features/appointments/
├── components/
│   ├── AppointmentCard.jsx       # Display single appointment
│   ├── AppointmentsList.jsx      # List of appointments
│   ├── AppointmentForm.jsx       # Book/edit form
│   ├── AppointmentSearch.jsx     # Search component
│   └── AppointmentDetailsModal.jsx
├── hooks/
│   ├── useAppointments.js        # ✅ CREATED - Fetch & manage appointments
│   └── useAppointmentActions.js  # CRUD operations
├── utils/
│   └── appointmentHelpers.js     # ✅ CREATED - Helper functions
├── constants/
│   └── appointmentStatus.js      # ✅ CREATED - Status constants
└── services/
    └── appointmentService.js     # Firestore operations
```

##### 2. **Doctors Feature**
```
features/doctors/
├── components/
│   ├── DoctorCard.jsx
│   ├── DoctorList.jsx
│   ├── DoctorForm.jsx
│   └── DoctorSchedule.jsx
├── hooks/
│   ├── useDoctors.js
│   └── useDoctorSchedule.js
├── services/
│   └── doctorService.js
└── constants/
    └── specialties.js
```

##### 3. **Patients Feature**
```
features/patients/
├── components/
│   ├── PatientCard.jsx
│   ├── PatientForm.jsx
│   └── PatientHistory.jsx
├── hooks/
│   └── usePatients.js
└── services/
    └── patientService.js
```

##### 4. **Admin Feature**
```
features/admin/
├── components/
│   ├── DashboardStats.jsx
│   ├── ActivityLog.jsx
│   └── SystemSettings.jsx
├── services/
│   ├── adminService.js
│   ├── activityService.js
│   └── systemSettingsService.js
└── hooks/
    └── useAdminDashboard.js
```

---

### `/components` - Shared Components

```
components/
├── ui/                      # shadcn/ui primitives (DO NOT MODIFY)
│   ├── button.jsx
│   ├── card.jsx
│   ├── dialog.jsx
│   ├── input.jsx
│   └── ...
├── layout/                  # Layout components
│   ├── navbar.jsx
│   └── footer.jsx
├── shared/                  # Reusable components (NEW ⭐)
│   ├── EmptyState.jsx      # ✅ CREATED
│   ├── LoadingSpinner.jsx  # ✅ CREATED
│   ├── DataTable.jsx
│   ├── SearchBar.jsx
│   └── ErrorBoundary.jsx
└── icons/                   # Custom icons
    ├── icon-book-appointment.jsx
    └── icon-doctor-access.jsx
```

**When to use `/components/shared` vs `/features/[name]/components`**:
- **Shared**: Used by 3+ features or layout components
- **Feature-specific**: Used only within one feature

---

### `/lib` - Utility Libraries

```
lib/
├── firebase/                # Firebase modules (RECOMMENDED)
│   ├── config.js           # Firebase config
│   ├── firestore.js        # Firestore helpers
│   ├── auth.js             # Auth helpers
│   └── storage.js          # Storage helpers
├── utils.js                 # General utilities (cn, etc.)
├── constants.js             # ✅ CREATED - Global constants
└── validators.js            # Shared validators
```

---

### `/hooks` - Global Custom Hooks

```
hooks/
├── use-toast.js             # Toast notifications
├── use-mobile.jsx           # Mobile detection
├── useDebounce.js           # ✅ CREATED - Debounce values
├── useLocalStorage.js       # Local storage hook
└── useAuth.js               # Authentication hook
```

**Naming Convention**: Always prefix with `use`

---

### `/config` - Configuration Files

```
config/
├── routes.js                # ✅ CREATED - Route constants
├── firebase.config.js       # Firebase configuration
└── app.config.js            # App-wide settings
```

**Purpose**: Centralize configuration for easy updates

---

### `/types` - Type Definitions

```
types/
├── global.types.js          # ✅ CREATED - Global types
├── api.types.js             # API response types
└── database.types.js        # Database schema types
```

**Use JSDoc for type safety** without TypeScript:
```javascript
/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} patientName
 */
```

---

### `/services` - API Services (LEGACY - Migrate to features/)

**Current State**: Monolithic services
```
services/
├── appointmentService.js
├── doctorService.js
├── patientService.js
└── admin/
    ├── adminService.js
    └── activityService.js
```

**Migration Plan**: Move to respective feature folders
- ❌ `services/appointmentService.js` 
- ✅ `features/appointments/services/appointmentService.js`

---

### `/actions` - Server Actions (LEGACY)

**Current State**: Separate actions folder
```
actions/
├── appointments.js
├── doctors.js
└── patients.js
```

**Migration Plan**: Move to feature folders
- ❌ `actions/appointments.js`
- ✅ `features/appointments/actions/appointmentActions.js`

---

## 🚀 Migration Guide

### Step 1: Appointments Feature (Example)

1. **Move service**:
   ```bash
   mv src/services/appointmentService.js src/features/appointments/services/
   ```

2. **Move action**:
   ```bash
   mv src/actions/appointments.js src/features/appointments/actions/appointmentActions.js
   ```

3. **Move components**:
   ```bash
   mv src/components/appointment-*.jsx src/features/appointments/components/
   ```

4. **Update imports** in all files:
   ```javascript
   // OLD
   import { getAppointments } from '@/services/appointmentService';
   
   // NEW
   import { getAppointments } from '@/features/appointments/services/appointmentService';
   ```

5. **Add path alias** in `jsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/features/*": ["./src/features/*"]
       }
     }
   }
   ```

---

## 📐 Best Practices

### Component Organization

```javascript
// ✅ GOOD - Clear separation
features/appointments/components/AppointmentCard.jsx
features/appointments/components/AppointmentForm.jsx
features/appointments/components/AppointmentDetailsDialog.jsx

// ❌ BAD - Mixed concerns
components/appointment-card.jsx
app/appointments/appointment-form.jsx
```

### Hook Organization

```javascript
// ✅ GOOD - Descriptive names
features/appointments/hooks/useAppointments.js
features/appointments/hooks/useAppointmentActions.js
features/appointments/hooks/useAppointmentFilters.js

// ❌ BAD - Generic names
hooks/useData.js
hooks/useFetch.js
```

### Service Organization

```javascript
// ✅ GOOD - Feature-specific
features/appointments/services/appointmentService.js

export async function getAppointments(filters) { }
export async function createAppointment(data) { }
export async function updateAppointment(id, data) { }

// ❌ BAD - Mixed responsibilities
services/dataService.js // Too generic
```

---

## 🎨 Naming Conventions

### Files
- **Components**: PascalCase - `AppointmentCard.jsx`
- **Hooks**: camelCase with 'use' prefix - `useAppointments.js`
- **Utils**: camelCase - `appointmentHelpers.js`
- **Constants**: camelCase - `appointmentStatus.js`
- **Services**: camelCase - `appointmentService.js`
- **Types**: camelCase with '.types' - `appointment.types.js`

### Folders
- **Features**: lowercase singular - `appointments/`, `doctors/`
- **Components**: lowercase plural - `components/`, `icons/`
- **General**: lowercase plural - `hooks/`, `services/`, `utils/`

### Variables/Functions
```javascript
// Constants
export const APPOINTMENT_STATUS = { ... };
export const API_ENDPOINTS = { ... };

// Functions
export function getAppointments() { }
export function formatAppointmentDate() { }

// Components
export function AppointmentCard() { }
export default function AppointmentsPage() { }
```

---

## 📚 Import Order Convention

```javascript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. External libraries
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

// 3. Internal - UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Internal - Shared components
import { EmptyState } from '@/components/shared/EmptyState';

// 5. Internal - Feature components
import { AppointmentCard } from '@/features/appointments/components/AppointmentCard';

// 6. Internal - Hooks
import { useAppointments } from '@/features/appointments/hooks/useAppointments';

// 7. Internal - Services
import { getAppointments } from '@/features/appointments/services/appointmentService';

// 8. Internal - Utils/Constants
import { APPOINTMENT_STATUS } from '@/features/appointments/constants/appointmentStatus';
import { formatAppointmentDate } from '@/features/appointments/utils/appointmentHelpers';

// 9. Types
import type { Appointment } from '@/types/global.types';

// 10. Styles
import './styles.css';
```

---

## 🔄 Feature Development Workflow

### Creating a New Feature

1. **Create feature folder structure**:
```bash
mkdir -p src/features/my-feature/{components,hooks,services,utils,constants,types}
```

2. **Create service** (Data layer):
```javascript
// src/features/my-feature/services/myFeatureService.js
export async function getItems() { }
```

3. **Create constants**:
```javascript
// src/features/my-feature/constants/myFeatureConstants.js
export const STATUS = { ... };
```

4. **Create hooks** (State management):
```javascript
// src/features/my-feature/hooks/useMyFeature.js
export function useMyFeature() { }
```

5. **Create components** (UI):
```javascript
// src/features/my-feature/components/MyFeatureCard.jsx
export function MyFeatureCard() { }
```

6. **Create page** (Route):
```javascript
// src/app/my-feature/page.jsx
import { MyFeatureCard } from '@/features/my-feature/components/MyFeatureCard';
```

---

## 🧪 Testing Structure (Future)

```
src/
└── features/
    └── appointments/
        ├── components/
        │   ├── AppointmentCard.jsx
        │   └── AppointmentCard.test.jsx  # Co-located tests
        ├── hooks/
        │   ├── useAppointments.js
        │   └── useAppointments.test.js
        └── services/
            ├── appointmentService.js
            └── appointmentService.test.js
```

---

## 📊 Current Migration Status

### ✅ Completed
- [x] Created feature structure for appointments
- [x] Created `appointmentStatus.js` constants
- [x] Created `useAppointments.js` hook
- [x] Created `appointmentHelpers.js` utilities
- [x] Created route constants (`routes.js`)
- [x] Created global types (`global.types.js`)
- [x] Created shared components (`EmptyState`, `LoadingSpinner`)
- [x] Created `useDebounce` hook
- [x] Created global constants (`constants.js`)

### 🚧 To Do
- [ ] Move `/services/appointmentService.js` to feature folder
- [ ] Move `/actions/appointments.js` to feature folder
- [ ] Move appointment components to feature folder
- [ ] Repeat for doctors feature
- [ ] Repeat for patients feature
- [ ] Repeat for admin feature
- [ ] Update all import paths
- [ ] Add path aliases to `jsconfig.json`
- [ ] Create feature README files
- [ ] Add unit tests

---

## 🔗 Quick Reference

### Key Files Created

| File | Purpose | Status |
|------|---------|--------|
| `features/appointments/constants/appointmentStatus.js` | Status constants | ✅ |
| `features/appointments/hooks/useAppointments.js` | Fetch appointments | ✅ |
| `features/appointments/utils/appointmentHelpers.js` | Helper utilities | ✅ |
| `config/routes.js` | Route constants | ✅ |
| `types/global.types.js` | Type definitions | ✅ |
| `components/shared/EmptyState.jsx` | Empty state UI | ✅ |
| `components/shared/LoadingSpinner.jsx` | Loading indicator | ✅ |
| `hooks/useDebounce.js` | Debounce hook | ✅ |
| `lib/constants.js` | Global constants | ✅ |

---

## 🎓 Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Feature-Based Architecture](https://khalilstemmler.com/articles/software-design-architecture/feature-based-development/)
- [React Component Patterns](https://www.patterns.dev/posts/react-component-patterns)
- [File Structure Best Practices](https://blog.webdevsimplified.com/2022-07/react-folder-structure/)

---

## 🤝 Contributing

When adding new features:
1. Follow the feature template structure
2. Use consistent naming conventions
3. Add JSDoc comments for better IDE support
4. Keep components small and focused
5. Write reusable utilities
6. Document complex logic

---

## 📞 Questions?

If you're unsure where to place a file:
1. **Is it used by 3+ features?** → `/components/shared` or `/lib`
2. **Is it specific to one feature?** → `/features/[name]`
3. **Is it a page?** → `/app`
4. **Is it a global hook?** → `/hooks`
5. **Is it configuration?** → `/config`

---

**Last Updated**: October 13, 2025  
**Version**: 2.0 - Feature-Based Architecture
