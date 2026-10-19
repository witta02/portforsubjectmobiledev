# แฟ้มสะสมผลงานการเรียน (Student Portfolio)
### วิธวินท์ แก้วพัฒ — แผนกเทคโนโลยีสารสนเทศ ชั้น 1สทส1

เว็บไซต์รวบรวมผลงาน ชิ้นงานการบ้าน รายงานแล็บ โปรเจกต์ ลิงก์ รูปภาพ และไฟล์เอกสาร พร้อมระบบจัดการหน้าโชว์เคส (Showcase) พัฒนาด้วย **Next.js (App Router)**, **Tailwind CSS**, และ **Supabase**

---

## 🌟 ฟีเจอร์หลัก (Key Features)

### 1. หน้าแรกสำหรับผู้เข้าชมทั่วไป (`/`) — Showcase Only
* **แสดงเฉพาะผลงานที่ตั้งค่าเป็น Showcase**: ผู้เข้าชมทั่วไปจะเห็นเฉพาะผลงานเด่นที่คัดเลือกมาแล้ว
* **โหมดอ่านอย่างเดียว (Read-Only)**: ไม่มีปุ่มเพิ่ม แก้ไข หรือลบผลงาน ปลอดภัย 100%
* **ตัวกรอง & ค้นหา**: กรองดูตามประเภท (ลิงก์, รูปภาพ, ไฟล์เอกสาร) และตามรายวิชา
* **Lightbox Preview**: ดูรูปภาพขนาดเต็ม หรือคลิกเปิดลิงก์/ดาวน์โหลดไฟล์ได้ทันที

### 2. หน้าจัดการส่วนตัวสำหรับคุณวินนี่ (`/winnie`)
* **เข้าสู่ระบบผ่าน URL ลับ**: ไปที่ `/winnie`
* **รหัส PIN ป้องกัน**: ค่าเริ่มต้นคือ `1234` (สามารถเปลี่ยนได้ที่ไฟล์ `.env.local` หรือ Environment Variables)
* **เพิ่มผลงานใหม่**: 
  * 🔗 **ลิงก์ (Link)**: เช่น GitHub, Figma, Google Drive, YouTube, เว็บไซต์
  * 🖼️ **รูปภาพ (Photo)**: อัปโหลดจากเครื่อง หรือวาง URL รูปภาพ
  * 📁 **ไฟล์เอกสาร (File)**: อัปโหลดไฟล์ PDF, ZIP, DOCX หรือวางลิงก์ดาวน์โหลด
* **⭐ ปรับแสดงในโชว์เคส (Showcase Toggle)**: คลิกที่ปุ่มรูปดาว ⭐ บนการ์ดใดก็ได้ เพื่อเปิด/ปิดการแสดงในหน้าแรกได้ทันที!
* **แก้ไข & ลบ**: ปรับปรุงเนื้อหาหรือลบผลงานได้ตลอดเวลา

---

## 🗄️ การตั้งค่า Supabase Database

1. สมัครหรือเข้าสู่ระบบที่ [Supabase](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่เมนู **SQL Editor**
3. คัดลอกคำสั่งทั้งหมดจากไฟล์ `supabase_schema.sql` ในโปรเจกต์นี้ แล้วกด **Run**
   * ระบบจะสร้างตาราง `classworks`
   * ตั้งค่า Row Level Security (RLS)
   * สร้าง Storage Bucket `portfolio-assets` สำหรับเก็บรูปภาพและไฟล์
4. ไปที่ **Project Settings** > **API** เพื่อคัดลอก:
   * `Project URL`
   * `anon public key`
5. นำไปใส่ใน `.env.local` หรือ Environment Variables บน Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ADMIN_PIN=1234
   ```

*(หมายเหตุ: หากยังไม่ได้ใส่ Supabase Keys ระบบจะทำงานในโหมด Local Storage อัตโนมัติ เพื่อให้สามารถเปิดใช้งานและทดสอบในเครื่องได้ทันที)*

---

## 🚀 การ Deploy ขึ้น Vercel

### วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)
1. อัปโหลดโค้ดนี้ขึ้น GitHub Repository ของคุณ
2. ไปที่ [Vercel](https://vercel.com) แล้วกด **Add New** > **Project**
3. เลือก Repository นี้
4. ในส่วน **Environment Variables** ให้ใส่:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `NEXT_PUBLIC_ADMIN_PIN` (รหัสผ่านเข้า `/winnie` เช่น `1234`)
5. กด **Deploy** เว็บไซต์ของคุณจะออนไลน์ทันที!

### วิธีที่ 2: Deploy ผ่าน Vercel CLI
```bash
npx vercel
```
ทำตามขั้นตอนบนหน้าจอเพื่อล็อกอินและเผยแพร่เว็บไซต์

---

## 💻 การทดสอบและรันในเครื่อง (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รันโหมด Development
npm run dev

# เข้าชมหน้าเว็บ
# หน้าคนทั่วไป: http://localhost:3000
# หน้าจัดการของคุณ: http://localhost:3000/winnie (PIN: 1234)
```
