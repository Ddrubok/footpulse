import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FootPulse | 실시간 축구 뉴스·이적 피드",
  description: "전 세계 프로 구단 교차 분석 및 실시간 축구 이적 피드",
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
