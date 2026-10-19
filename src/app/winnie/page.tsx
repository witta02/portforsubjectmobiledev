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
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  Plus,
  Layers,
  Star,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon
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
    // Check existing session
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

  // Add or Edit classwork handler
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

  // Quick toggle showcase status
  const handleToggleShowcase = async (id: string, current: boolean) => {
    // Optimistic UI update
    setClassworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_showcase: !current } : item))
    );
    try {
      await toggleShowcase(id, current);
    } catch (err) {
      console.error('Failed to toggle showcase:', err);
      // Revert if error
      await loadData();
    }
  };

  // Delete item
  const handleDeleteClasswork = async (id: string) => {
    setClassworks((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteClasswork(id);
    } catch (err) {
      console.error('Failed to delete item:', err);
      await loadData();
    }
  };

  // Filtered Items for Winnie
  const displayedItems = useMemo(() => {
    return classworks.filter((item) => {
      // Tab filter
      if (activeTab === 'showcase_only' && !item.is_showcase) {
        return false;
      }
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }
      // Search
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

  // 1. If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-8 backdrop-blur-xl">
          {/* Avatar & Title */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-cyan-500/60 shadow-xl shadow-cyan-500/20">
              <Image
                src="/profile.jpg"
                alt="วิธวินท์ แก้วพัฒ"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold text-white">วิธวินท์ แก้วพัฒ (Winnie)</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  1สทส1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                เข้าสู่ระบบผู้ดูแลเพื่อเพิ่มผลงานและปรับแต่งโชว์เคส
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
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
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm tracking-wider"
              />
              {authError && (
                <p className="text-xs text-rose-400 font-medium pt-1">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              เข้าสู่ระบบ /winnie
            </button>
          </form>

          {/* Helper Note */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              รหัสเริ่มต้นคือ <span className="text-cyan-400 font-mono font-bold">1234</span> (สามารถเปลี่ยนได้ที่ <code className="text-slate-400">NEXT_PUBLIC_ADMIN_PIN</code>)
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition"
            >
              ← กลับไปหน้าโชว์เคสสำหรับคนทั่วไป
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin View: Winnie has full superpowers!
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Banner indicating Admin Mode */}
      <div className="bg-gradient-to-r from-cyan-950 via-blue-950 to-indigo-950 border-b border-cyan-800/60 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-200">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">โหมดผู้ดูแล (Winnie Admin Panel):</span>
            <span>คุณสามารถเพิ่ม ลบ แก้ไข และกดดาว ⭐ เพื่อเลือกงานไปโชว์ใน Showcase ได้ทันที!</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-cyan-300 hover:underline font-medium"
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
        {/* Quick Dashboard Action Bar */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>จัดการผลงานการเรียน</span>
              <span className="text-xs font-normal text-slate-400">
                (ทั้งหมด {classworks.length} ชิ้น • โชว์เคส {showcaseCount} ชิ้น)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              คลิกปุ่มรูปดาว <span className="text-amber-400 font-semibold">⭐</span> บนการ์ดใดก็ได้ เพื่อเปิด/ปิดการแสดงในหน้าแรกของเว็บไซต์
            </p>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            เพิ่มผลงานใหม่ (Add Work)
          </button>
        </div>

        {/* Tabs & Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          {/* Main Tab: All vs Showcase Only */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ผลงานทั้งหมด ({classworks.length})
            </button>
            <button
              onClick={() => setActiveTab('showcase_only')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'showcase_only'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              เฉพาะที่อยู่ใน Showcase ({showcaseCount})
            </button>
          </div>

          {/* Type Filter & Search Box */}
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterCategory)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">ทุกประเภท</option>
              <option value="link">เฉพาะลิงก์</option>
              <option value="photo">เฉพาะรูปภาพ</option>
              <option value="file">เฉพาะไฟล์</option>
            </select>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อ, วิชา, แท็ก..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">กำลังโหลดข้อมูลผลงาน...</p>
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
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4">
            <p className="text-slate-400 text-sm">ยังไม่มีผลงานในหมวดหมู่นี้</p>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition"
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
