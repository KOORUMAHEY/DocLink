# Firestore Timestamp Serialization Fix

## Problem
Next.js 15 with Turbopack shows error:
```
Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported.
```

This happens because Firestore Timestamp objects have `toJSON` methods and can't be directly passed from server to client components.

## Solution

### 1. Created Firestore Serializer Utility
- **File**: `/src/lib/firestore-serializer.js`
- **Purpose**: Systematically converts Firestore Timestamps to ISO strings
- **Functions**:
  - `serializeTimestamp()` - Converts single timestamp
  - `serializeFirestoreData()` - Recursively serializes objects
  - `serializeAppointments()` - Serializes appointment arrays
  - `deserializeDates()` - Converts ISO strings back to Date objects

### 2. Updated Appointments Page
- **File**: `/src/app/appointments/page.jsx`
- **Change**: Uses `serializeAppointments()` instead of manual serialization
- **Benefit**: Handles all timestamp fields automatically

### 3. Enhanced Service Layer
- **File**: `/src/features/appointments/services/appointmentService.js`
- **Change**: Ensures consistent Date object formatting from Firestore
- **Benefit**: Proper data types throughout the application

## Timestamp Fields Handled
- `appointmentDate`
- `createdAt`
- `updatedAt`
- `lastUpdated`
- `approvedAt`
- `rejectedAt`
- `rescheduledAt`
- `completedAt`
- `cancelledAt`

## Usage

### In Server Components:
```javascript
import { serializeAppointments } from '@/lib/firestore-serializer';

// Fetch data with Firestore Timestamps
const appointments = await getAppointments();

// Serialize for client components
const serializedAppointments = serializeAppointments(appointments);

// Pass to client component
<ClientComponent appointments={serializedAppointments} />
```

### In Client Components:
```javascript
// Dates come as ISO strings, convert to Date objects for manipulation
const appointmentDate = new Date(appointment.appointmentDate);

// Use with date-fns or other date libraries
import { format } from 'date-fns';
const formattedDate = format(appointmentDate, 'MMM dd, yyyy');
```

## Error Prevention
- All Firestore Timestamps automatically converted to ISO strings
- Client components receive only plain objects
- Date formatting works consistently across components
- No more "toJSON methods not supported" errors

## Benefits
1. **Compatibility**: Works with Next.js 15 + Turbopack
2. **Consistency**: Standardized date handling
3. **Maintainability**: Single utility for all timestamp conversions
4. **Flexibility**: Easy to add new timestamp fields
5. **Performance**: Efficient serialization process

This fix ensures the appointment system works properly with Next.js 15's strict client/server component separation requirements.