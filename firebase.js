// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "kweet-c347b.firebaseapp.com",
  projectId: "kweet-c347b",
  storageBucket: "kweet-c347b.appspot.com",
  messagingSenderId: "796077313084",
  appId: "1:796077313084:web:72e5de8ce37b0180610739",
  measurementId: "G-3REDD14XKD",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage();
const db = getFirestore();


export { app, db, storage };
