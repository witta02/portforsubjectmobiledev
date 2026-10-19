'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Database, Layers } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface NavbarProps {
  isAdmin?: boolean;
  onOpenAddModal?: () => void;
  onLogout?: () => void;
  onOpenConfig?: () => void;
}

export default function Navbar({
  isAdmin = false,
  onOpenAddModal,
  onLogout,
  onOpenConfig,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Profile Header */}
        <Link href={isAdmin ? "/winnie" : "/"} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-500/50 group-hover:ring-cyan-400 transition-all shadow-md shadow-cyan-500/20">
            <Image
              src="/profile.jpg"
              alt="วิธวินท์ แก้วพัฒ"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors tracking-wide">
                วิธวินท์ แก้วพัฒ
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                1สทส1
              </span>
            </div>
            <p className="text-xs text-slate-400">Information Technology Portfolio</p>
          </div>
        </Link>

        {/* Center / Right Nav Items */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <button
            type="button"
            onClick={onOpenConfig}
            title={isSupabaseConfigured ? "เชื่อมต่อ Supabase Database สำเร็จ" : "โหมด Local Storage (คลิกเพื่อดูวิธีตั้งค่า Supabase)"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Data'}</span>
          </button>

          {isAdmin ? (
            /* Admin controls when inside /winnie */
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                ดูหน้าโชว์เคสจริง
              </Link>
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                + เพิ่มผลงานใหม่
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            /* Visitor View: Clean badges only */
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Showcase Mode
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
