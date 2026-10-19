'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, FolderGit2, Image as ImageIcon, FileText, Smartphone, GraduationCap } from 'lucide-react';
import { Classwork } from '@/types/classwork';

interface HeroSectionProps {
  classworks: Classwork[];
  isAdmin?: boolean;
}

export default function HeroSection({ classworks }: HeroSectionProps) {
  const showcaseCount = classworks.filter(c => c.is_showcase).length;
  const linkCount = classworks.filter(c => c.type === 'link').length;
  const photoCount = classworks.filter(c => c.type === 'photo').length;
  const fileCount = classworks.filter(c => c.type === 'file').length;

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14">
      {/* Soft warm ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-[#f3e5d7]/60 via-[#ebd7c2]/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="clay-card p-7 sm:p-10 flex flex-col md:flex-row items-center gap-7 md:gap-10">
          {/* Profile Picture in 3D Clay Frame */}
          <div className="relative group shrink-0">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden p-1.5 bg-[#f6eee4] shadow-[8px_12px_24px_rgba(62,36,21,0.12),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(62,36,21,0.06)] border border-[#dec7b2]">
              <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                <Image
                  src="/profile.jpg"
                  alt="วิธวินท์ แก้วพัฒ"
                  fill
                  priority
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 144px, 176px"
                />
              </div>
            </div>

            {/* 1สทส1 Caramel Clay Badge
            <div className="absolute -bottom-2.5 -right-2.5 px-3 py-1 clay-btn-caramel text-xs font-bold shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              1สทส1
            </div>
            */}
          </div>

          {/* Student Info & Bio */}
          <div className="flex-1 text-center md:text-left space-y-3.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 clay-pill text-xs font-semibold text-[#6d3e1d]">
                <Smartphone className="w-3.5 h-3.5 text-[#b8651f]" />
                <span>วิชา: Mobile Application Developer</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 clay-pill text-xs font-medium text-[#7d6353]">
                <GraduationCap className="w-3.5 h-3.5 text-[#8c6f5d]" />
                <span>แผนกวิชาเทคโนโลยีสารสนเทศ</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#361f12]">
                วิธวินท์ แก้วพัฒ
              </h1>
              <p className="text-[#6d513f] mt-2 text-sm sm:text-base leading-relaxed max-w-2xl">
                แฟ้มสะสมผลงานการเรียนรายวิชา <span className="font-bold text-[#964d17]">การพัฒนาซอฟต์แวร์สำหรับอุปกรณ์เคลื่อนที่ 31901-2009</span> ประจำห้อง <span className="font-bold text-[#361f12]">1สทส1</span>
              </p>
            </div>

            {/* Clay Stats Chips */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#faefe3] border border-[#e5cdb7] text-[#874614] text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 fill-[#d88337] text-[#d88337]" />
                <span>โชว์เคสเด่น: {showcaseCount} ชิ้น</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 clay-pill text-[#54331d] text-xs sm:text-sm font-medium">
                <FolderGit2 className="w-4 h-4 text-[#8c5228]" />
                <span>โปรเจกต์/ลิงก์: {linkCount}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 clay-pill text-[#54331d] text-xs sm:text-sm font-medium">
                <ImageIcon className="w-4 h-4 text-[#a35e2e]" />
                <span>รูปภาพ/กราฟิก: {photoCount}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 clay-pill text-[#54331d] text-xs sm:text-sm font-medium">
                <FileText className="w-4 h-4 text-[#5c7a4d]" />
                <span>ไฟล์/เอกสาร: {fileCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
