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
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const getTypeBadge = () => {
    switch (item.type) {
      case 'link':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#edf2f7] text-[#2b4c7e] border border-[#d2deeb]">
            <LinkIcon className="w-3 h-3" />
            ลิงก์ผลงาน
          </span>
        );
      case 'photo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#faedf7] text-[#7d326f] border border-[#ebd0e4]">
            <ImageIcon className="w-3 h-3" />
            รูปภาพ/UI
          </span>
        );
      case 'file':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#edf7ee] text-[#2d6634] border border-[#cfebd2]">
            <FileText className="w-3 h-3" />
            ไฟล์เอกสาร
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative flex flex-col clay-card overflow-hidden transition-all duration-300 ${
        item.is_showcase
          ? 'ring-2 ring-[#d88337]/50 border-[#d88337]/40'
          : 'border-[#e8dcd0]/80'
      }`}
    >
      {/* Top Banner / Image Thumbnail with Lazy Loading & Skeleton Shimmer */}
      {item.type === 'photo' && item.url ? (
        <div
          onClick={() => onPreview(item)}
          className="relative w-full h-48 bg-[#f5ebe0] cursor-pointer overflow-hidden rounded-t-[27px]"
        >
          {/* Skeleton Shimmer while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#ebdccf]/70 animate-pulse" />
          )}
          <Image
            src={item.url}
            alt={item.title}
            fill
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2c1a11]/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#3e2415]/20 backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#4a2e1b] text-xs font-semibold shadow-md">
              <Eye className="w-3.5 h-3.5 text-[#b8651f]" /> คลิกดูรูปภาพขนาดใหญ่
            </span>
          </div>
        </div>
      ) : item.type === 'file' ? (
        <div
          onClick={() => onPreview(item)}
          className="relative w-full h-28 bg-[#f5f8f5] flex items-center justify-center border-b border-[#e5ede5] cursor-pointer group-hover:bg-[#eaf3ea] transition rounded-t-[27px]"
        >
          <div className="flex items-center gap-3 px-5">
            <div className="p-3 rounded-2xl bg-white shadow-[3px_4px_10px_rgba(45,102,52,0.1),inset_2px_2px_4px_rgba(255,255,255,0.9)] border border-[#d5e7d7] text-[#2d6634]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-[#6b856e] font-semibold uppercase tracking-wider">เอกสารแนบ</p>
              <p className="text-sm font-bold text-[#203b24] line-clamp-1">
                {item.file_name || 'เอกสารประกอบการเรียน'}
              </p>
              {item.file_size && (
                <span className="text-[11px] text-[#3d7a46] font-mono font-medium">{item.file_size}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-24 bg-[#f4f7fb] flex items-center justify-between px-6 border-b border-[#e1eaf3] rounded-t-[27px]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white shadow-[3px_4px_10px_rgba(43,76,126,0.1),inset_2px_2px_4px_rgba(255,255,255,0.9)] border border-[#d2deeb] text-[#2b4c7e]">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1f385c]">ลิงก์ผลงาน / โค้ดโปรเจกต์</p>
              <p className="text-[11px] text-[#5e779a]">คลิกเปิดดูผลงานภายนอก</p>
            </div>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header Row: Subject & Badges */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {getTypeBadge()}
              <span className="text-xs font-medium text-[#7d6353] truncate max-w-[150px]">
                {item.subject}
              </span>
            </div>

            {/* Showcase Star Indicator */}
            {item.is_showcase && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#faefe3] text-[#a8591a] border border-[#e8ceb7]">
                <Star className="w-3 h-3 fill-[#d88337] text-[#d88337]" />
                Showcase
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#361f12] group-hover:text-[#964d17] transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-[#6b5241] line-clamp-3 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-[#f5eee6] text-[#6d4d37] border border-[#e5d6c7]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-[#f0e4d7] flex items-center justify-between gap-2">
          {/* Action Button */}
          {item.type === 'link' ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 clay-pill text-xs font-semibold text-[#1f385c] hover:text-[#0f2442]"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 clay-pill text-xs font-semibold text-[#203b24] hover:text-[#112414]"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลดไฟล์
            </a>
          ) : (
            <button
              onClick={() => onPreview(item)}
              className="inline-flex items-center gap-1.5 px-4 py-2 clay-pill text-xs font-semibold text-[#54331d] hover:text-[#361f12]"
            >
              <Eye className="w-3.5 h-3.5 text-[#b8651f]" />
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
                className={`p-2 rounded-2xl transition cursor-pointer ${
                  item.is_showcase
                    ? 'bg-[#faefe3] text-[#b8651f] border border-[#e5cdb7] shadow-xs'
                    : 'bg-[#f7eee3] text-[#9c8474] border border-[#e8dcd0] hover:text-[#b8651f]'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${item.is_showcase ? 'fill-[#d88337] text-[#d88337]' : ''}`}
                />
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => onEdit && onEdit(item)}
                title="แก้ไขผลงานนี้"
                className="p-2 rounded-2xl bg-[#f7eee3] text-[#6d4d37] border border-[#e8dcd0] hover:text-[#361f12] shadow-xs transition cursor-pointer"
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
                className="p-2 rounded-2xl bg-[#faeceb] text-[#b33a3a] border border-[#f0c5c5] hover:bg-[#f7d8d8] shadow-xs transition cursor-pointer"
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
