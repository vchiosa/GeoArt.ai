// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  listAll,
} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwaC6V1QqmwC31ORnTryDU2O2joYLegsQ",
  authDomain: "geoart.ai",
  projectId: "xplor-407222",
  storageBucket: "xplor-407222.appspot.com",
  messagingSenderId: "584542012207",
  appId: "1:584542012207:web:36f38bb3c4963715ab17dfa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore
const db = getFirestore(app);

const auth = getAuth(app);

// Google Sign-In
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Reference to the user document
    const userDocRef = doc(db, "users", user.uid);
    // Check if the document exists
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
    }
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Email/Password Sign-In
const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email Sign-In Error:", error);
    throw error;
  }
};

// Email/Password Sign-Up
const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create a user document in Firestore with the name field
    await setDoc(doc(db, "users", result.user.uid), {
      email: result.user.email,
      name: name, // new name field added
      createdAt: new Date(),
    });
    return result.user;
  } catch (error) {
    console.error("Email Sign-Up Error:", error);
    throw error;
  }
};

// Listen for Auth State Changes
const getCurrentUser = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export {
  app,
  db,
  storage,
  auth,
  ref,
  getDownloadURL,
  uploadBytes,
  listAll,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  getCurrentUser,
};
