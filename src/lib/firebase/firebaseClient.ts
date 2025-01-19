import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import firebaseConfig from "./config";

// Initialize Firebase
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firebaseClient = getFirestore();
const firebaseAuth = getAuth();
const firebaseStorage = getStorage();
const firebaseDatabase = getDatabase(firebaseApp);
const firebaseStorageUrl = 'https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o';
const signOutFirebaseAuth = () => signOut(firebaseAuth)
export { firebaseApp, firebaseAuth, firebaseClient, firebaseDatabase, firebaseStorage, firebaseStorageUrl, signOutFirebaseAuth };



// https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/craftTemplateStates/0/0/99uHqg2E96odY2AdHYYa
// https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/craftTemplateStates%2F0%2F0%2F99uHqg2E96odY2AdHYYa?alt=media&token=9b65299e-d197-4b6c-987e-2858337efe14