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
insert into public.classworks (title, description, subject, category, type, url, is_showcase, tags, term)
values
(
  'ออกแบบเว็บไซต์ Portfolio ด้วย Next.js และ Tailwind CSS',
  'โปรเจกต์จัดทำแฟ้มสะสมผลงานออนไลน์ส่วนตัว แสดงผลงานการเขียนโปรแกรมและการเรียนในแผนกสารสนเทศ 1สทส1',
  'การพัฒนาเว็บไซต์ (Web Development)',
  'Project',
  'link',
  'https://github.com/vitawinz',
  true,
  array['Next.js', 'TailwindCSS', 'React', 'TypeScript'],
  '1/2567'
),
(
  'ระบบฐานข้อมูลนักเรียนและการจัดการข้อมูลด้วย SQL',
  'ออกแบบ ER-Diagram และการเขียนคำสั่ง SQL Query วิเคราะห์ข้อมูลความสัมพันธ์ของระบบนักเรียน',
  'ระบบจัดการฐานข้อมูล (Database Systems)',
  'Assignment',
  'photo',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
  true,
  array['SQL', 'Database', 'ER-Diagram', 'Supabase'],
  '1/2567'
),
(
  'สรุปการตั้งค่าระบบเครือข่ายคอมพิวเตอร์และการแบ่ง VLAN',
  'เอกสารแล็บปฏิบัติการจำลองเครือข่ายด้วย Cisco Packet Tracer และการทดสอบ Routing',
  'ระบบเครือข่ายคอมพิวเตอร์ (Computer Network)',
  'Lab Report',
  'file',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  array['Cisco', 'Network', 'VLAN', 'Routing'],
  '1/2567'
),
(
  'งานออกแบบโปสเตอร์นิทรรศการเทคโนโลยีสารสนเทศ',
  'การใช้โปรแกรมตกแต่งกราฟิกและจัดองค์ประกอบศิลป์สำหรับประชาสัมพันธ์งานสัปดาห์วิทยาศาสตร์',
  'คอมพิวเตอร์กราฟิกและสื่อประสม',
  'Design',
  'photo',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  false,
  array['Graphic', 'Photoshop', 'Poster', 'Design'],
  '1/2567'
)
on conflict do nothing;
