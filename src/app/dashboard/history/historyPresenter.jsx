"use client";

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export function useHistoryPresenter() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("authorization");

  const fetchReport = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_API}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal memuat laporan");

      const data = await res.json();
      setComments(data.comments || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
      setError(err.message);
      setComments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    comments,
    total,
    loading,
    error,
    refresh: fetchReport,
  };
}
