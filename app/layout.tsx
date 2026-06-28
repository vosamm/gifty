import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIFTY - AI 선물 추천",
  description: "취향 기반 맞춤 선물 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FFF9F5]">{children}</body>
    </html>
  );
}
