import React from "react";
import { Skeleton } from "@heroui/react";

const VideoSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <Skeleton className="w-full aspect-video" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;
