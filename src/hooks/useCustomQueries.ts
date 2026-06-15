import { useState, useEffect } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, where,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { CustomQuery } from "../types/query";

export const useCustomQueries = () => {
  const [queries, setQueries] = useState<CustomQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setLoading(false); return; }

    // ไม่ใช้ orderBy เพื่อหลีกเลี่ยง Index requirement
    const myQuery = query(
      collection(db, "queries"),
      where("createdBy", "==", uid)
    );

    const publicQuery = query(
      collection(db, "queries"),
      where("visibility", "==", "public")
    );

    const mergeAndDedup = (a: CustomQuery[], b: CustomQuery[]) => {
      const map = new Map<string, CustomQuery>();
      [...a, ...b].forEach(q => map.set(q.id, q));
      // sort by createdAt descending
      return Array.from(map.values()).sort((x, y) => {
        const tX = typeof x.createdAt === "number" ? x.createdAt : 0;
        const tY = typeof y.createdAt === "number" ? y.createdAt : 0;
        return tY - tX;
      });
    };

    let myData:     CustomQuery[] = [];
    let publicData: CustomQuery[] = [];
    let settled = 0;

    const unsubMy = onSnapshot(myQuery, snap => {
      myData = snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomQuery));
      settled = Math.max(settled, 1);
      setQueries(mergeAndDedup(myData, publicData));
      if (settled >= 2) setLoading(false);
    }, err => {
      console.error("myQuery error:", err.message);
      settled = Math.max(settled, 1);
      if (settled >= 2) setLoading(false);
    });

    const unsubPublic = onSnapshot(publicQuery, snap => {
      publicData = snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomQuery));
      settled = Math.max(settled, 2);
      setQueries(mergeAndDedup(myData, publicData));
      setLoading(false);
    }, err => {
      console.error("publicQuery error:", err.message);
      settled = Math.max(settled, 2);
      setLoading(false);
    });

    return () => { unsubMy(); unsubPublic(); };
  }, []);

  const addQuery = async (
    data: Omit<CustomQuery, "id" | "createdAt" | "createdBy" | "createdByName" | "isCustom">
  ) => {
    const user = auth.currentUser!;
    const tempId = `temp-${Date.now()}`;
    const tempQuery: CustomQuery = {
      ...data,
      id: tempId,
      isCustom: true,
      createdBy: user.uid,
      createdByName: user.displayName || "Unknown",
      createdAt: Date.now(),
    };

    setQueries(prev => [tempQuery, ...prev]);

    try {
      const docRef = await addDoc(collection(db, "queries"), {
        ...data,
        isCustom: true,
        createdBy: user.uid,
        createdByName: user.displayName || "Unknown",
        createdAt: serverTimestamp(),
      });
      setQueries(prev => prev.map(q => q.id === tempId ? { ...tempQuery, id: docRef.id } : q));
    } catch (err) {
      console.error("Add failed:", err);
      setQueries(prev => prev.filter(q => q.id !== tempId));
    }
  };

  const updateQuery = async (id: string, data: Partial<CustomQuery>) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
    try {
      await updateDoc(doc(db, "queries", id), data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteQuery = async (id: string) => {
    setQueries(prev => prev.filter(q => q.id !== id));
    try {
      await deleteDoc(doc(db, "queries", id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return { queries, loading, addQuery, updateQuery, deleteQuery };
};