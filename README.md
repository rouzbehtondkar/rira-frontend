# Vira Task Frontend

پنل فارسی مدیریت کارکنان با Next.js و TypeScript که برای آزمایش سرویس gRPC پروژه [vira-task](https://github.com/rouzbehtondkar/vira-task) ساخته شده است.

## معماری ارتباط

مرورگر مستقیماً به gRPC متصل نمی‌شود. درخواست‌ها به Route Handlerهای سمت سرور Next.js ارسال می‌شوند و این لایه با استفاده از `@grpc/grpc-js` به سرویس ASP.NET Core متصل می‌شود:

`Browser → Next.js API Routes → gRPC (HTTP/2) → ASP.NET Core → SQL Server`

قرارداد Protobuf در مسیر `contracts/employee/v1/employee.proto` نگهداری می‌شود و با قرارداد بک‌اند هماهنگ است.

## پیش‌نیازها

- Node.js 20 یا بالاتر
- npm
- اجرای بک‌اند Vira Task و SQL Server مطابق README مخزن اصلی

## اجرا

ابتدا مخزن بک‌اند را اجرا کنید:

```bash
dotnet run --environment Development --project src/ViraTask.Server
```

سپس در این مخزن:

```bash
npm install
npm run dev
```

پنل در آدرس `http://localhost:3000` در دسترس است.

آدرس gRPC به‌صورت پیش‌فرض `http://localhost:5000` است. برای تغییر آن، متغیر محیطی زیر را تنظیم کنید:

```env
VIRATASK_GRPC_ADDRESS=localhost:5000
```

این اتصال بدون TLS فقط برای توسعه محلی است. برای استقرار، ارتباط gRPC باید با TLS و تنظیمات شبکه امن شود.

## قابلیت‌ها

- مشاهده فهرست کارکنان و جست‌وجو
- ایجاد، مشاهده، ویرایش و حذف کارمند
- نمایش خطاهای اعتبارسنجی و وضعیت ارتباط
- طراحی واکنش‌گرا و رابط فارسی

## اجرای تست کامل

برای نمایش فهرست، بک‌اند باید RPC مربوط به `ListEmployees` را نیز پیاده‌سازی کرده باشد. هر دو مخزن باید نسخه‌ای از قرارداد Protobuf یکسان داشته باشند.

```bash
npm run build
```

این پروژه داده آزمایشی یا Mock تولید نمی‌کند؛ عملیات از طریق سرویس واقعی و دیتابیس بک‌اند انجام می‌شوند.
