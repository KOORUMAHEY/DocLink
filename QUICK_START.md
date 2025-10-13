# 🎯 Quick Start - Using the New Structure

## For Developers

### 1. Using Shared Components

```javascript
// EmptyState Component
import { EmptyState } from '@/components/shared/EmptyState';
import { Calendar } from 'lucide-react';

<EmptyState
  icon={Calendar}
  title="No appointments found"
  description="You don't have any appointments yet. Book your first appointment."
  action={{
    label: "Book Appointment",
    onClick: () => router.push('/appointments/book')
  }}
/>
```

```javascript
// LoadingSpinner Component
import { LoadingSpinner, LoadingOverlay } from '@/components/shared/LoadingSpinner';

// Small spinner
<LoadingSpinner size="sm" />

// With text
<LoadingSpinner size="md" text="Loading appointments..." />

// Full page overlay
<LoadingOverlay text="Please wait..." />
```

### 2. Using Appointment Constants

```javascript
import { 
  APPOINTMENT_STATUS, 
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS 
} from '@/features/appointments/constants/appointmentStatus';

// Get status label
const label = APPOINTMENT_STATUS_LABELS[appointment.status]; // "Scheduled"

// Check status
if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
  // Handle cancelled
}
```

### 3. Using Appointment Hook

```javascript
import { useAppointments } from '@/features/appointments/hooks/useAppointments';

function MyComponent() {
  const { 
    appointments, 
    loading, 
    error, 
    refresh 
  } = useAppointments({
    searchQuery: "1234567890",
    autoFetch: true
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### 4. Using Appointment Helpers

```javascript
import { 
  formatAppointmentDate,
  formatAppointmentTime,
  isUpcoming,
  calculateAppointmentStats
} from '@/features/appointments/utils/appointmentHelpers';

// Format dates
const date = formatAppointmentDate(appointment.appointmentDate); // "April 29, 2023"
const time = formatAppointmentTime(appointment.appointmentDate); // "2:30 PM"

// Check if upcoming
if (isUpcoming(appointment.appointmentDate)) {
  console.log("Appointment is in the future");
}

// Calculate stats
const stats = calculateAppointmentStats(appointments);
console.log(`Total: ${stats.total}, Upcoming: ${stats.upcoming}`);
```

### 5. Using Route Constants

```javascript
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';

function MyComponent() {
  const router = useRouter();

  return (
    <div>
      <Link href={ROUTES.APPOINTMENTS.ROOT}>My Appointments</Link>
      <Link href={ROUTES.APPOINTMENTS.BOOK}>Book New</Link>
      <Link href={ROUTES.APPOINTMENTS.DETAIL('123')}>View Details</Link>
      
      <Button onClick={() => router.push(ROUTES.DOCTOR.APPOINTMENTS('doc-id'))}>
        View Doctor Appointments
      </Button>
    </div>
  );
}
```

### 6. Using Global Constants

```javascript
import { 
  APP_NAME,
  APPOINTMENT_RULES,
  DATE_FORMATS,
  TOAST_MESSAGES 
} from '@/lib/constants';
import { format } from 'date-fns';

// App info
console.log(APP_NAME); // "DocLink"

// Business rules
console.log(APPOINTMENT_RULES.AVAILABLE_DAYS); // ["Friday"]

// Date formatting
const formatted = format(new Date(), DATE_FORMATS.DISPLAY);

// Toast messages
toast({
  title: "Success",
  description: TOAST_MESSAGES.SUCCESS.APPOINTMENT_CREATED
});
```

### 7. Using Debounce Hook

```javascript
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms delay

  useEffect(() => {
    if (debouncedSearch) {
      // This only runs 500ms after user stops typing
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 8. Type Safety with JSDoc

```javascript
/**
 * @typedef {import('@/types/global.types').Appointment} Appointment
 */

/**
 * Render appointment card
 * @param {Object} props
 * @param {Appointment} props.appointment - Appointment data
 */
export function AppointmentCard({ appointment }) {
  // TypeScript-like autocomplete in VS Code!
  console.log(appointment.patientName);
  console.log(appointment.status);
}
```

---

## Common Patterns

### Pattern 1: Feature Page Component

```javascript
// src/app/appointments/page.jsx
import { AppointmentsList } from '@/features/appointments/components/AppointmentsList';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

export default function AppointmentsPage({ searchParams }) {
  const { appointments, loading } = useAppointments({
    searchQuery: searchParams.q
  });

  if (loading) return <LoadingSpinner text="Loading appointments..." />;
  
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments found"
        action={{ label: "Book Now", onClick: () => {} }}
      />
    );
  }

  return <AppointmentsList appointments={appointments} />;
}
```

### Pattern 2: Feature Component

```javascript
// src/features/appointments/components/AppointmentCard.jsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAppointmentDate } from '../utils/appointmentHelpers';
import { APPOINTMENT_STATUS_LABELS } from '../constants/appointmentStatus';

export function AppointmentCard({ appointment }) {
  return (
    <Card>
      <h3>{appointment.patientName}</h3>
      <p>{formatAppointmentDate(appointment.appointmentDate)}</p>
      <Badge>{APPOINTMENT_STATUS_LABELS[appointment.status]}</Badge>
    </Card>
  );
}
```

### Pattern 3: Server Action

```javascript
// src/features/appointments/actions/appointmentActions.js
'use server';

import { createAppointment } from '../services/appointmentService';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/config/routes';
import { TOAST_MESSAGES } from '@/lib/constants';

export async function createAppointmentAction(data) {
  try {
    const result = await createAppointment(data);
    revalidatePath(ROUTES.APPOINTMENTS.ROOT);
    return { 
      success: true, 
      message: TOAST_MESSAGES.SUCCESS.APPOINTMENT_CREATED,
      data: result 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || TOAST_MESSAGES.ERROR.GENERIC 
    };
  }
}
```

---

## File Location Quick Reference

| What you need | Where to find it |
|---------------|------------------|
| Button, Card, Input | `@/components/ui/*` |
| EmptyState, LoadingSpinner | `@/components/shared/*` |
| Navbar, Footer | `@/components/layout/*` |
| Custom icons | `@/components/icons/*` |
| Appointment components | `@/features/appointments/components/*` |
| Appointment hook | `@/features/appointments/hooks/useAppointments` |
| Appointment helpers | `@/features/appointments/utils/appointmentHelpers` |
| Status constants | `@/features/appointments/constants/appointmentStatus` |
| Route constants | `@/config/routes` |
| Global constants | `@/lib/constants` |
| Global types | `@/types/global.types` |
| Debounce hook | `@/hooks/useDebounce` |
| Utility functions | `@/lib/utils` |

---

## Import Examples Cheat Sheet

```javascript
// UI Components (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Shared Components
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Layout Components
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// Feature Components
import { AppointmentCard } from '@/features/appointments/components/AppointmentCard';
import { DoctorCard } from '@/features/doctors/components/DoctorCard';

// Hooks
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';

// Services
import { getAppointments } from '@/features/appointments/services/appointmentService';
import { getDoctors } from '@/features/doctors/services/doctorService';

// Constants
import { APPOINTMENT_STATUS } from '@/features/appointments/constants/appointmentStatus';
import { ROUTES } from '@/config/routes';
import { APP_NAME, TOAST_MESSAGES } from '@/lib/constants';

// Utilities
import { cn } from '@/lib/utils';
import { formatAppointmentDate } from '@/features/appointments/utils/appointmentHelpers';

// Types
import type { Appointment } from '@/types/global.types';

// Icons
import { Calendar, Clock, User } from 'lucide-react';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
```

---

## VS Code Snippets

Add these to your VS Code snippets for faster development:

```json
{
  "Feature Component": {
    "prefix": "fcomp",
    "body": [
      "import { Card } from '@/components/ui/card';",
      "",
      "/**",
      " * @param {Object} props",
      " * @param {${1:Type}} props.${2:data}",
      " */",
      "export function ${3:ComponentName}({ ${2:data} }) {",
      "  return (",
      "    <Card>",
      "      <h3>${3:ComponentName}</h3>",
      "      $0",
      "    </Card>",
      "  );",
      "}"
    ]
  },
  "Feature Hook": {
    "prefix": "fhook",
    "body": [
      "'use client';",
      "",
      "import { useState, useEffect } from 'react';",
      "",
      "export function use${1:FeatureName}() {",
      "  const [data, setData] = useState([]);",
      "  const [loading, setLoading] = useState(false);",
      "  const [error, setError] = useState(null);",
      "",
      "  useEffect(() => {",
      "    // Fetch data",
      "    $0",
      "  }, []);",
      "",
      "  return { data, loading, error };",
      "}"
    ]
  },
  "Server Action": {
    "prefix": "faction",
    "body": [
      "'use server';",
      "",
      "import { revalidatePath } from 'next/cache';",
      "",
      "export async function ${1:actionName}(data) {",
      "  try {",
      "    $0",
      "    revalidatePath('/${2:path}');",
      "    return { success: true };",
      "  } catch (error) {",
      "    return { success: false, error: error.message };",
      "  }",
      "}"
    ]
  }
}
```

---

**Pro Tip**: Use VS Code's IntelliSense (Ctrl+Space) to auto-complete imports!
