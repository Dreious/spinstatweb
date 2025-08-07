// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZZhYHKmQpdo78Pr93nAO7e72sYUtjoPg",
  authDomain: "spinstat-b0a99.firebaseapp.com",
  projectId: "spinstat-b0a99",
  storageBucket: "spinstat-b0a99.firebasestorage.app",
  messagingSenderId: "932791337501",
  appId: "1:932791337501:web:d3f13ab5a8ec73417d3cf4",
  measurementId: "G-T6XNFSPJC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Export the initialized app and analytics
export { app, analytics };