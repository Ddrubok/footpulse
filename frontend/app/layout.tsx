import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Disputatio (풋디) | 글로벌 축구 선수 토론 & 교차 번역 광장",
  description: "전 세계 축구 팬들이 모국어로 실시간 토론하는 글로벌 선수 인텔리전스 허브 & 토론 광장 - Football Disputatio (풋디)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#0a0e17] text-gray-100 antialiased">{children}</body>
    </html>
  );
}
