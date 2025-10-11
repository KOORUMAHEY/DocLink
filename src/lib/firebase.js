// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    const error = new Error('Firebase configuration is incomplete');
    error.missingFields = missingFields;
    throw error;
  }

  return true;
};

// Create mock Firestore
const createMockFirestore = () => {
  return new Proxy({}, {
    get: function(target, prop) {
      return () => {
        throw new Error('Firebase is not properly configured. Check your environment variables and restart the application.');
      };
    }
  });
};

// Initialize Firebase and get Firestore instance
const initializeFirebase = () => {
  try {
    if (!validateFirebaseConfig()) {
      return { app: null, db: createMockFirestore() };
    }

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    return { app, db };
  } catch (error) {
    console.error('Firebase configuration error:');
    if (error.missingFields) {
      console.error('\nMissing environment variables:');
      error.missingFields.forEach(field => {
        console.error(`- NEXT_PUBLIC_FIREBASE_${field.toUpperCase()}`);
      });
      console.error('\nAdd these to your .env.local file:');
      error.missingFields.forEach(field => {
        console.error(`NEXT_PUBLIC_FIREBASE_${field.toUpperCase()}=your-value-here`);
      });
    } else {
      console.error(error);
    }
    return { app: null, db: createMockFirestore() };
  }
};

const { app, db } = initializeFirebase();

export { app, db };