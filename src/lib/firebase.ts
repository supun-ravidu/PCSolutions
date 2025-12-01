// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxgvnX5Qm6oH2HRXGIaODjyH8Qpwu2e3I",
  authDomain: "pcsolutions-4a368.firebaseapp.com",
  projectId: "pcsolutions-4a368",
  storageBucket: "pcsolutions-4a368.firebasestorage.app",
  messagingSenderId: "670222675204",
  appId: "1:670222675204:web:80a3e60f354bec24927451",
  measurementId: "G-F50RVNQ8QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, analytics };