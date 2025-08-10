import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLxhQw17SeSwoP8WGYSapkSF8IdMzYA2Q",
  authDomain: "strattia-fb052.firebaseapp.com",
  projectId: "strattia-fb052",
  storageBucket: "strattia-fb052.appspot.com", // Corrigido aqui: .appspot.com
  messagingSenderId: "381483084541",
  appId: "1:381483084541:web:7c730716883fd719462c94",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
