'use client';

import React from 'react';

export default function ClassworkSkeleton() {
  return (
    <div className="clay-card overflow-hidden flex flex-col justify-between animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full h-44 bg-[#f0e4d7]/70" />

      {/* Content Skeleton */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header Row: Subject & Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-5 w-24 rounded-xl bg-[#ebdccf]" />
            <div className="h-5 w-16 rounded-full bg-[#faefe3]" />
          </div>

          {/* Title Lines */}
          <div className="space-y-2 pt-1">
            <div className="h-5 w-4/5 rounded-lg bg-[#e5d5c5]" />
            <div className="h-4 w-2/3 rounded-lg bg-[#ebdccf]" />
          </div>

          {/* Description Lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full rounded-md bg-[#f2e7db]" />
            <div className="h-3.5 w-5/6 rounded-md bg-[#f2e7db]" />
            <div className="h-3.5 w-3/4 rounded-md bg-[#f2e7db]" />
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 pt-2">
            <div className="h-5 w-14 rounded-lg bg-[#f5eee6]" />
            <div className="h-5 w-16 rounded-lg bg-[#f5eee6]" />
            <div className="h-5 w-12 rounded-lg bg-[#f5eee6]" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#f0e4d7] flex items-center justify-between">
          <div className="h-8 w-28 rounded-full bg-[#ebdccf]" />
          <div className="h-8 w-8 rounded-2xl bg-[#f2e7db]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ClassworkSkeleton key={i} />
      ))}
    </div>
  );
}
