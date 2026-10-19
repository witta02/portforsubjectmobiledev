'use client';

import React from 'react';
import Image from 'next/image';
import { X, ExternalLink, Download, Calendar, Tag, BookOpen, Star } from 'lucide-react';
import { Classwork } from '@/types/classwork';

interface ClassworkModalProps {
  item: Classwork | null;
  onClose: () => void;
}

export default function ClassworkModal({ item, onClose }: ClassworkModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 text-slate-400 hover:text-white border border-slate-700/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Header (if photo) */}
        {item.type === 'photo' && item.url && (
          <div className="relative w-full h-72 sm:h-96 bg-black flex items-center justify-center">
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
          </div>
        )}

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {item.subject}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                {item.category}
              </span>
              {item.is_showcase && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  Showcase ผลงานเด่น
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">
              {item.title}
            </h2>
          </div>

          {/* Description */}
          <div className="text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            {item.description || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับชิ้นงานนี้'}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>วิชา: {item.subject}</span>
            </div>
            {item.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>เพิ่มเมื่อ: {new Date(item.created_at).toLocaleDateString('th-TH')}</span>
              </div>
            )}
            {item.file_name && (
              <div className="flex items-center gap-2 col-span-full">
                <span className="text-slate-500">ชื่อไฟล์:</span>
                <span className="text-slate-200 font-mono">{item.file_name}</span>
                {item.file_size && <span className="text-cyan-400">({item.file_size})</span>}
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> แท็กที่เกี่ยวข้อง:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Link / Download button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              ปิดหน้าต่าง
            </button>
            {item.type === 'link' ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25 transition"
              >
                <ExternalLink className="w-4 h-4" />
                เปิดลิงก์ผลงานต้นฉบับ
              </a>
            ) : item.type === 'file' ? (
              <a
                href={item.url}
                download={item.file_name || 'classwork-file'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition"
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลดไฟล์
              </a>
            ) : (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition"
              >
                <ExternalLink className="w-4 h-4" />
                เปิดดูภาพในแท็บใหม่
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
