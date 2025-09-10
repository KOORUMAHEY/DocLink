
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK0yLfr8EpCrCZ0OBuAaZtuz1qZ2Ftqgs",
  authDomain: "doclinkjipmer.firebaseapp.com",
  projectId: "doclinkjipmer",
  storageBucket: "doclinkjipmer.appspot.com",
  messagingSenderId: "489033618166",
  appId: "1:489033618166:web:f814a59ce93dd53b6412d7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
