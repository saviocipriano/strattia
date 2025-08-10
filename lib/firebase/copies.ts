// lib/firebase/copies.ts
import { db, auth } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";

export type CopyPayload = {
  title?: string;
  mode: "raw" | "structured";
  rawText?: string;
  structured?: {
    headline?: string;
    primaryText?: string;
    bullets?: string[];
    ctas?: string[];
    variants?: Record<string, string>;
  };
  prompt?: string;
  tone?: string;
  objective?: string;
};

export async function addCopyToCampaign(campaignId: string, data: CopyPayload) {
  const ref = collection(db, "campaigns", campaignId, "copies");
  const res = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    author: auth?.currentUser?.email || "user",
  });
  return res.id;
}

export async function listCopies(campaignId: string) {
  const q = query(
    collection(db, "campaigns", campaignId, "copies"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export function subscribeCopies(
  campaignId: string,
  cb: (items: any[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "campaigns", campaignId, "copies"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
  });
}

export async function removeCopy(campaignId: string, copyId: string) {
  await deleteDoc(doc(db, "campaigns", campaignId, "copies", copyId));
}

export async function updateCopy(
  campaignId: string,
  copyId: string,
  data: Partial<CopyPayload> & { title?: string }
) {
  await updateDoc(doc(db, "campaigns", campaignId, "copies", copyId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
