import { useState, useEffect } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, where, or,
  orderBy, serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { CustomQuery } from "../types/query";

export const useCustomQueries = () => {
  const [queries, setQueries]   = useState<CustomQuery[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // ดึง: public ทั้งหมด + private ของตัวเอง
    const q = query(
      collection(db, "queries"),
      or(
        where("visibility", "==", "public"),
        where("createdBy",  "==", uid)
      ),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      setQueries(snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomQuery)));
      setLoading(false);
    });

    return unsub;
  }, []);

  const addQuery = async (data: Omit<CustomQuery, "id" | "createdAt" | "createdBy" | "createdByName" | "isCustom">) => {
    const user = auth.currentUser!;
    await addDoc(collection(db, "queries"), {
      ...data,
      isCustom: true,
      createdBy: user.uid,
      createdByName: user.displayName || "Unknown",
      createdAt: serverTimestamp(),
    });
  };

  const updateQuery = async (id: string, data: Partial<CustomQuery>) => {
    await updateDoc(doc(db, "queries", id), data);
  };

  const deleteQuery = async (id: string) => {
    await deleteDoc(doc(db, "queries", id));
  };

  return { queries, loading, addQuery, updateQuery, deleteQuery };
};