'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, FileText, Star, Loader2 } from 'lucide-react';
import { Classwork, WorkType } from '@/types/classwork';
import { uploadFileToSupabase } from '@/lib/storage';

interface AdminClassworkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<Classwork, 'id' | 'created_at'>, editId?: string) => Promise<void>;
  editingItem?: Classwork | null;
}

const COMMON_SUBJECTS = [
  'การพัฒนาเว็บไซต์ (Web Development)',
  'การเขียนโปรแกรมคอมพิวเตอร์ (Programming)',
  'ระบบจัดการฐานข้อมูล (Database Systems)',
  'ระบบเครือข่ายคอมพิวเตอร์ (Computer Network)',
  'คอมพิวเตอร์กราฟิกและสื่อประสม (Graphics & Multimedia)',
  'ระบบปฏิบัติการ (Operating Systems)',
  'โครงสร้างข้อมูลและอัลกอริทึม (Data Structures)',
  'ภาษาอังกฤษสำหรับไอที (English for IT)',
  'กิจกรรมและผลงานอื่นๆ (Other)',
];

export default function AdminClassworkDialog({
  isOpen,
  onClose,
  onSave,
  editingItem,
}: AdminClassworkDialogProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(COMMON_SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [type, setType] = useState<WorkType>('link');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isShowcase, setIsShowcase] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      if (COMMON_SUBJECTS.includes(editingItem.subject)) {
        setSubject(editingItem.subject);
        setCustomSubject('');
      } else {
        setSubject('custom');
        setCustomSubject(editingItem.subject);
      }
      setCategory(editingItem.category || 'Assignment');
      setType(editingItem.type);
      setUrl(editingItem.url);
      setFileName(editingItem.file_name || '');
      setFileSize(editingItem.file_size || '');
      setDescription(editingItem.description || '');
      setTagsInput(editingItem.tags ? editingItem.tags.join(', ') : '');
      setIsShowcase(editingItem.is_showcase);
    } else {
      // Defaults for new item
      setTitle('');
      setSubject(COMMON_SUBJECTS[0]);
      setCustomSubject('');
      setCategory('Assignment');
      setType('link');
      setUrl('');
      setFileName('');
      setFileSize('');
      setDescription('');
      setTagsInput('');
      setIsShowcase(true);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadFileToSupabase(file);
      setUrl(result.url);
      setFileName(result.fileName);
      setFileSize(result.fileSize);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error('File upload failed:', err);
      alert('อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('กรุณากรอกชื่อผลงาน / ชิ้นงาน');
      return;
    }
    if (!url.trim()) {
      alert('กรุณาระบุลิงก์ หรืออัปโหลดไฟล์รูปภาพ/เอกสาร');
      return;
    }

    const finalSubject = subject === 'custom' ? customSubject.trim() || 'วิชาทั่วไป' : subject;
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    try {
      await onSave(
        {
          title: title.trim(),
          subject: finalSubject,
          category,
          type,
          url: url.trim(),
          file_name: fileName || undefined,
          file_size: fileSize || undefined,
          description: description.trim(),
          tags: parsedTags,
          is_showcase: isShowcase,
          term: '1/2567',
        },
        editingItem?.id
      );
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Star className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingItem ? 'แก้ไขข้อมูลผลงาน' : 'เพิ่มผลงานการเรียนใหม่'}
              </h2>
              <p className="text-xs text-slate-400">สำหรับห้อง 1สทส1 วิธวินท์ แก้วพัฒ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Work Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              ประเภทของผลงาน <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('link')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition ${
                  type === 'link'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                ลิงก์ (URL)
              </button>
              <button
                type="button"
                onClick={() => setType('photo')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition ${
                  type === 'photo'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                รูปภาพ (Photo)
              </button>
              <button
                type="button"
                onClick={() => setType('file')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition ${
                  type === 'file'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                ไฟล์ (File/Doc)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              ชื่อชิ้นงาน / หัวข้อการบ้าน <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ออกแบบหน้าเว็บ Portfolio, สรุปแล็บระบบเครือข่าย..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Subject & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                วิชา / หมวดหมู่รายวิชา <span className="text-rose-400">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm"
              >
                {COMMON_SUBJECTS.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="custom">+ พิมพ์ชื่อวิชาอื่นเอง...</option>
              </select>
              {subject === 'custom' && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="ระบุชื่อวิชา..."
                  className="mt-2 w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">ประเภทงาน</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm"
              >
                <option value="Project">โครงงาน / โปรเจกต์ (Project)</option>
                <option value="Assignment">การบ้าน / แบบฝึกหัด (Assignment)</option>
                <option value="Lab Report">รายงานแล็บ (Lab Report)</option>
                <option value="Design">งานออกแบบ / มีเดีย (Design)</option>
                <option value="Certificate">เกียรติบัตร / รางวัล (Certificate)</option>
                <option value="Exam / Test">สรุปสอบ / แบบทดสอบ</option>
              </select>
            </div>
          </div>

          {/* Link URL or File / Photo Upload */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            {type === 'link' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  URL ของลิงก์ผลงาน <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/..., https://drive.google.com/..., https://figma.com/..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    {type === 'photo' ? 'อัปโหลดรูปภาพ' : 'อัปโหลดไฟล์เอกสาร'}
                  </label>
                  {isUploading && (
                    <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังอัปโหลด...
                    </span>
                  )}
                </div>

                {/* Upload File Input */}
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900 transition">
                  <Upload className="w-7 h-7 text-cyan-400 mb-2" />
                  <span className="text-xs text-slate-300 font-medium">
                    {type === 'photo' ? 'คลิกเลือกรูปภาพจากเครื่อง' : 'คลิกเลือกไฟล์ (PDF, ZIP, DOCX)'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    {fileName ? `ไฟล์ที่เลือก: ${fileName} (${fileSize})` : 'หรือวาง URL ด้านล่างได้เช่นกัน'}
                  </span>
                  <input
                    type="file"
                    accept={type === 'photo' ? 'image/*' : '.pdf,.doc,.docx,.zip,.rar,.txt'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Fallback Direct URL input */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] text-slate-400">หรือวาง URL โดยตรง:</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      type === 'photo'
                        ? 'https://images.unsplash.com/... หรือ URL รูปภาพ'
                        : 'https://example.com/file.pdf หรือลิงก์ดาวน์โหลด'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">รายละเอียดผลงาน / สิ่งที่ได้เรียนรู้</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="สรุปแนวคิด ผลการทดลอง ขั้นตอนการทำ หรือเทคโนโลยีที่ใช้ในผลงานนี้..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              แท็กคำค้นหา (คั่นด้วยเครื่องหมายจุลภาค ,)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Next.js, Python, Network, Cisco, Midterm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Showcase Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  แสดงในหน้าโชว์เคส (Showcase on Website)
                </p>
                <p className="text-xs text-amber-400/80">
                  หากเปิดไว้ ผลงานชิ้นนี้จะแสดงในหน้าแรกของพอร์ตโฟลิโอให้ผู้เข้าชมทุกคนเห็น
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isShowcase}
                onChange={(e) => setIsShowcase(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> กำลังบันทึก...
                </>
              ) : editingItem ? (
                'บันทึกการแก้ไข'
              ) : (
                'บันทึกผลงาน'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
