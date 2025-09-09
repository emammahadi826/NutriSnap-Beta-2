// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

export { app, auth, db };
