# Firebase Setup Guide for Appointment Backend

## Quick Answer

✅ **Good News**: Your Firebase is already set up correctly for the appointment backend. The backend will work out-of-the-box with your existing Firebase configuration.

## What You Need to Know

### Current Firebase Setup

Your Firebase configuration is already in place:

- ✅ Firestore database initialized
- ✅ Collections auto-create on first write
- ✅ Rules allow read/write (development mode)
- ✅ Environment variables configured

### What Happens Automatically

When you use the appointment backend, Firestore will **automatically create these collections on first use**:

```
firestore/
├── appointments/
│   └── {appointmentId}/
│       ├── (appointment data fields)
│       └── auditLog/
│           └── (audit log entries)
├── notifications/
│   └── (notification documents)
└── (other existing collections)
```

### Data Storage Without Action Required

The backend will automatically store:

1. **Appointments** - Enhanced with new fields:

   - `approvedAt`, `approvedBy`, `approvalNotes`
   - `rejectedAt`, `rejectedBy`, `rejectionReason`
   - `completedAt`, `completedBy`, `appointmentSummary`
   - `cancelledAt`, `cancelledBy`, `cancellationReason`
   - `doctorNotes`, `notesUpdatedAt`
   - And more...

2. **Audit Logs** (Subcollection) - Automatic entries for:

   - Each approval
   - Each rejection
   - Each completion
   - Each cancellation
   - Each rescheduling
   - Each note update

3. **Notifications** - Auto-created for:
   - Approval notifications
   - Rejection notifications
   - Completion notifications
   - Cancellation notifications
   - Reschedule notifications
   - No-show notifications

## Do You Need to Do Anything?

### ✅ No - for development

Your current setup is perfect for development. The backend will work immediately.

### ⚠️ Optional - for production

If you plan to go to production, consider these upgrades:

#### 1. Update Firestore Rules (Security)

**Current (Development)**:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Recommended (Production)**:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access
    function isAuthenticated() {
      return request.auth != null;
    }

    // Only doctors can approve/reject/complete their own appointments
    function isDoctor(docId) {
      return request.auth.uid == docId;
    }

    // Only patient or doctor related to appointment can access
    function canAccessAppointment(aptId) {
      let apt = get(/databases/$(database)/documents/appointments/$(aptId)).data;
      return request.auth.uid == apt.doctorId || request.auth.uid == apt.patientId;
    }

    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated() && canAccessAppointment(appointmentId);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        isDoctor(resource.data.doctorId) ||
        request.auth.uid == resource.data.patientId
      );

      // Audit log subcollection
      match /auditLog/{logId} {
        allow read: if isAuthenticated() && canAccessAppointment(appointmentId);
        allow create: if isAuthenticated();
      }
    }

    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && request.auth.uid == resource.data.recipientId;
      allow create: if isAuthenticated();
    }
  }
}
```

#### 2. Set Up Firestore Indexes (Performance - Optional)

For better query performance, create these composite indexes:

**Index 1 - Get appointments by doctor**

- Collection: `appointments`
- Fields: `doctorId` (Ascending), `appointmentDate` (Descending)

**Index 2 - Get pending appointments**

- Collection: `appointments`
- Fields: `doctorId` (Ascending), `status` (Ascending), `appointmentDate` (Descending)

**How to Create**:

1. Go to Firebase Console
2. Navigate to Firestore Database → Indexes
3. Click "Create Index"
4. Select collection and add fields
5. Click "Create"

Alternatively, indexes will be suggested automatically when you run queries that need them.

#### 3. Enable Firestore Backups (Optional)

For production data safety:

1. Go to Firebase Console
2. Firestore Database → Backups
3. Enable automated daily backups
4. Set retention period (30 days recommended)

## Estimated Firestore Usage

### Storage per Appointment

- Base appointment: ~2 KB
- With approvals/notes: ~5 KB
- Audit log entries: ~0.5 KB per action (typically 5-10 entries)
- Total per appointment: ~10-15 KB

### Free Tier Coverage

Firebase free tier includes:

- ✅ 1 GB storage (can store ~100,000 appointments)
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day

For 100 daily appointments with 3 actions each:

- Reads: ~500/day ✅
- Writes: ~300/day ✅
- Storage: ~100 MB ✅

## Environment Variables Already Set ✅

Your `.env` file should have (if not, add them):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Testing the Backend

### Test Locally (Development)

1. Start the dev server:

```bash
npm run dev
```

2. Go to your appointments page:

```
http://localhost:3000/doctor/appointments
```

3. Try these actions:

- ✅ Click "Approve" on a pending appointment
- ✅ Click "Reject" on a pending appointment
- ✅ Check the browser console for success/errors
- ✅ Look at Firebase Firestore to see new data

### Verify in Firebase Console

1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. You should see new collections:
   - `appointments` (with updated fields)
   - `notifications` (for status changes)

### Check Audit Log

1. In Firestore, open an appointment document
2. Look for `auditLog` subcollection
3. You should see entries for each action:
   - `action: "APPROVED"`
   - `action: "REJECTED"`
   - `action: "COMPLETED"`
   - etc.

## Common Issues & Solutions

### Issue: "Firebase is not configured"

**Solution**: Check your `.env` file has all required Firebase config values

### Issue: Permissions denied error

**Solution**: In development, your rules allow everything. In production, update rules to match your auth setup

### Issue: Collections not appearing in Firestore

**Solution**: They auto-create on first write. Try approving/rejecting an appointment to trigger writes

### Issue: Audit logs not showing

**Solution**: They're stored in a subcollection under each appointment. Check inside the appointment document

## Optional Enhancements

### 1. Real-time Updates

Current setup reads data on demand. For real-time updates (optional):

```javascript
import { onSnapshot } from "firebase/firestore";

// Watch appointments in real-time
onSnapshot(appointmentsQuery, (snapshot) => {
  const appointments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // Update state with real-time data
});
```

### 2. Cloud Functions (Advanced)

For future enhancement - trigger email/SMS on approval:

```javascript
// Not implemented yet, but could add:
- Send email on approval
- Send SMS on rejection
- Auto-create follow-up appointments
```

### 3. Analytics

Track appointment metrics:

```javascript
import { logEvent } from "firebase/analytics";

// Log approval
logEvent(analytics, "appointment_approved", {
  appointment_id: appointmentId,
  timestamp: new Date(),
});
```

## Checklist for Production

- [ ] Review and update Firestore security rules
- [ ] Create composite indexes for performance
- [ ] Set up automated backups
- [ ] Test with production data volume
- [ ] Monitor Firestore usage in Firebase Console
- [ ] Set up billing alerts
- [ ] Plan for scaling

## Summary

| Aspect                  | Status          | Action                       |
| ----------------------- | --------------- | ---------------------------- |
| Firestore Initialized   | ✅ Ready        | None                         |
| Collections Auto-create | ✅ Ready        | None                         |
| Backend Works           | ✅ Ready        | None                         |
| Development Rules       | ✅ Ready        | None                         |
| Security Rules          | ⚠️ Development  | Update for production        |
| Indexes                 | ✅ Auto-created | Optional manual optimization |
| Backups                 | ❌ Not set      | Set up for production        |

## Quick Start

**No Firebase setup needed!** Just:

1. ✅ Verify `.env` has Firebase config (already should be there)
2. ✅ Start dev server: `npm run dev`
3. ✅ Test appointment approvals in the UI
4. ✅ Watch data appear in Firestore Console

Everything will work automatically. The backend is ready to go! 🚀

---

**Questions?** See:

- `/APPOINTMENT_BACKEND_API.md` - Full API docs
- `/APPOINTMENT_BACKEND_INTEGRATION.md` - Integration guide
- `/src/app/api/appointments/actions/route.js` - Backend implementation
