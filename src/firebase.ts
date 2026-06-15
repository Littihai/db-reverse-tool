import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDriU0PlkgUmbc7a6K9Ujbw0O_CcVsaJFg",
  authDomain: "db-reverse-engineering.firebaseapp.com",
  projectId: "db-reverse-engineering",
  storageBucket: "db-reverse-engineering.firebasestorage.app",
  messagingSenderId: "349012834328",
  appId: "1:349012834328:web:f00ef4f70c7508d493eb6d",
  measurementId: "G-N1W3N7CV5R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);