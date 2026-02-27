"use client";

import { IoMdRefresh } from "react-icons/io";
import { FaHistory, FaTrashAlt, FaClock, FaYoutube } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { Button, Chip, Skeleton, addToast } from "@heroui/react";
import { formatToWIB } from "@/utilities/dateFormat";
import { useHistoryPresenter } from "./historyPresenter";
import { useState } from "react";

const StatusBadge = ({ status }) => {
  const config = {
    deleted: {
      color: "danger",
      icon: <FaTrashAlt size={10} />,
      label: "Dihapus",
    },
    pending: {
      color: "warning",
      icon: <FaClock size={10} />,
      label: "Pending",
    },
    hidden: {
      color: "danger",
      icon: <FaTrashAlt size={10} />,
      label: "Dihapus",
    },
    success: {
      color: "success",
      icon: <MdCheckCircle size={12} />,
      label: "Berhasil",
    },
  };

  const cfg = config[status] || {
    color: "warning",
    icon: <FaClock size={10} />,
    label: "Pending",
  };

  return (
    <Chip
      size="sm"
      color={cfg.color}
      variant="flat"
      startContent={cfg.icon}
      className="capitalize"
    >
      {cfg.label}
    </Chip>
  );
};

const filterOptions = [
  { key: "all", label: "Semua" },
  { key: "deleted", label: "Dihapus" },
  { key: "pending", label: "Pending" },
];

export default function HistoryPage() {
  const { comments, total, loading, error, refresh } = useHistoryPresenter();
  const [activeFilter, setActiveFilter] = useState("all");

  const isDeleted = (s) => s === "deleted" || s === "hidden";

  const filteredComments =
    activeFilter === "all"
      ? comments
      : activeFilter === "deleted"
        ? comments.filter((c) => isDeleted(c.status))
        : comments.filter((c) => !isDeleted(c.status));

  const stats = {
    total: comments.length,
    deleted: comments.filter((c) => isDeleted(c.status)).length,
    pending: comments.filter((c) => !isDeleted(c.status)).length,
  };

  const handleRefresh = async () => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang memuat laporan terbaru",
        color: "primary",
      });
      await refresh();
      addToast({
        title: "Berhasil",
        description: "Laporan berhasil diperbarui",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal memuat laporan",
        color: "danger",
      });
    }
  };

  const handleOpenVideo = (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-lg mt-2" />
            </div>
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>

        {/* Stats Skeleton */}
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

        {/* Filter Tabs Skeleton */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>

        {/* Comment List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-36 rounded-lg" />
                  <Skeleton className="h-3 w-36 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FaHistory className="text-red-500 text-2xl" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            Gagal Memuat Data
          </p>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button
            onPress={handleRefresh}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Coba Lagi
          </Button>
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
              <FaHistory className="text-red-600" />
              Riwayat Komentar
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Laporan aktivitas penghapusan komentar spam
            </p>
          </div>
          <Button
            onPress={handleRefresh}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <IoMdRefresh size={18} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Total Komentar
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaHistory className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Dihapus
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.deleted}
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
                Pending
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <FaClock className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filterOptions.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === filter.key
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter.label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === filter.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {filter.key === "all"
                ? stats.total
                : filter.key === "deleted"
                ? stats.deleted
                : stats.pending}
            </span>
          </button>
        ))}
      </div>

      {/* Comments List */}
      {filteredComments.length > 0 ? (
        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusBadge status={comment.status} />
                    <button
                      onClick={() => handleOpenVideo(comment.videoId)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline transition-colors"
                    >
                      <FaYoutube size={12} />
                      {comment.videoId}
                    </button>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed break-words mb-3">
                    {comment.text}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span>
                      Dibuat: {formatToWIB(comment.createdAt)}
                    </span>
                    {comment.deletedAt && (
                      <span>
                        Dihapus: {formatToWIB(comment.deletedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaHistory className="text-gray-300 text-2xl" />
          </div>
          <p className="text-gray-500 text-base">
            Tidak ada riwayat komentar
            {activeFilter !== "all" && " untuk filter ini"}.
          </p>
        </div>
      )}
    </div>
  );
}
