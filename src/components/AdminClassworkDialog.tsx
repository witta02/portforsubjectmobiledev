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
  'Mobile Application Developer',
  'Mobile Application Developer (Flutter & Dart)',
  'Mobile Application Developer (Android Kotlin)',
  'Mobile Application Developer (React Native)',
  'การพัฒนาเว็บไซต์ (Web Development)',
  'ระบบจัดการฐานข้อมูล (Database Systems)',
  'ระบบเครือข่ายคอมพิวเตอร์ (Computer Network)',
  'คอมพิวเตอร์กราฟิกและสื่อประสม (Graphics & Multimedia)',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c1a11]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-white border border-[#e8dcd0] shadow-[0_24px_60px_rgba(62,36,21,0.2)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-7 py-5 bg-white/95 backdrop-blur border-b border-[#f0e4d7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#faefe3] text-[#b8651f] border border-[#e8ceb7]">
              <Star className="w-5 h-5 fill-[#d88337]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#361f12]">
                {editingItem ? 'แก้ไขข้อมูลผลงาน' : 'เพิ่มผลงานการเรียนใหม่'}
              </h2>
              <p className="text-xs text-[#8c6f5d]">สำหรับห้อง 1สทส1 วิธวินท์ แก้วพัฒ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c6f5d] hover:text-[#361f12] hover:bg-[#f7eee3] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Work Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a2e1b]">
              ประเภทของผลงาน <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setType('link')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  type === 'link'
                    ? 'clay-pill-active'
                    : 'clay-pill text-[#6d4d37]'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                ลิงก์ (URL)
              </button>
              <button
                type="button"
                onClick={() => setType('photo')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  type === 'photo'
                    ? 'clay-pill-active'
                    : 'clay-pill text-[#6d4d37]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                รูปภาพ (Photo)
              </button>
              <button
                type="button"
                onClick={() => setType('file')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  type === 'file'
                    ? 'clay-pill-active'
                    : 'clay-pill text-[#6d4d37]'
                }`}
              >
                <FileText className="w-4 h-4" />
                ไฟล์ (File/Doc)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a2e1b]">
              ชื่อชิ้นงาน / หัวข้อการบ้าน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ออกแบบหน้าจอมือถือ Flutter, ระบบ Login บนแอป..."
              required
              className="w-full px-4 py-3 clay-input text-[#361f12] placeholder-[#a68c7c] text-sm"
            />
          </div>

          {/* Subject & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4a2e1b]">
                วิชา / หมวดหมู่รายวิชา <span className="text-rose-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 clay-input text-[#361f12] text-sm"
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
                  className="mt-2 w-full px-3.5 py-2 clay-input text-[#361f12] text-xs"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4a2e1b]">ประเภทงาน</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 clay-input text-[#361f12] text-sm"
              >
                <option value="Project">โครงงาน / โปรเจกต์ (Project)</option>
                <option value="Assignment">การบ้าน / แบบฝึกหัด (Assignment)</option>
                <option value="Lab Report">รายงานแล็บ (Lab Report)</option>
                <option value="Design">งานออกแบบ / UI/UX (Design)</option>
                <option value="Certificate">เกียรติบัตร / รางวัล (Certificate)</option>
                <option value="Exam / Test">สรุปสอบ / แบบทดสอบ</option>
              </select>
            </div>
          </div>

          {/* Link URL or File / Photo Upload */}
          <div className="space-y-2 p-5 rounded-2xl bg-[#faf5ef] border border-[#ebdccf]">
            {type === 'link' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a2e1b]">
                  URL ของลิงก์ผลงาน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/..., https://drive.google.com/..., https://figma.com/..."
                  required
                  className="w-full px-4 py-3 clay-input bg-white text-[#361f12] placeholder-[#a68c7c] text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#4a2e1b]">
                    {type === 'photo' ? 'อัปโหลดรูปภาพ' : 'อัปโหลดไฟล์เอกสาร'}
                  </label>
                  {isUploading && (
                    <span className="flex items-center gap-1.5 text-xs text-[#b8651f] font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังอัปโหลด...
                    </span>
                  )}
                </div>

                {/* Upload File Input with Clay look */}
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#d9c4b1] hover:border-[#b8651f] rounded-2xl cursor-pointer bg-white hover:bg-[#fbf7f2] transition">
                  <Upload className="w-7 h-7 text-[#b8651f] mb-2" />
                  <span className="text-xs text-[#361f12] font-bold">
                    {type === 'photo' ? 'คลิกเลือกรูปภาพจากเครื่อง' : 'คลิกเลือกไฟล์ (PDF, ZIP, APK, DOCX)'}
                  </span>
                  <span className="text-[11px] text-[#8c6f5d] mt-1">
                    {fileName ? `ไฟล์ที่เลือก: ${fileName} (${fileSize})` : 'หรือวาง URL ด้านล่างได้เช่นกัน'}
                  </span>
                  <input
                    type="file"
                    accept={type === 'photo' ? 'image/*' : '.pdf,.doc,.docx,.zip,.rar,.txt,.apk'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Fallback Direct URL */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] text-[#8c6f5d] font-medium">หรือวาง URL โดยตรง:</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      type === 'photo'
                        ? 'https://images.unsplash.com/... หรือ URL รูปภาพ'
                        : 'https://example.com/file.pdf หรือลิงก์ดาวน์โหลด'
                    }
                    className="w-full px-3.5 py-2 clay-input bg-white text-[#361f12] text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a2e1b]">รายละเอียดผลงาน / สิ่งที่ได้เรียนรู้</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="สรุปแนวคิด โค้ดที่ใช้ ฟังก์ชันหลัก หรือเทคโนโลยีในแอปนี้..."
              className="w-full px-4 py-3 clay-input text-[#361f12] placeholder-[#a68c7c] text-sm"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a2e1b]">
              แท็กคำค้นหา (คั่นด้วยเครื่องหมายจุลภาค ,)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Flutter, Dart, Mobile, Android, UI, Figma"
              className="w-full px-4 py-3 clay-input text-[#361f12] placeholder-[#a68c7c] text-sm"
            />
          </div>

          {/* Showcase Switch with Clay Styling */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#faefe3] border border-[#e5cdb7]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#b8651f]">
                <Star className="w-5 h-5 fill-[#d88337]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#5c3010]">
                  แสดงในหน้าโชว์เคส (Showcase on Website)
                </p>
                <p className="text-xs text-[#8c5730]">
                  เปิดไว้เพื่อให้แสดงบนหน้าแรกของพอร์ตโฟลิโอให้ผู้เข้าชมทุกคนเห็น
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
              <div className="w-12 h-6 bg-[#d9c4b1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8651f]" />
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#f0e4d7]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 clay-pill text-xs sm:text-sm font-semibold text-[#6d4d37] cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 clay-btn-caramel text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-50"
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
