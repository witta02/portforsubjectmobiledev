'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Star, FileText, Image as ImageIcon, Link as LinkIcon, Trash2, Edit3, Download, Eye } from 'lucide-react';
import { Classwork } from '@/types/classwork';

interface ClassworkCardProps {
  item: Classwork;
  isAdmin?: boolean;
  onPreview: (item: Classwork) => void;
  onToggleShowcase?: (id: string, current: boolean) => void;
  onEdit?: (item: Classwork) => void;
  onDelete?: (id: string) => void;
}

export default function ClassworkCard({
  item,
  isAdmin = false,
  onPreview,
  onToggleShowcase,
  onEdit,
  onDelete,
}: ClassworkCardProps) {
  const getTypeBadge = () => {
    switch (item.type) {
      case 'link':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-950/80 text-blue-300 border border-blue-800/60">
            <LinkIcon className="w-3 h-3" />
            ลิงก์ผลงาน
          </span>
        );
      case 'photo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-950/80 text-purple-300 border border-purple-800/60">
            <ImageIcon className="w-3 h-3" />
            รูปภาพ/กราฟิก
          </span>
        );
      case 'file':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <FileText className="w-3 h-3" />
            ไฟล์เอกสาร
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-slate-900/70 border ${
        item.is_showcase
          ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-400/70'
          : 'border-slate-800 hover:border-slate-700'
      } overflow-hidden transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Top Banner / Image Thumbnail */}
      {item.type === 'photo' && item.url ? (
        <div
          onClick={() => onPreview(item)}
          className="relative w-full h-48 bg-slate-950 cursor-pointer overflow-hidden"
        >
          <Image
            src={item.url}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium border border-slate-700">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> คลิกดูรูปภาพขนาดใหญ่
            </span>
          </div>
        </div>
      ) : item.type === 'file' ? (
        <div
          onClick={() => onPreview(item)}
          className="relative w-full h-28 bg-gradient-to-br from-emerald-950/40 to-slate-900 flex items-center justify-center border-b border-slate-800/80 cursor-pointer group-hover:bg-emerald-950/60 transition"
        >
          <div className="flex items-center gap-3 px-4">
            <div className="p-3 rounded-xl bg-emerald-900/50 border border-emerald-700/60 text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">ไฟล์เอกสารแนบ</p>
              <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                {item.file_name || 'เอกสารประกอบการเรียน'}
              </p>
              {item.file_size && (
                <span className="text-[11px] text-emerald-400 font-mono">{item.file_size}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-24 bg-gradient-to-br from-blue-950/30 to-slate-900 flex items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-900/40 border border-blue-700/50 text-blue-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-blue-300">ลิงก์ภายนอก / แหล่งอ้างอิง</span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header Row: Subject & Badges */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {getTypeBadge()}
              <span className="text-xs font-medium text-slate-400 truncate max-w-[150px]">
                {item.subject}
              </span>
            </div>

            {/* Showcase Star Indicator */}
            {item.is_showcase && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Showcase
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Main Action Button */}
          {item.type === 'link' ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              เปิดดูผลงาน
            </a>
          ) : item.type === 'file' ? (
            <a
              href={item.url}
              download={item.file_name || 'classwork-file'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลดไฟล์
            </a>
          ) : (
            <button
              onClick={() => onPreview(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              ดูรูปภาพ
            </button>
          )}

          {/* Admin Management Controls */}
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              {/* Toggle Showcase Button */}
              <button
                type="button"
                onClick={() => onToggleShowcase && onToggleShowcase(item.id, item.is_showcase)}
                title={item.is_showcase ? "นำออกจาก Showcase" : "เลือกแสดงใน Showcase"}
                className={`p-1.5 rounded-lg border transition ${
                  item.is_showcase
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 hover:bg-amber-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-400 hover:border-amber-500/50'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${item.is_showcase ? 'fill-amber-400 text-amber-400' : ''}`}
                />
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => onEdit && onEdit(item)}
                title="แก้ไขผลงานนี้"
                className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:text-cyan-400 hover:border-cyan-500/50 transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`คุณต้องการลบ "${item.title}" ใช่หรือไม่?`)) {
                    onDelete && onDelete(item.id);
                  }
                }}
                title="ลบผลงานนี้"
                className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/50 hover:bg-rose-900/60 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
