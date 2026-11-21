import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ویرا | مدیریت کارکنان",
  description: "پنل مدیریت کارکنان برای آزمایش سرویس gRPC ویرا",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}