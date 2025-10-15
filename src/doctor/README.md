# Doctor Module - Primary Implementation Folder

## 📁 Structure

This folder (`src/doctor`) contains the **PRIMARY** implementation for all doctor-related functionality. The `src/app/doctor` folder is ONLY for routing.

```
src/
├── doctor/                          # ✅ PRIMARY - All logic here
│   ├── components/                  # Doctor-specific components
│   ├── layout/
│   │   └── DoctorLayout.jsx        # ✅ Main layout with sidebar
│   └── pages/                       # ✅ Actual page implementations
│       ├── Dashboard.jsx           # Doctor dashboard logic
│       ├── Appointments.jsx        # Appointments management
│       ├── Patients.jsx            # Patient management
│       └── Profile.jsx             # Doctor profile
│
└── app/
    └── doctor/                      # ⚠️ ROUTING ONLY - Thin wrappers
        ├── layout.jsx               # Wraps DoctorLayout
        ├── page.jsx                 # Routes to Dashboard
        ├── appointments/
        │   └── page.jsx            # Routes to Appointments
        ├── patients/
        │   └── page.jsx            # Routes to Patients
        └── profile/
            └── page.jsx            # Routes to Profile
```

## 🎯 Purpose

### `src/doctor/` (THIS FOLDER)

- **Contains ALL business logic**
- **Contains ALL UI components**
- **Contains ALL data fetching**
- **Contains ALL state management**
- **This is where you make changes!**

### `src/app/doctor/`

- **Only for Next.js routing**
- **Thin wrappers that import from `src/doctor/`**
- **Handles URL parameters (searchParams)**
- **Provides Suspense boundaries**
- **NO business logic here!**

## ✅ Layout Configuration

The doctor pages are configured to NOT show the main app's header/footer:

1. **ConditionalLayout** (`src/components/layout/ConditionalLayout.jsx`)

   - Checks if route starts with `/doctor`
   - If yes: Skips Navbar and Footer
   - If no: Shows Navbar and Footer

2. **DoctorLayout** (`src/doctor/layout/DoctorLayout.jsx`)

   - Provides custom sidebar navigation
   - Shows mobile header (not the main app header)
   - Handles sidebar toggle functionality

3. **Doctor Route Layout** (`src/app/doctor/layout.jsx`)
   - Wraps all doctor pages with DoctorLayout
   - Prevents layout from being applied twice

## 🔧 How to Add New Doctor Pages

### Step 1: Create page in `src/doctor/pages/`

```jsx
// src/doctor/pages/NewFeature.jsx
"use client";

export default function NewFeature({ doctorId }) {
  // Your logic here
  return <div>New Feature</div>;
}
```

### Step 2: Create route in `src/app/doctor/`

```jsx
// src/app/doctor/new-feature/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NewFeature from "@/doctor/pages/NewFeature";

function NewFeatureContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id");

  if (!doctorId) {
    return <div>Doctor ID required</div>;
  }

  return <NewFeature doctorId={doctorId} />;
}

export default function NewFeaturePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewFeatureContent />
    </Suspense>
  );
}
```

### Step 3: Add navigation link

Update `src/features/doctors/components/DoctorSidebar.jsx` to include the new link.

## 📝 Important Notes

1. **Always pass `doctorId` as prop** from routing pages to implementation pages
2. **Use `useSearchParams()` in routing layer** (`src/app/doctor/`)
3. **All useState, useEffect, data fetching** goes in `src/doctor/pages/`
4. **DoctorLayout is automatically applied** to all routes under `/doctor`
5. **No Navbar/Footer will show** on any `/doctor/*` route

## 🚨 Common Mistakes

❌ **DON'T** put business logic in `src/app/doctor/` pages

```jsx
// ❌ BAD - src/app/doctor/page.jsx
export default function Page() {
  const [data, setData] = useState([]); // Don't do this here!
  useEffect(() => {
    /* fetch data */
  }); // Don't do this here!
  return <div>{data}</div>;
}
```

✅ **DO** put business logic in `src/doctor/pages/`

```jsx
// ✅ GOOD - src/doctor/pages/Dashboard.jsx
export default function Dashboard({ doctorId }) {
  const [data, setData] = useState([]); // Do this here!
  useEffect(() => { /* fetch data */ }); // Do this here!
  return <div>{data}</div>;
}

// src/app/doctor/page.jsx - Just route to it
import Dashboard from '@/doctor/pages/Dashboard';
export default function Page() {
  return <Dashboard />;
}
```

## 🔗 Related Files

- `src/features/doctors/` - Shared doctor services, actions, components
- `src/features/appointments/` - Appointment services used by doctor pages
- `src/features/patients/` - Patient services used by doctor pages
- `src/app/doctor/layout.jsx` - Route-level layout wrapper

## 📚 Documentation

For more information about the overall architecture, see:

- `/PROJECT_RATING_ANALYSIS.md` - Project assessment and recommendations
- `/ARCHITECTURE.md` - System architecture
- `/STRUCTURE_GUIDE.md` - Complete file structure guide
