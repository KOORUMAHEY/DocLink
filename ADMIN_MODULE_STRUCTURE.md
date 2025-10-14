# Admin Module Structure

## Overview

The admin section has been moved outside the `/app` folder for better organization and separation of concerns. This creates a cleaner architecture where the admin module is independent with its own layout and pages.

## New Structure

```
src/
├── admin/                          # Admin module (NEW)
│   ├── layout/
│   │   └── AdminLayout.jsx         # Main layout component for admin
│   ├── pages/
│   │   ├── Dashboard.jsx           # Dashboard page
│   │   ├── Appointments.jsx        # Appointments management
│   │   ├── Patients.jsx            # Patient records
│   │   └── Doctors.jsx             # Doctor management
│   └── components/                 # Admin-specific components
│
├── app/
│   └── admin/                      # Route handlers (MODIFIED)
│       ├── layout.jsx              # Minimal pass-through layout
│       ├── page.jsx                # Uses AdminLayout + Dashboard
│       ├── appointments/
│       │   └── page.jsx            # Uses AdminLayout + Appointments page
│       ├── patients/
│       │   └── page.jsx            # Uses AdminLayout + Patients page
│       └── doctors/
│           └── page.jsx            # Uses AdminLayout + Doctors page
│
└── components/
    └── admin/                      # Shared admin components
        ├── AdminSidebar.jsx
        └── AdminPageHeader.jsx
```

## Key Components

### 1. AdminLayout (`/src/admin/layout/AdminLayout.jsx`)

- **Purpose**: Wrapper layout for all admin pages
- **Features**:
  - Responsive sidebar with mobile toggle
  - Mobile header with menu button
  - Mobile overlay for sidebar
  - Auto-closes sidebar on route change
- **Usage**: Wrap admin page components

```jsx
import AdminLayout from "@/admin/layout/AdminLayout";
import Dashboard from "@/admin/pages/Dashboard";

export default function Page() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
```

### 2. Dashboard (`/src/admin/pages/Dashboard.jsx`)

- **Purpose**: Main admin dashboard
- **Features**:
  - AdminPageHeader with stats
  - Quick action cards
  - Data visualizations
  - Upcoming appointments
  - Recent activities
  - System logs
- **Dependencies**:
  - `getDashboardStats` from features/admin
  - `AdminPageHeader` component
  - `DataVisualizations` component

### 3. Route Integration (`/src/app/admin/page.jsx`)

- **Purpose**: Next.js route that uses the new admin structure
- **Pattern**: Import layout and page from admin module

```jsx
"use client";

import AdminLayout from "@/admin/layout/AdminLayout";
import Dashboard from "@/admin/pages/Dashboard";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
```

## Benefits

### 1. **Better Organization**

- Admin code is separated from main app routes
- Clear module boundaries
- Easier to maintain and scale

### 2. **Reusability**

- Admin layout can be reused across all admin pages
- Page components are pure and focused
- Components can be easily tested

### 3. **Flexibility**

- Easy to add new admin pages
- Can be deployed separately if needed
- Simpler to apply different auth or middleware

### 4. **Code Clarity**

- `/app/admin/*` contains only routing logic
- `/admin/*` contains actual implementation
- Components in `/components/admin/*` are shared utilities

## Migration Pattern

To migrate existing admin pages:

1. **Move page logic to `/src/admin/pages/`**:

```jsx
// src/admin/pages/YourPage.jsx
"use client";
export default function YourPage() {
  // Your page component logic
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">{/* Your content */}</div>
  );
}
```

2. **Update route to use new structure**:

```jsx
// src/app/admin/your-route/page.jsx
"use client";
import AdminLayout from "@/admin/layout/AdminLayout";
import YourPage from "@/admin/pages/YourPage";

export default function Page() {
  return (
    <AdminLayout>
      <YourPage />
    </AdminLayout>
  );
}
```

3. **Keep route layout minimal**:

```jsx
// src/app/admin/layout.jsx
export default function AdminRouteLayout({ children }) {
  return children;
}
```

## Responsive Behavior

### Desktop (≥1024px)

- Sidebar: Fixed, always visible (280px width)
- Content: Offset by sidebar width
- Header: Hidden (sidebar provides navigation)

### Tablet (640px - 1023px)

- Sidebar: Slide-in drawer
- Content: Full width
- Header: Visible with menu button
- Layout: Responsive grid (2 columns)

### Mobile (<640px)

- Sidebar: Slide-in drawer over content
- Content: Full width, single column
- Header: Visible, compact
- Stats: Stack vertically

## Color Scheme

- **Sidebar**: Dark theme (slate-900/800) with gradients
- **Content**: Light theme (gray-50/white)
- **Header**: Responsive with icon and gradient support
- **Cards**: Gradient borders matching content type

## Next Steps

1. **Migrate remaining pages**:

   - Appointments
   - Patients
   - Doctors
   - Settings

2. **Add admin-specific components**:

   - Forms
   - Tables
   - Charts
   - Modals

3. **Enhance features**:
   - Real-time updates
   - Search and filters
   - Bulk actions
   - Export functionality

## File Checklist

- [x] `/src/admin/layout/AdminLayout.jsx` - Layout component
- [x] `/src/admin/pages/Dashboard.jsx` - Dashboard page
- [x] `/src/app/admin/page.jsx` - Route using new structure
- [x] `/src/app/admin/layout.jsx` - Minimal pass-through
- [ ] `/src/admin/pages/Appointments.jsx` - To be migrated
- [ ] `/src/admin/pages/Patients.jsx` - To be migrated
- [ ] `/src/admin/pages/Doctors.jsx` - To be migrated
- [ ] `/src/app/admin/appointments/page.jsx` - Update to use new structure
- [ ] `/src/app/admin/patients/page.jsx` - Update to use new structure
- [ ] `/src/app/admin/doctors/page.jsx` - Update to use new structure
