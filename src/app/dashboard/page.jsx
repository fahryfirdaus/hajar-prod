"use client";

import { useDashboardPresenter } from "./dashboardPresenter";
import { useRouter } from "next/navigation";
import { Button, Skeleton, addToast } from "@heroui/react";
import { IoMdRefresh } from "react-icons/io";
import {
  FaHome,
  FaYoutube,
  FaUsers,
  FaPlay,
  FaEye,
  FaCalendarAlt,
  FaShieldAlt,
  FaTrashAlt,
  FaClock,
  FaChartBar,
} from "react-icons/fa";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_COLORS = {
  deleted: "#ef4444",
  pending: "#f59e0b",
  total: "#3b82f6",
};

const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          {payload[0].value} komentar ({payload[0].payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipBar = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardContent = () => {
  const { userInfo, reportData, syncChannel, loading } =
    useDashboardPresenter();
  const router = useRouter();

  const analytics = useMemo(() => {
    if (!reportData?.comments || !userInfo?.id) {
      return { total: 0, deleted: 0, pending: 0, pieData: [], barData: [] };
    }

    const comments = reportData.comments.filter(
      (c) => c.channelId === userInfo.id
    );
    const total = comments.length;
    const isDeleted = (s) => s === "deleted" || s === "hidden";
    const deleted = comments.filter((c) => isDeleted(c.status)).length;
    const pending = comments.filter((c) => !isDeleted(c.status)).length;

    const pieData = [
      {
        name: "Dihapus",
        value: deleted,
        color: CHART_COLORS.deleted,
        percentage: total > 0 ? Math.round((deleted / total) * 100) : 0,
      },
      {
        name: "Pending",
        value: pending,
        color: CHART_COLORS.pending,
        percentage: total > 0 ? Math.round((pending / total) * 100) : 0,
      },
    ].filter((d) => d.value > 0);

    const dateMap = {};
    comments.forEach((c) => {
      const d = new Date(c.createdAt);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!dateMap[key]) {
        dateMap[key] = { key, date: label, deleted: 0, pending: 0 };
      }
      if (c.status === "deleted" || c.status === "hidden")
        dateMap[key].deleted++;
      else dateMap[key].pending++;
    });
    const barData = Object.values(dateMap)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-7);

    return { total, deleted, pending, pieData, barData };
  }, [reportData, userInfo]);

  const handleRefresh = async () => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang menyinkronkan channel dan video",
        color: "primary",
      });

      const res = await syncChannel();

      if (res.success === false) {
        addToast({
          title: "Sinkronisasi Gagal",
          description:
            res.message || "Terjadi kesalahan saat menyinkronkan data",
          color: "danger",
        });
      } else {
        addToast({
          title: "Berhasil",
          description: "Data channel berhasil diperbarui",
          color: "success",
        });
      }

      router.refresh();
    } catch (err) {
      addToast({
        title: "Terjadi Kesalahan",
        description: err.message || "Gagal menyinkronkan data channel",
        color: "danger",
      });
    }
  };

  const handleViewChannel = () => {
    const channelId = userInfo?.id;
    if (channelId) {
      window.open(`https://www.youtube.com/channel/${channelId}`, "_blank");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-40 rounded-lg" />
              <Skeleton className="h-4 w-60 rounded-lg mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2 w-full">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-4 w-full max-w-md rounded-lg" />
              <Skeleton className="h-3 w-44 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-6 w-52 rounded-lg mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 rounded-lg" />
                    <Skeleton className="h-7 w-12 rounded-lg" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <Skeleton className="h-4 w-32 rounded-lg mb-4" />
              <div className="flex justify-center">
                <Skeleton className="w-44 h-44 rounded-full" />
              </div>
              <div className="flex justify-center gap-5 mt-4">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-3 w-20 rounded-lg" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <Skeleton className="h-4 w-40 rounded-lg mb-4" />
              <div className="flex items-end gap-3 h-[200px] pt-4">
                {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                    <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-5 mt-4">
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaHome className="text-red-600" />
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Informasi channel YouTube kamu
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              as={Link}
              href="/dashboard/video"
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <FaPlay size={10} />
              Lihat Video
            </Button>
            <Button
              onPress={handleRefresh}
              className="bg-blue-600 text-white border font-semibold border-gray-200 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <IoMdRefresh size={18} />
              Sync Data
            </Button>
          </div>
        </div>
      </div>

      {/* Channel Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={userInfo.thumbnail}
              alt="Thumbnail Channel"
              className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover bg-white"
            />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate">
              {userInfo.title}
            </h2>
            {userInfo.customUrl && (
              <p className="text-sm text-gray-500">{userInfo.customUrl}</p>
            )}
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {userInfo.description || "Tidak ada deskripsi tersedia."}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 justify-center sm:justify-start">
              <FaCalendarAlt size={10} className="hidden md:block"/>
              Bergabung sejak {formatDate(userInfo.publishedAt)}
            </div>
          </div>
        </div>
        <div className="pt-5 md:pt-0">
          <Button onPress={handleViewChannel} className="bg-red-600 text-white font-semibold">
            <FaYoutube size={14} color="white"/>
            Lihat Channel
          </Button>
        </div>
      </div>

      {/* Channel Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Subscriber
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatNumber(userInfo.subscriberCount)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FaUsers className="text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Video
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatNumber(userInfo.videoCount || 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaPlay className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Total Views
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatNumber(userInfo.viewCount || 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FaEye className="text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <FaChartBar className="text-red-600" />
          Analitik Komentar Spam
        </h2>

        {/* Comment Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Total Terdeteksi
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {analytics.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Sudah Dihapus
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {analytics.deleted}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <FaTrashAlt className="text-red-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Menunggu Aksi
                </p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {analytics.pending}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <FaClock className="text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart - Status Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Status Komentar
            </h3>
            {analytics.total > 0 ? (
              <div className="flex flex-col items-center">
                <div className="w-full flex justify-center" style={{ height: 220 }}>
                  <PieChart width={250} height={220}>
                    <Pie
                      data={analytics.pieData}
                      cx={125}
                      cy={100}
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={true}
                    >
                      {analytics.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                  </PieChart>
                </div>
                <div className="flex gap-5 mt-2">
                  {analytics.pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs text-gray-600">
                        {entry.name}{" "}
                        <span className="font-semibold">({entry.value})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">Belum ada data</p>
              </div>
            )}
          </div>

          {/* Bar Chart - Comments by Date */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Komentar per Tanggal
            </h3>
            {analytics.barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={analytics.barData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltipBar />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar
                    dataKey="deleted"
                    name="Dihapus"
                    fill={CHART_COLORS.deleted}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill={CHART_COLORS.pending}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">Belum ada data</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Memuat Dashboard...</div>}>
    <DashboardContent />
  </Suspense>
);

export default Page;
