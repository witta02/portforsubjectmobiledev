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
  // Filter classworks where is_showcase === true
  const showcaseOnlyList = useMemo(() => {
    return classworks.filter((item) => item.is_showcase);
  }, [classworks]);

  // Extract unique subjects among showcase items
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Visitor Navbar: Strictly read-only, no admin buttons */}
      <Navbar
        isAdmin={false}
        onOpenConfig={() => setConfigOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection classworks={classworks} isAdmin={false} />

      {/* Main Showcase Showcase Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              คลังผลงานโดดเด่น (Featured Showcase)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ผลงานและชิ้นงานโชว์เคส
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              ผลงานการเรียนยอดเยี่ยมที่คัดสรรแล้วของ วิธวินท์ แก้วพัฒ (1สทส1)
            </p>
          </div>

          {/* Quick Counter */}
          <div className="text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
            แสดง <span className="text-cyan-400 font-bold">{filteredList.length}</span> จากทั้งหมด{' '}
            <span className="text-amber-400 font-bold">{showcaseOnlyList.length}</span> ชิ้นงานโชว์เคส
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterType('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              ทั้งหมด ({showcaseOnlyList.length})
            </button>
            <button
              onClick={() => setFilterType('link')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
                filterType === 'link'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              ลิงก์ผลงาน
            </button>
            <button
              onClick={() => setFilterType('photo')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
                filterType === 'photo'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              รูปภาพ/กราฟิก
            </button>
            <button
              onClick={() => setFilterType('file')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
                filterType === 'file'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              ไฟล์เอกสาร
            </button>
          </div>

          {/* Search Box & Subject Filter */}
          <div className="flex items-center gap-2">
            {availableSubjects.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 max-w-[150px] truncate"
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
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อผลงาน, วิชา, แท็ก..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">กำลังโหลดคลังผลงานโชว์เคส...</p>
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
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-slate-800 text-slate-400 mb-1">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">ไม่พบผลงานโชว์เคสในเงื่อนไขนี้</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              ลองเปลี่ยนประเภทตัวกรองหรือล้างคำค้นหาเพื่อดูชิ้นงานอื่นๆ
            </p>
            {(filterType !== 'all' || selectedSubject !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setSelectedSubject('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-1.5 rounded-lg text-xs bg-slate-800 text-cyan-300 hover:bg-slate-700 transition"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-medium">
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
