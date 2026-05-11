// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsmpO0YVTP7MWzrZ1RI4RPWRbGaGGU05Q",
  authDomain: "fadefinder-28c28.firebaseapp.com",
  projectId: "fadefinder-28c28",
  storageBucket: "fadefinder-28c28.firebasestorage.app",
  messagingSenderId: "314730594145",
  appId: "1:314730594145:web:f5c99f37462ff5ab48cf20",
  measurementId: "G-Z5RFZN7WET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
