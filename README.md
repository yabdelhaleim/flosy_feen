# فلوسي فين؟ (Flosy Fein) 🇪🇬💸
**اعرف فلوسك .. قبل ما تروح !**

تطبيق مالي ذكي مصمم خصيصاً لتتبع المصروفات الشهرية وإدارة الأقساط بهوية مصرية معاصرة (Modern Egyptian Fintech Design).

---

## 🏗️ البنية البرمجية (Tech Stack)

### 1. الفرونت إند (Frontend)
- **الإطار:** Next.js 16 (App Router + Turbopack + TypeScript)
- **التصميم:** Tailwind CSS v4 مع Design System مصري معاصر
- **الخطوط:** IBM Plex Sans Arabic + Lemonada
- **الأيقونات:** Lucide Icons + Custom SVG Fintech Illustrations
- **الميزات التفاعلية:**
  - التعرف والتسجيل الصوتي الذكي باللهجة المصرية (Web Speech API).
  - إشعارات وتنبيهات الأقساط ومعدل الصرف اليومي.
  - تطبيق ويب تقدمي كامل (PWA Ready).

### 2. الباك إند (Backend)
- **الإطار:** Laravel 11 (PHP 8.3)
- **قاعدة البيانات:** MySQL
- **التخزين المؤقت والـ Queues:** Redis Server (عبر `predis/predis`)
- **المصادقة والأمان:** Laravel Sanctum Token Authentication

---

## 🚀 طريقة التشغيل (Quick Start)

### تشغيل الباك إند:
```bash
cd flosy-fein-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```

### تشغيل الفرونت إند:
```bash
cd flosy-fein-web
npm install
npm run dev
```

التطبيق يعمل على `http://localhost:3000` متصلاً بالـ API على `http://localhost:8000`.
