# TugasKu — Manajer Tugas Kuliah (PWA)

Aplikasi Progressive Web App untuk mencatat tugas kuliah dan memantau deadline.
Dibuat untuk Praktikum PPB Modul 5 (PWA II).

- **Nama:** Nabilah Brina Assyifa
- **NIM:** 21120123120025
- **Kelompok:** 33

## Teknologi (sesuai modul)
React + Vite · vite-plugin-pwa (Workbox) · Tailwind CSS v4 (`@tailwindcss/vite`) · Axios · lucide-react · Supabase REST API (opsional) · localStorage · Vercel

## Halaman
| Halaman | Isi |
|---|---|
| **Beranda** | Ringkasan progres, statistik, deadline terdekat |
| **Tugas** | **CRUD** tugas: tambah, lihat detail, edit, hapus, tandai selesai + cari/filter/urutkan |
| **Jadwal** | Kalender bulanan dengan penanda deadline per tanggal |
| **Profil** | Nama, NIM, kelompok + status aplikasi (online/offline, terpasang, sinkron) |

## Fitur PWA
- **Installable** — `manifest.webmanifest` + ikon 192/512/maskable, tombol "Install" muncul otomatis (PWABadge).
- **Offline** — service worker (Workbox `generateSW`) mem-precache semua aset; halaman tetap terbuka tanpa internet.
- **CRUD offline** — data disimpan *local-first* di localStorage. Jika Supabase aktif, perubahan saat offline masuk antrean dan otomatis dikirim saat online kembali.

## Menjalankan
```bash
npm install
npm run dev        # mode pengembangan
npm run build      # build produksi
npm run preview    # uji hasil build (cek install & offline di sini)
```
Tanpa `.env`, aplikasi berjalan dalam mode lokal (localStorage) dengan data contoh.

### (Opsional) Hubungkan ke Supabase
1. Buat project di supabase.com, jalankan `supabase.sql` di SQL Editor.
2. Salin `.env.example` menjadi `.env`, isi URL dan anon key.
3. Di Vercel, tambahkan variabel yang sama di *Settings → Environment Variables*.

## Deploy ke Vercel
```bash
git init && git add . && git commit -m "TugasKu PWA"
git branch -M main
git remote add origin [link repo]
git push -u origin main
```
Lalu di Vercel: *Add New → Project → Import* repository → Deploy (preset Vite terdeteksi otomatis).

## Struktur
```
src/
  config/api.js            # Axios + header Supabase
  services/taskService.js  # CRUD local-first + antrean sinkron
  hooks/useTasks.jsx       # Context state global
  components/              # Header, BottomNav, PWABadge, SplashScreen, ConfirmModal, task/*
  pages/                   # HomePage, TasksPage, TaskDetail, Create/EditTaskPage, SchedulePage, ProfilePage
  utils/helpers.js
```
