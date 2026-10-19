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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c1a11]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white border border-[#e8dcd0] shadow-[0_24px_60px_rgba(62,36,21,0.2)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 text-[#6d4d37] hover:text-[#361f12] shadow-md border border-[#e5d6c7] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Header (if photo) */}
        {item.type === 'photo' && item.url && (
          <div className="relative w-full h-72 sm:h-96 bg-[#2c1a11] flex items-center justify-center rounded-t-[31px] overflow-hidden">
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
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 clay-pill text-xs font-semibold text-[#6d3e1d]">
                {item.subject}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f5eee6] text-[#7d6353]">
                {item.category}
              </span>
              {item.is_showcase && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#faefe3] text-[#a8591a] border border-[#e8ceb7]">
                  <Star className="w-3.5 h-3.5 fill-[#d88337] text-[#d88337]" />
                  Showcase ผลงานเด่น
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#361f12] pt-1 leading-snug">
              {item.title}
            </h2>
          </div>

          {/* Description */}
          <div className="text-[#5c4231] leading-relaxed whitespace-pre-line text-sm sm:text-base bg-[#fbf7f2] p-5 rounded-2xl border border-[#efe3d6] shadow-xs">
            {item.description || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับชิ้นงานนี้'}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#7d6353]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#a8652c]" />
              <span>วิชา: <strong className="text-[#4a2e1b] font-semibold">{item.subject}</strong></span>
            </div>
            {item.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8c6f5d]" />
                <span>วันที่: {new Date(item.created_at).toLocaleDateString('th-TH')}</span>
              </div>
            )}
            {item.file_name && (
              <div className="flex items-center gap-2 col-span-full">
                <span className="text-[#8c6f5d]">ชื่อไฟล์:</span>
                <span className="text-[#361f12] font-mono font-medium">{item.file_name}</span>
                {item.file_size && <span className="text-[#964d17]">({item.file_size})</span>}
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-[#8c6f5d] flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5 text-[#b8651f]" /> แท็กที่เกี่ยวข้อง:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#f5eee6] text-[#6d4d37] border border-[#e5d6c7]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-[#f0e4d7] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 clay-pill text-xs sm:text-sm font-semibold text-[#54331d] cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            {item.type === 'link' ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 clay-btn-caramel text-xs sm:text-sm font-semibold"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 clay-btn-caramel text-xs sm:text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลดไฟล์
              </a>
            ) : (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 clay-btn text-xs sm:text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                เปิดภาพขนาดเต็ม
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
