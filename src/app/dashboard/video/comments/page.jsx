"use client";

import { useSearchParams } from "next/navigation";
import { AiFillLike } from "react-icons/ai";
import {
  FaComment,
  FaTrashAlt,
  FaEye,
  FaYoutube,
  FaSearch,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { Button, Image, addToast } from "@heroui/react";
import { formatToWIB } from "@/utilities/dateFormat";
import { Suspense } from "react";
import { useCommentPresenter } from "./commentPresenter";

function CommentPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const {
    video,
    comments,
    loading,
    refreshComments,
    deleteComment,
    deleteAllComments,
  } = useCommentPresenter(videoId);

  const handleRefresh = async () => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang mendeteksi komentar",
        color: "primary",
      });
      await refreshComments();
      addToast({
        title: "Berhasil",
        description: "Komentar berhasil diperbarui",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal refresh komentar",
        color: "danger",
      });
    }
  };

  const handleDeleteCommentById = async (commentId) => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang menghapus komentar",
        color: "primary",
      });
      await deleteComment(commentId);
      addToast({
        title: "Berhasil",
        description: "Komentar berhasil dihapus",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal hapus komentar",
        color: "danger",
      });
    }
  };

  const handleWatchVideo = () => {
    if (videoId) {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(url, "_blank");
    }
  };

  const handleHajarAction = async () => {
    try {
      addToast({
        title: "Memuat...",
        description: "Sedang menghapus semua komentar judi online",
        color: "primary",
      });
      await deleteAllComments();
      addToast({
        title: "Berhasil",
        description: "Semua komentar berhasil dihapus",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal menghapus semua komentar",
        color: "danger",
      });
    }
  };

  if (loading || !video) {
    return (
      <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-500 text-lg">Memuat data...</p>
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
              <FaComment className="text-red-600" />
              Komentar Judi Online
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Deteksi dan hapus komentar spam pada video
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={handleRefresh}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <FaSearch size={14} />
              Deteksi
            </Button>
            <Button
              onPress={handleHajarAction}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <FaTrashAlt size={12} />
              Hapus Semua
            </Button>
          </div>
        </div>
      </div>

      {/* Video Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <Image
              src={video.thumbnail}
              alt={video.title}
              className="w-full sm:w-56 h-auto object-cover aspect-video rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
              {video.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1.5">
                <AiFillLike size={14} />
                <span>{video.likeCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaComment size={12} />
                <span>{video.commentCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaEye size={14} />
                <span>{video.viewCount?.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              {formatToWIB(video.publishedAt)}
            </p>
            <Button
              onPress={handleWatchVideo}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm"
            >
              <FaYoutube size={14} />
              Tonton di YouTube
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Komentar Terdeteksi
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {comments.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FaComment className="text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Video ID
              </p>
              <p className="text-sm font-mono font-bold text-gray-800 mt-1 truncate">
                {videoId}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaYoutube className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {comment.authorProfileImageURL && (
                  <img
                    src={comment.authorProfileImageURL}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full flex-shrink-0 border border-gray-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {comment.author}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed break-words">
                    {comment.text}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCommentById(comment.commentId)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 group"
                  title="Hapus komentar"
                >
                  <FaTrashAlt className="text-gray-400 group-hover:text-red-500 transition-colors w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaComment className="text-gray-300 text-2xl" />
          </div>
          <p className="text-gray-500 text-base">
            Tidak ada komentar ditemukan.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Klik "Deteksi" untuk mencari komentar spam.
          </p>
        </div>
      )}
    </div>
  );
}

export default function WrappedPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading comments...</div>}>
      <CommentPage />
    </Suspense>
  );
}
