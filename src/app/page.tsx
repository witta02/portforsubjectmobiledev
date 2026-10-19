'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ClassworkCard from '@/components/ClassworkCard';
import ClassworkModal from '@/components/ClassworkModal';
import SupabaseConfigModal from '@/components/SupabaseConfigModal';
import { fetchClassworks } from '@/lib/storage';
import { Classwork, FilterCategory } from '@/types/classwork';
import { Sparkles, Search, Layers, Link as LinkIcon, Image as ImageIcon, FileText, Compass, Award } from 'lucide-react';

export default function HomePage() {
  const [classworks, setClassworks] = useState<Classwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Classwork | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterCategory>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchClassworks();
        setClassworks(data);
      } catch (err) {
        console.error('Failed to load classworks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // For public visitors: SHOWCASE ONLY!
  const showcaseOnlyList = useMemo(() => {
    return classworks.filter((item) => item.is_showcase);
  }, [classworks]);

  // Extract unique subjects
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    showcaseOnlyList.forEach((item) => subs.add(item.subject));
    return Array.from(subs);
  }, [showcaseOnlyList]);

  // Filter based on active filters & search query
  const filteredList = useMemo(() => {
    return showcaseOnlyList.filter((item) => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }
      // Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchSub = item.subject.toLowerCase().includes(query);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchSub && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [showcaseOnlyList, filterType, selectedSubject, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f4] text-[#2c1a11]">
      {/* Visitor Navbar */}
      <Navbar
        isAdmin={false}
        onOpenConfig={() => setConfigOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection classworks={classworks} isAdmin={false} />

      {/* Main Showcase Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#ebdccf] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faefe3] text-[#a8591a] border border-[#e8ceb7] mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#d88337] text-[#d88337]" />
              คลังผลงาน
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#361f12] tracking-tight">
              ผลงานและชิ้นงานโชว์เคส
            </h2>
            <p className="text-sm text-[#7d6353] mt-1 font-medium">
              ผลงานการเรียนยอดเยี่ยมที่คัดสรรแล้วของ วิธวินท์ แก้วพัฒ (1สทส1)
            </p>
          </div>

          {/* Quick Counter Clay Pill */}
          <div className="text-xs font-medium text-[#6d4d37] bg-white px-4 py-2 rounded-2xl border border-[#e8dcd0] shadow-xs self-start md:self-auto">
            แสดง <span className="text-[#964d17] font-bold">{filteredList.length}</span> จากทั้งหมด{' '}
            <span className="text-[#d88337] font-bold">{showcaseOnlyList.length}</span> ชิ้นงานโชว์เคส
          </div>
        </div>

        {/* Filters & Search Toolbar with Claymorphism */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3.5 rounded-[24px] bg-white border border-[#ebdccf] shadow-[6px_10px_20px_rgba(62,36,21,0.05)]">
          {/* Type Filter Clay Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterType('all')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${filterType === 'all'
                ? 'clay-pill-active'
                : 'clay-pill text-[#6d4d37]'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              ทั้งหมด ({showcaseOnlyList.length})
            </button>
            <button
              onClick={() => setFilterType('link')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${filterType === 'link'
                ? 'clay-pill-active'
                : 'clay-pill text-[#6d4d37]'
                }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              ลิงก์ผลงาน
            </button>
            <button
              onClick={() => setFilterType('photo')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${filterType === 'photo'
                ? 'clay-pill-active'
                : 'clay-pill text-[#6d4d37]'
                }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              รูปภาพ/UI
            </button>
            <button
              onClick={() => setFilterType('file')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${filterType === 'file'
                ? 'clay-pill-active'
                : 'clay-pill text-[#6d4d37]'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              ไฟล์เอกสาร
            </button>
          </div>

          {/* Search Box & Subject Filter */}
          <div className="flex items-center gap-2.5">
            {availableSubjects.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3.5 py-2 clay-input text-xs font-medium text-[#4a2e1b] max-w-[160px] truncate"
              >
                <option value="all">ทุกรายวิชา</option>
                {availableSubjects.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a68c7c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อผลงาน, แท็ก..."
                className="w-full pl-9 pr-4 py-2 clay-input text-xs text-[#361f12] placeholder-[#a68c7c]"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#7d6353] space-y-3">
            <div className="w-8 h-8 border-3 border-[#b8651f] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">กำลังโหลดผลงาน</p>
          </div>
        ) : filteredList.length > 0 ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => (
              <ClassworkCard
                key={item.id}
                item={item}
                isAdmin={false}
                onPreview={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center rounded-[32px] border-2 border-dashed border-[#dec7b2] bg-white/70 p-8 space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-[#faf5ef] text-[#a68c7c] mb-1">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#361f12]">ไม่พบผลงานโชว์เคสในเงื่อนไขนี้</h3>
            <p className="text-xs text-[#7d6353] max-w-sm mx-auto font-medium">
              ลองเปลี่ยนประเภทตัวกรองหรือล้างคำค้นหาเพื่อดูชิ้นงานอื่นๆ
            </p>
            {(filterType !== 'all' || selectedSubject !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setSelectedSubject('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 clay-pill text-xs font-semibold text-[#6d4d37] cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ebdccf] bg-white/60 py-8 mt-16 text-center text-xs text-[#8c6f5d]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-[#b8651f]" />
            <span className="text-[#4a2e1b] font-bold">
              วิธวินท์ แก้วพัฒ — นักศึกษาแผนกเทคโนโลยีสารสนเทศ ห้อง 1สทส1
            </span>
          </div>
          <p>© {new Date().getFullYear()} Student Portfolio & Classwork Showcase. Powered by Next.js & Supabase.</p>
        </div>
      </footer>

      {/* Detail / Lightbox Modal */}
      <ClassworkModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Supabase Status & Setup Modal */}
      <SupabaseConfigModal isOpen={configOpen} onClose={() => setConfigOpen(false)} />
    </div>
  );
}
