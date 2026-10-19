'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, FolderGit2, Image as ImageIcon, FileText, CheckCircle2, GraduationCap } from 'lucide-react';
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
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16 border-b border-slate-800/60">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-tr from-cyan-500/10 via-blue-500/15 to-purple-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Profile Picture with animated border aura */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden ring-4 ring-slate-900 bg-slate-900 shadow-2xl">
              <Image
                src="/profile.jpg"
                alt="วิธวินท์ แก้วพัฒ"
                fill
                priority
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 144px, 176px"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-3 py-1 rounded-full text-xs shadow-lg flex items-center gap-1 border-2 border-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
              1สทส1
            </div>
          </div>

          {/* Student Info & Bio */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs text-cyan-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>วิชา: Mobile Application Developer</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>แผนกวิชาเทคโนโลยีสารสนเทศ</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                วิธวินท์ แก้วพัฒ
              </h1>
              <p className="text-slate-400 mt-2 text-base sm:text-lg max-w-2xl">
                แฟ้มสะสมผลงานการเรียน (Student Portfolio) รายวิชา <span className="text-cyan-400 font-semibold">Mobile Application Developer</span> รวบรวมแอปพลิเคชัน โครงงาน สรุปแล็บ และแบบฝึกหัด ประจำห้อง <span className="text-amber-400 font-semibold">1สทส1</span>
              </p>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>โชว์เคสเด่น: {showcaseCount} ชิ้น</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                <span>ลิงก์/โปรเจกต์: {linkCount}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>รูปภาพ/กราฟิก: {photoCount}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>ไฟล์/เอกสาร: {fileCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
