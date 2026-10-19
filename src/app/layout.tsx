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
  title: "วิธวินท์ แก้วพัฒ (1สทส1) - Mobile Application Developer Portfolio",
  description: "แฟ้มสะสมผลงานการเรียนรายวิชา การพัฒนาซอฟต์แวร์สำหรับอุปกรณ์เคลื่อนที่ 31901-2009",
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
      <body className="min-h-screen bg-[#fcf8f4] text-[#2c1a11] font-sans antialiased selection:bg-[#d88337]/25 selection:text-[#53321c]">
        {children}
      </body>
    </html>
  );
}
