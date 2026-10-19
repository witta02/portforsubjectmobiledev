import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "วิธวินท์ แก้วพัฒ (1สทส1) - แฟ้มสะสมผลงานการเรียน (Student Portfolio)",
  description: "แฟ้มสะสมผลงานการเรียน คลังผลงาน ชิ้นงาน ลิงก์ และโชว์เคสของ วิธวินท์ แก้วพัฒ แผนกเทคโนโลยีสารสนเทศ ชั้น 1สทส1",
  icons: {
    icon: "/profile.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${promptFont.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
