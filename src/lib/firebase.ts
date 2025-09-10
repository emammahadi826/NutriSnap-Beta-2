// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvN0lANt903JVyT_3HCs_NI2nV4I6af6I",
  authDomain: "nutrisnap-vdek6.firebaseapp.com",
  projectId: "nutrisnap-vdek6",
  storageBucket: "nutrisnap-vdek6.firebasestorage.app",
  messagingSenderId: "1033925483096",
  appId: "1:1033925483096:web:d2a77afc87361216bfc82d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators if running in a development environment
// This is crucial for features like QR code sign-in to work during development
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  // Point to the emulators running on your local machine.
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
}


export { app, auth, db };
