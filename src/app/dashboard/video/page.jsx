"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaComment, FaYoutube } from "react-icons/fa";
import { formatToWIB } from "@/utilities/dateFormat";
import VideoSkeleton from "@/components/VideoSkeleton";
import { useVideoPresenter } from "./videoPresenter";

function VideoList() {
  const router = useRouter();
  const { videos, loading } = useVideoPresenter();

  const handleClick = (videoId) => {
    router.push(`/dashboard/video/comments?videoId=${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaYoutube className="text-red-600" />
              Video
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Daftar video dari channel YouTube kamu
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <VideoSkeleton />
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video.videoId}
              onClick={() => handleClick(video.videoId)}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <FaPlay className="text-white text-xs ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2">
                  {video.title}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaComment size={10} />
                    <span>{video.commentCount} komentar</span>
                  </div>
                  <span>{formatToWIB(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaYoutube className="text-gray-300 text-2xl" />
          </div>
          <p className="text-gray-500 text-base">
            Tidak ada video ditemukan.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading video list...</div>}>
      <VideoList />
    </Suspense>
  );
}
