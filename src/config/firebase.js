// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKNr23fFODU8z_T2_QXQVN-JoFVj7q54s",
  authDomain: "notification-d47b5.firebaseapp.com",
  projectId: "notification-d47b5",
  storageBucket: "notification-d47b5.firebasestorage.app",
  messagingSenderId: "745435649062",
  appId: "1:745435649062:web:025b7e55ebcbc03fb802e7",
  measurementId: "G-J60PJT9PEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
