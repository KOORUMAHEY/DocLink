# Firebase Setup Guide

## Error: "Could not fetch appointments"

If you're seeing this error, it means Firebase is not properly configured. Follow these steps:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database in your project

### 2. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on the **Web app** icon (</>)
4. Copy the configuration values

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values in `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
   ```

### 4. Setup Firestore Collections

Your Firestore database needs these collections:
- `appointments`
- `doctors`
- `patients`

### 5. Restart Development Server

After configuring the environment variables, restart your dev server:
```bash
npm run dev
```

## Troubleshooting

- **Still seeing errors?** Check the browser console for more detailed error messages
- **Permission denied?** Make sure Firestore security rules allow read/write access
- **Invalid configuration?** Double-check that all environment variables are correctly copied

## Mock Data Fallback

If Firebase is not configured, the app will automatically fall back to mock data for development purposes.
