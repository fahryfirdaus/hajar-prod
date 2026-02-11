'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export function useDashboardPresenter() {
  const [userInfo, setUserInfo] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = Cookies.get('authorization');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      try {
        // Fetch channel info and report data in parallel
        const [channelRes, reportRes] = await Promise.all([
          fetch(`${BASE_API}/channels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_API}/report`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const channelData = await channelRes.json();
        if (channelData.channels?.length > 0) {
          setUserInfo(channelData.channels[0]);
        } else {
          await syncChannel();
        }

        if (reportRes.ok) {
          const report = await reportRes.json();
          setReportData(report);
        }
      } catch (err) {
        console.error('Gagal fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const syncChannel = async () => {
    try {
      const res = await fetch(`${BASE_API}/channels/sync`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.channels?.length > 0) {
        setUserInfo(data.channels[0]);
        
        // Sync videos after syncing channel
        const channelId = data.channels[0].id;
        await syncVideos(channelId);
      } else {
        throw new Error('Tidak ada channel ditemukan');
      }

      return data;
    } catch (err) {
      console.error('Gagal sync channel:', err);
      throw err;
    }
  };

  const syncVideos = async (channelId) => {
    try {
      const res = await fetch(`${BASE_API}/${channelId}/videos/sync`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Gagal sync videos');
      }

      const data = await res.json();
      console.log('Videos berhasil disinkronisasi');
      return data;
    } catch (err) {
      console.error('syncVideos error:', err.message);
      throw err;
    }
  };

  return {
    userInfo,
    reportData,
    loading,
    syncChannel,
    syncVideos,
  };
}