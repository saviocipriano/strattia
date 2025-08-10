// lib/firebase/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCLxhQw17SeSwoP8WGYSapkSF8IdMzYA2Q",
  authDomain: "strattia-fb052.firebaseapp.com",
  projectId: "strattia-fb052",
  storageBucket: "strattia-fb052.firebasestorage.app",
  messagingSenderId: "381483084541",
  appId: "1:381483084541:web:7c730716883fd719462c94",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db = getFirestore(app)
