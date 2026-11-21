import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ریرا | مدیریت کارکنان",
  description: "پنل مدیریت کارکنان برای آزمایش سرویس gRPC ریرا",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}