# Siberinfo

Portal berita minimalis dengan informasi terkini, mudah dibaca, dan nyaman dibagikan.

## Fitur
- **Desain Minimalis:** Fokus pada kenyamanan membaca.
- **Responsif:** Tampilan optimal di desktop maupun mobile.
- **Mode Gelap:** Mendukung preferensi tema sistem (auto/manual).
- **SEO Optimized:** Meta tags lengkap untuk social sharing, JSON-LD untuk artikel berita.
- **Panel Admin:** Sistem manajemen berita berbasis cloud dengan Supabase.

## Teknologi
- **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla).
- **Backend & Database:** Supabase (PostgreSQL & Storage).
- **Hosting:** GitHub Pages.

## Deployment
Website ini di-deploy sebagai situs statis di GitHub Pages dengan data berita yang dikelola melalui database Supabase.

## Pengaturan
Pastikan file `supabase-config.js` berisi kredensial Supabase Anda:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_KEY';
```
