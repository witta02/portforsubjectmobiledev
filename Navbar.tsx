'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Database, Layers, LogOut, Plus } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-[#fcf8f4]/90 backdrop-blur-md border-b border-[#e8dcd0]/70 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Profile with Claymorphism */}
        <Link href={isAdmin ? "/winnie" : "/"} className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-[4px_6px_14px_rgba(62,36,21,0.12),inset_2px_2px_4px_rgba(255,255,255,0.8)] border-2 border-[#e6d5c3] group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/profile.jpg"
              alt="วิธวินท์ แก้วพัฒ"
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#3e2415] group-hover:text-[#8c5228] transition-colors tracking-tight text-base sm:text-lg">
                วิธวินท์ แก้วพัฒ
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3e5d7] text-[#6d3e1d] border border-[#dfc8b4] shadow-xs">
                1สทส1
              </span>
            </div>
            <p className="text-xs text-[#8c6f5d] font-medium">Mobile Application Developer</p>
          </div>
        </Link>

        {/* Right Nav Items */}
        <div className="flex items-center gap-2.5">
          {/* Supabase Status Clay Pill */}
          {/* <button
            type="button"
            onClick={onOpenConfig}
            title={isSupabaseConfigured ? "เชื่อมต่อ Supabase Database สำเร็จ" : "โหมด Local Storage (คลิกเพื่อดูวิธีตั้งค่า Supabase)"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 clay-pill text-xs font-medium cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <Database className="w-3.5 h-3.5 text-[#8c6f5d]" />
            <span className="text-[#54331d]">{isSupabaseConfigured ? 'Supabase Live' : 'Local Data'}</span>
          </button> */}

          {isAdmin ? (
            /* Admin controls inside /winnie */
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 clay-pill text-xs font-semibold text-[#54331d]"
              >
                <Layers className="w-3.5 h-3.5 text-[#a8652c]" />
                ดูหน้าโชว์เคส
              </Link>
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 clay-btn-caramel text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                เพิ่มผลงาน
              </button>
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="p-2 rounded-2xl bg-[#faeceb] text-[#b33a3a] border border-[#f0c5c5] hover:bg-[#f7d8d8] shadow-xs transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Visitor View: Minimal & Clean Clay Badge */
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 clay-pill text-xs font-semibold text-[#6d3e1d]">
                <Sparkles className="w-3.5 h-3.5 fill-[#d88337] text-[#d88337]" />
                Showcase Mode
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
