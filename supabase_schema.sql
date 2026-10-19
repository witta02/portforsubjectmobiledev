-- ==============================================================================
-- Portfolio & Classwork Management Schema for วิธวินท์ แก้วพัฒ (1สทส1)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create classworks table
create table if not exists public.classworks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  subject text not null,
  category text default 'Assignment',
  type text not null check (type in ('link', 'photo', 'file')),
  url text not null,
  file_name text,
  file_size text,
  is_showcase boolean default false,
  tags text[] default array[]::text[],
  term text default '1/2567'
);

-- 2. Enable Row Level Security (RLS)
alter table public.classworks enable row level security;

-- 3. Policies:
-- Public can view all classworks
create policy "Allow public read access"
  on public.classworks
  for select
  using (true);

-- Allow Winnie to insert/update/delete (via anon key / client API)
create policy "Allow insert for all users"
  on public.classworks
  for insert
  with check (true);

create policy "Allow update for all users"
  on public.classworks
  for update
  using (true);

create policy "Allow delete for all users"
  on public.classworks
  for delete
  using (true);

-- 4. Create Storage Bucket for photos and files
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

-- Storage bucket access policies
create policy "Public Access to portfolio-assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

create policy "Allow uploads to portfolio-assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets');

create policy "Allow delete from portfolio-assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets');

-- 5. Insert initial showcase classworks
insert into public.classworks (title, description, subject, category, type, url, file_name, file_size, is_showcase, tags, term)
values
(
  'โปรเจกต์พัฒนาแอปพลิเคชันมือถือ Portfolio & Task Tracker ด้วย Flutter',
  'โปรเจกต์รายวิชา Mobile Application Developer พัฒนาแอปพลิเคชันบนสมาร์ตโฟนด้วย Flutter & Dart รองรับทั้ง iOS และ Android พร้อมเชื่อมต่อ Supabase Database',
  'Mobile Application Developer',
  'Project',
  'link',
  'https://github.com/witta02/portforsubjectmobiledev',
  null,
  null,
  true,
  array['Flutter', 'Dart', 'Mobile App', 'Android', 'iOS', 'Supabase'],
  '1/2567'
),
(
  'ออกแบบ UI/UX สกรีนหน้าจอ Mobile Application บน Figma',
  'การจัดทำโครงร่าง Wireframe และ High-Fidelity UI Design สำหรับแอปพลิเคชันมือถือ ออกแบบตามหลัก Material 3 และ Human Interface Guidelines',
  'Mobile Application Developer',
  'Design',
  'photo',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
  null,
  null,
  true,
  array['UI/UX', 'Figma', 'Mobile Design', 'Material3'],
  '1/2567'
),
(
  'คู่มือแล็บปฏิบัติการเชื่อมต่อ REST API & Authentication บน Mobile App',
  'เอกสารสรุปขั้นตอนการทำระบบ Login, Register และการเรียกข้อมูล JSON API มาแสดงผลใน List View บนแอปพลิเคชันมือถือ',
  'Mobile Application Developer',
  'Lab Report',
  'file',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'Lab_Mobile_API_Integration.pdf',
  '3.2 MB',
  true,
  array['REST API', 'JSON', 'Auth', 'Mobile Dev'],
  '1/2567'
),
(
  'แอปพลิเคชันคำนวณและแปลงค่าหน่วยสำหรับอุปกรณ์พกพา (Kotlin)',
  'พัฒนาแอปพลิเคชัน Native บนระบบปฏิบัติการ Android ด้วย Android Studio และภาษา Kotlin จัดการ State และ Lifecycle ของ Activity',
  'Mobile Application Developer',
  'Assignment',
  'photo',
  'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
  null,
  null,
  false,
  array['Kotlin', 'Android Studio', 'Native App'],
  '1/2567'
),
(
  'ไฟล์ APK ติดตั้งแอปพลิเคชัน Mobile Portfolio เวอร์ชันทดสอบ (Release Build)',
  'ไฟล์แพ็กเกจ APK ที่คอมไพล์สำหรับติดตั้งและทดสอบบนสมาร์ตโฟนระบบ Android โดยตรง',
  'Mobile Application Developer',
  'Project',
  'file',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'Winnie_MobileApp_v1.0.apk',
  '18.5 MB',
  true,
  array['APK', 'Android Build', 'Release'],
  '1/2567'
)
on conflict do nothing;
