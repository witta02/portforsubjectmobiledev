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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c1a11]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-[32px] bg-white border border-[#e8dcd0] shadow-[0_24px_60px_rgba(62,36,21,0.2)] p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#edf7ee] text-[#2d6634] border border-[#cfebd2]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#361f12]">การเชื่อมต่อ Supabase Database</h2>
              <p className="text-xs text-[#8c6f5d]">ฐานข้อมูลคลาวด์สำหรับบันทึกผลงานการเรียน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c6f5d] hover:text-[#361f12] hover:bg-[#f7eee3] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isSupabaseConfigured
              ? 'bg-[#edf7ee] border-[#cfebd2] text-[#203b24]'
              : 'bg-[#faefe3] border-[#e5cdb7] text-[#5c3010]'
          }`}
        >
          <div className="mt-0.5">
            {isSupabaseConfigured ? (
              <ShieldCheck className="w-5 h-5 text-[#2d6634]" />
            ) : (
              <Database className="w-5 h-5 text-[#b8651f]" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold">
              {isSupabaseConfigured
                ? 'เชื่อมต่อ Supabase สำเร็จแล้ว!'
                : 'กำลังทำงานในโหมด Local Storage'}
            </p>
            <p className="text-xs mt-1 text-[#6b5241] leading-relaxed">
              {isSupabaseConfigured
                ? 'ข้อมูลผลงาน ลิงก์ รูปภาพ และไฟล์ทั้งหมดจะถูกบันทึกลงใน Supabase Cloud แบบเรียลไทม์'
                : 'ระบบสามารถเพิ่ม ลบ แก้ไข ผลงานได้ตามปกติในเครื่องนี้ หากต้องการต่อ Supabase บน Vercel ให้ทำตาม 3 ขั้นตอนด้านล่าง'}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs sm:text-sm text-[#54331d]">
          <p className="font-bold text-[#361f12]">ขั้นตอนเชื่อมต่อ Supabase สำหรับ Vercel:</p>
          
          <div className="p-3.5 rounded-2xl bg-[#faf5ef] border border-[#ebdccf] space-y-1">
            <span className="font-bold text-[#964d17]">1. เข้า Supabase แล้วสร้างโปรเจกต์ใหม่:</span>
            <p className="text-xs text-[#7d6353]">
              ไปที่ <a href="https://supabase.com" target="_blank" className="text-[#b8651f] underline font-semibold inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> สมัครหรือล็อกอิน แล้วกด New Project
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf5ef] border border-[#ebdccf] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#964d17]">2. รัน SQL Schema ใน SQL Editor:</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-3 py-1 clay-pill text-xs font-bold text-[#54331d] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'คัดลอก SQL แล้ว!' : 'คัดลอกคำสั่ง SQL'}
              </button>
            </div>
            <p className="text-xs text-[#7d6353]">
              นำไฟล์ <code className="text-[#8c4b14] bg-white px-1.5 py-0.5 rounded-md border border-[#ebdccf] font-mono">supabase_schema.sql</code> ไปวางและกด Run ได้ทันที
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf5ef] border border-[#ebdccf] space-y-1">
            <span className="font-bold text-[#964d17]">3. เพิ่ม Environment Variables ใน Vercel:</span>
            <div className="text-xs text-[#6b5241] space-y-0.5 font-mono">
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
            className="px-6 py-2.5 clay-btn-caramel text-xs sm:text-sm font-bold cursor-pointer"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
