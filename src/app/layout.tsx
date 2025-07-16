import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import React from "react";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoomSecret Map - 모텔 예약 서비스",
  description: "전국 모텔 및 호텔 예약 서비스. 실시간 예약, 최저가 보장, 다양한 할인 혜택을 제공합니다.",
  keywords: ["모텔", "호텔", "예약", "숙박", "여행", "할인"],
  authors: [{ name: "RoomSecret Map" }],
  openGraph: {
    title: "RoomSecret Map - 모텔 예약 서비스",
    description: "전국 모텔 및 호텔 예약 서비스. 실시간 예약, 최저가 보장, 다양한 할인 혜택을 제공합니다.",
    url: "https://roomsecret-map.com",
    siteName: "RoomSecret Map",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RoomSecret Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomSecret Map - 모텔 예약 서비스",
    description: "전국 모텔 및 호텔 예약 서비스. 실시간 예약, 최저가 보장, 다양한 할인 혜택을 제공합니다.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://roomsecret-map.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // StrictMode를 개발 환경에서만 비활성화 (Kakao Maps 이중 초기화 방지)
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`}
          strategy="beforeInteractive"
        />
        {isDevelopment ? (
          // 개발 환경: StrictMode 비활성화
          children
        ) : (
          // 프로덕션 환경: StrictMode 활성화
          <React.StrictMode>
            {children}
          </React.StrictMode>
        )}
      </body>
    </html>
  );
}
