'use client';

import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupabaseConfigModal({ isOpen, onClose }: SupabaseConfigModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    const sql = `-- Run this in Supabase SQL Editor:
create table if not exists public.classworks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  subject text not null,
  category text default 'Assignment',
  type text not null check (type in ('link', 'photo', 'file')),
  url text not null,
  file_name text,
  file_size text,
  is_showcase boolean default false,
  tags text[] default array[]::text[],
  term text default '1/2567'
);

alter table public.classworks enable row level security;
create policy "Allow public read" on public.classworks for select using (true);
create policy "Allow insert all" on public.classworks for insert with check (true);
create policy "Allow update all" on public.classworks for update using (true);
create policy "Allow delete all" on public.classworks for delete using (true);

insert into storage.buckets (id, name, public) values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;
create policy "Public Storage" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Insert Storage" on storage.objects for insert with check (bucket_id = 'portfolio-assets');`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">การเชื่อมต่อ Supabase Database</h2>
              <p className="text-xs text-slate-400">ฐานข้อมูลคลาวด์สำหรับบันทึกผลงานการเรียน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isSupabaseConfigured
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          }`}
        >
          <div className="mt-0.5">
            {isSupabaseConfigured ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <Database className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {isSupabaseConfigured
                ? 'เชื่อมต่อ Supabase สำเร็จแล้ว!'
                : 'กำลังทำงานในโหมด Local Storage'}
            </p>
            <p className="text-xs mt-1 text-slate-300 leading-relaxed">
              {isSupabaseConfigured
                ? 'ข้อมูลผลงาน ลิงก์ รูปภาพ และไฟล์ทั้งหมดจะถูกบันทึกลงใน Supabase Cloud ของคุณแบบเรียลไทม์'
                : 'ระบบสามารถเพิ่ม ลบ แก้ไข ผลงานได้ตามปกติในเครื่องนี้ หากต้องการเชื่อมต่อ Supabase บน Vercel ให้ทำตาม 3 ขั้นตอนด้านล่าง'}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="font-semibold text-white">ขั้นตอนเชื่อมต่อ Supabase สำหรับ Vercel:</p>
          
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-400">1. เข้า Supabase แล้วสร้างโปรเจกต์ใหม่:</span>
            <p className="text-xs text-slate-400">
              ไปที่ <a href="https://supabase.com" target="_blank" className="text-cyan-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> สมัครหรือล็อกอิน แล้วกด New Project
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-400">2. รัน SQL Schema ใน SQL Editor:</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'คัดลอก SQL แล้ว!' : 'คัดลอกคำสั่ง SQL'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              นำไฟล์ <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">supabase_schema.sql</code> ไปวางและกด Run ได้ทันที
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-400">3. เพิ่ม Environment Variables ใน Vercel:</span>
            <div className="text-xs text-slate-400 space-y-0.5 font-mono">
              <p>NEXT_PUBLIC_SUPABASE_URL = [URL ของคุณ]</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY = [Anon Key ของคุณ]</p>
              <p>NEXT_PUBLIC_ADMIN_PIN = 1234 (หรือรหัส PIN ที่คุณต้องการ)</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
