import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
