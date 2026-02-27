"use client";

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export function useHistoryPresenter() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const token = Cookies.get("authorization");

  const fetchChannelId = useCallback(async () => {
    if (!token) return null;

    try {
      const res = await fetch(`${BASE_API}/channels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const id = data.channels?.[0]?.id || null;
      setChannelId(id);
      return id;
    } catch {
      return null;
    }
  }, [token]);

  const fetchReport = useCallback(
    async (chId) => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const currentChannelId = chId || channelId || (await fetchChannelId());

        const res = await fetch(`${BASE_API}/report`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal memuat laporan");

        const data = await res.json();
        let filtered = data.comments || [];

        if (currentChannelId) {
          filtered = filtered.filter((c) => c.channelId === currentChannelId);
        }

        filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setComments(filtered);
        setTotal(filtered.length);
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
        setError(err.message);
        setComments([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [token, channelId, fetchChannelId]
  );

  useEffect(() => {
    const init = async () => {
      const chId = await fetchChannelId();
      await fetchReport(chId);
    };
    init();
  }, [token]);

  return {
    comments,
    total,
    loading,
    error,
    refresh: () => fetchReport(channelId),
  };
}
