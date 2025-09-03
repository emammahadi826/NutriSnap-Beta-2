// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkb30KEyc90T5TWAHmqyudbLZo6rhU5hY",
  authDomain: "nutriscan-95ab1.firebaseapp.com",
  databaseURL: "https://nutriscan-95ab1-default-rtdb.firebaseio.com",
  projectId: "nutriscan-95ab1",
  storageBucket: "nutriscan-95ab1.firebasestorage.app",
  messagingSenderId: "171444288043",
  appId: "1:171444288043:web:55a4fc9e02b16b0c2f886e",
  measurementId: "G-C62JB65K1S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
