'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ClassworkCard from '@/components/ClassworkCard';
import ClassworkModal from '@/components/ClassworkModal';
import AdminClassworkDialog from '@/components/AdminClassworkDialog';
import SupabaseConfigModal from '@/components/SupabaseConfigModal';
import { fetchClassworks, addClasswork, updateClasswork, toggleShowcase, deleteClasswork } from '@/lib/storage';
import { Classwork, FilterCategory } from '@/types/classwork';
import {
  Unlock,
  KeyRound,
  Plus,
  Star,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'auntie_orn_winnie_auth';

export default function WinnieAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [classworks, setClassworks] = useState<Classwork[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Filters
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Classwork | null>(null);
  const [previewItem, setPreviewItem] = useState<Classwork | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'showcase_only'>('all');
  const [filterType, setFilterType] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Expected Admin PIN
  const adminPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

  useEffect(() => {
    const savedAuth = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchClassworks();
      setClassworks(data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setAuthError('');
    } else {
      setAuthError('รหัสผ่าน PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setPinInput('');
  };

  const handleSaveClasswork = async (
    itemData: Omit<Classwork, 'id' | 'created_at'>,
    editId?: string
  ) => {
    if (editId) {
      await updateClasswork(editId, itemData);
    } else {
      await addClasswork(itemData);
    }
    await loadData();
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleToggleShowcase = async (id: string, current: boolean) => {
    setClassworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_showcase: !current } : item))
    );
    try {
      await toggleShowcase(id, current);
    } catch (err) {
      console.error('Failed to toggle showcase:', err);
      await loadData();
    }
  };

  const handleDeleteClasswork = async (id: string) => {
    setClassworks((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteClasswork(id);
    } catch (err) {
      console.error('Failed to delete item:', err);
      await loadData();
    }
  };

  const displayedItems = useMemo(() => {
    return classworks.filter((item) => {
      if (activeTab === 'showcase_only' && !item.is_showcase) {
        return false;
      }
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }
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
  }, [classworks, activeTab, filterType, searchQuery]);

  const showcaseCount = classworks.filter((c) => c.is_showcase).length;

  // 1. Login Screen with Brownie Claymorphism
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fcf8f4] text-[#2c1a11] relative overflow-hidden">
        {/* Warm Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ebd7c2]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md rounded-[32px] bg-white border border-[#e8dcd0] shadow-[0_24px_50px_rgba(62,36,21,0.1)] p-8 sm:p-10">
          {/* Avatar & Title */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 rounded-3xl overflow-hidden p-1 bg-[#f6eee4] shadow-[6px_10px_20px_rgba(62,36,21,0.12),inset_2px_2px_4px_rgba(255,255,255,0.9)] border border-[#dec7b2]">
              <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                <Image
                  src="/profile.jpg"
                  alt="วิธวินท์ แก้วพัฒ"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-extrabold text-[#361f12]">วิธวินท์ แก้วพัฒ (Winnie)</h1>
                {/* <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#faefe3] text-[#a8591a] border border-[#e8ceb7]">
                  1สทส1
                </span> */}
              </div>
              <p className="text-xs text-[#7d6353] mt-1 font-medium">
                เข้าสู่ระบบผู้ดูแลเพื่อเพิ่มผลงานและปรับแต่งโชว์เคส
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4a2e1b] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#b8651f]" />
                รหัส PIN สำหรับเข้าจัดการ (Admin Passcode)
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setAuthError('');
                }}
                placeholder="กรอกรหัส PIN (เริ่มต้น: 1234)"
                autoFocus
                className="w-full px-4 py-3 clay-input text-[#361f12] placeholder-[#a68c7c] text-sm tracking-wider"
              />
              {authError && (
                <p className="text-xs text-rose-600 font-semibold pt-1">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 clay-btn-caramel font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              เข้าสู่ระบบ /winnie
            </button>
          </form>

          {/* Helper Note */}
          <div className="mt-6 pt-4 border-t border-[#f0e4d7] text-center">
            <p className="text-[11px] text-[#8c6f5d]">
              รหัสเริ่มต้นคือ <span className="text-[#964d17] font-mono font-bold">1234</span>
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#6d4d37] hover:text-[#964d17] font-semibold transition"
            >
              ← กลับไปหน้าโชว์เคสสำหรับคนทั่วไป
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin View: Brownie Claymorphism
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f4] text-[#2c1a11]">
      {/* Top Banner indicating Admin Mode */}
      <div className="bg-[#faefe3] border-b border-[#e5cdb7] px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#5c3010]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#b8651f]" />
            <span className="font-bold">โหมดผู้ดูแล (Winnie Admin Panel):</span>
            <span>เพิ่ม ลบ แก้ไข และกดดาว ⭐ บนการ์ด เพื่อเลือกงานไปโชว์เคสได้ทันที!</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[#964d17] font-bold hover:underline"
            >
              เปิดดูหน้าคนทั่วไป (Visitor View) <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar with Admin Actions */}
      <Navbar
        isAdmin={true}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenConfig={() => setConfigOpen(true)}
      />

      {/* Hero Header */}
      <HeroSection classworks={classworks} isAdmin={true} />

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick Dashboard Action Bar in Clay Card */}
        <div className="p-6 sm:p-7 clay-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#361f12] flex items-center gap-2">
              <span>จัดการผลงานการเรียน</span>
              <span className="text-xs font-normal text-[#7d6353]">
                (ทั้งหมด {classworks.length} ชิ้น • โชว์เคส {showcaseCount} ชิ้น)
              </span>
            </h2>
            <p className="text-xs text-[#7d6353] mt-1 font-medium">
              คลิกปุ่มรูปดาว <span className="text-[#d88337] font-bold">⭐</span> บนการ์ดใดก็ได้ เพื่อเปิด/ปิดการแสดงในหน้าแรกของเว็บไซต์ทันที
            </p>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 clay-btn-caramel text-sm font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            เพิ่มผลงานใหม่ (Add Work)
          </button>
        </div>

        {/* Tabs & Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3.5 rounded-[24px] bg-white border border-[#ebdccf] shadow-[6px_10px_20px_rgba(62,36,21,0.05)]">
          {/* Main Tab: All vs Showcase Only */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold transition cursor-pointer ${activeTab === 'all'
                ? 'clay-pill-active'
                : 'clay-pill text-[#6d4d37]'
                }`}
            >
              ผลงานทั้งหมด ({classworks.length})
            </button>
            <button
              onClick={() => setActiveTab('showcase_only')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition cursor-pointer ${activeTab === 'showcase_only'
                ? 'clay-pill-active'
                : 'clay-pill text-[#6d4d37]'
                }`}
            >
              <Star className="w-3.5 h-3.5 fill-[#d88337]" />
              เฉพาะที่อยู่ใน Showcase ({showcaseCount})
            </button>
          </div>

          {/* Type Filter & Search Box */}
          <div className="flex items-center gap-2.5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterCategory)}
              className="px-3.5 py-2 clay-input text-xs font-medium text-[#4a2e1b]"
            >
              <option value="all">ทุกประเภท</option>
              <option value="link">เฉพาะลิงก์</option>
              <option value="photo">เฉพาะรูปภาพ</option>
              <option value="file">เฉพาะไฟล์</option>
            </select>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a68c7c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อ, แท็ก..."
                className="w-full pl-9 pr-3.5 py-2 clay-input text-xs text-[#361f12] placeholder-[#a68c7c]"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#7d6353] space-y-3">
            <div className="w-8 h-8 border-3 border-[#b8651f] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">กำลังโหลดข้อมูลผลงาน...</p>
          </div>
        ) : displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <ClassworkCard
                key={item.id}
                item={item}
                isAdmin={true}
                onPreview={(selected) => setPreviewItem(selected)}
                onToggleShowcase={handleToggleShowcase}
                onEdit={(selected) => {
                  setEditingItem(selected);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDeleteClasswork}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-[32px] border-2 border-dashed border-[#dec7b2] bg-white/70 p-8 space-y-4">
            <p className="text-[#7d6353] text-sm font-medium">ยังไม่มีผลงานในหมวดหมู่นี้</p>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 clay-btn-caramel text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> เพิ่มผลงานชิ้นแรก
            </button>
          </div>
        )}
      </main>

      {/* Add / Edit Dialog */}
      <AdminClassworkDialog
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveClasswork}
        editingItem={editingItem}
      />

      {/* Preview Modal */}
      <ClassworkModal item={previewItem} onClose={() => setPreviewItem(null)} />

      {/* Supabase Status / Instructions */}
      <SupabaseConfigModal isOpen={configOpen} onClose={() => setConfigOpen(false)} />
    </div>
  );
}
