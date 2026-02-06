// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsUjHog0ZoTB9rNlgG0YIdbyJcrNpJxWE",
  authDomain: "howtube-d907c.firebaseapp.com",
  databaseURL: "https://howtube-d907c-default-rtdb.firebaseio.com",
  projectId: "howtube-d907c",
  storageBucket: "howtube-d907c.firebasestorage.app",
  messagingSenderId: "950301321960",
  appId: "1:950301321960:web:c3a9163b701c132ad0f75d",
  measurementId: "G-TMLBJML7YR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Google and Facebook providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export everything
export {
  auth,
  database,
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  updateProfile,
  ref,
  set,
  get,
  update
};
