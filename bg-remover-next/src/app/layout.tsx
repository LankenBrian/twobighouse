import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 背景移除工具",
  description: "上传图片，AI 自动移除背景",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
