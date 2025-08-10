// lib/firebase/campanhas.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export async function createCampaign(data: {
  nome: string
  plataforma: string
  status: string
  usarIa: boolean
}) {
  const docRef = await addDoc(collection(db, "campanhas"), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function getCampaigns() {
  const q = query(collection(db, "campanhas"), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
