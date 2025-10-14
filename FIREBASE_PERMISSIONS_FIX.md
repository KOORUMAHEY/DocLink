# Firebase Setup & Configuration Guide

## Issue: "Missing or insufficient permissions"

This error occurs because Firestore security rules are blocking write operations. Follow these steps to fix it:

## Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/doclinkjipmer/firestore/rules)
2. Click on your project: **doclinkjipmer**
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    // TODO: Implement proper authentication in production
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish** button

## Step 2: Verify Firestore Database is Created

1. Go to [Firestore Database](https://console.firebase.google.com/project/doclinkjipmer/firestore)
2. If you see "Create database", click it and select:
   - **Start in test mode** (for development)
   - Choose a location (e.g., `us-central`)
3. Click **Enable**

## Step 3: Test the Connection

After updating the rules:
1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```
2. Try adding a doctor again
3. Check browser console for the colored logs (🔵 🟢 🔴)

## Step 4: Login Issue

For doctor login, you need to implement Firebase Authentication. Currently, you're storing passwords in Firestore which is not secure.

### Option A: Use Firebase Authentication (Recommended)

1. Enable Authentication in Firebase Console
2. Enable Email/Password provider
3. Implement proper authentication flow

### Option B: Quick Fix for Development Only

If you just want to test the flow, the current implementation will work once Firestore rules are updated.

---

## Security Warning ⚠️

**IMPORTANT**: The current rules (`allow read, write: if true;`) are NOT secure for production!

Before deploying to production:
1. Implement Firebase Authentication
2. Update rules to require authentication:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Require authentication
       match /doctors/{doctorId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == doctorId;
       }
       match /appointments/{appointmentId} {
         allow read, write: if request.auth != null;
       }
       match /patients/{patientId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
3. Hash passwords (never store plain text passwords)
4. Implement proper role-based access control

---

## Quick Checklist

- [ ] Firestore Database is enabled
- [ ] Firestore Rules are set to allow all (development only)
- [ ] `.env.local` file exists with Firebase config
- [ ] Next.js dev server is restarted
- [ ] Browser cache is cleared

## Test Commands

```bash
# Restart dev server
npm run dev

# Check if Firebase is accessible
npx firebase projects:list

# Login to Firebase CLI (if needed)
npx firebase login
```

## Still Having Issues?

1. Check browser console for detailed error messages
2. Verify Firebase project ID matches: `doclinkjipmer`
3. Make sure you're logged into the correct Google account
4. Check that billing is enabled (if required)

---

**Next Steps:**
1. Update Firestore rules in Firebase Console
2. Restart your dev server
3. Try adding a doctor again
