// Data contoh — dipakai sekali saat pertama kali aplikasi dibuka (mode lokal).
// Deadline dibuat relatif terhadap hari ini supaya selalu terlihat realistis.

const daysFromNow = (days, hour = 23, minute = 59) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const SAMPLE_TASKS = [
  {
    id: 'sample-1',
    title: 'Laporan Praktikum Modul 5 PWA',
    course: 'Praktikum PPB',
    description: 'Membuat aplikasi PWA dengan React + Vite, deploy ke Vercel, dan lampirkan screenshot.',
    deadline: daysFromNow(1, 23, 59),
    priority: 'tinggi',
    status: 'proses',
  },
  {
    id: 'sample-2',
    title: 'Kuis Normalisasi Basis Data',
    course: 'Basis Data',
    description: 'Pelajari 1NF sampai BCNF, latihan soal dari slide pertemuan 9.',
    deadline: daysFromNow(3, 9, 0),
    priority: 'sedang',
    status: 'belum',
  },
  {
    id: 'sample-3',
    title: 'Resume Jurnal Interaksi Manusia & Komputer',
    course: 'IMK',
    description: 'Resume 2 jurnal tentang usability testing, maksimal 2 halaman.',
    deadline: daysFromNow(6, 17, 0),
    priority: 'rendah',
    status: 'belum',
  },
  {
    id: 'sample-4',
    title: 'Tugas Besar Rekayasa Perangkat Lunak — SRS',
    course: 'RPL',
    description: 'Menyusun dokumen SRS bersama kelompok, termasuk use case diagram.',
    deadline: daysFromNow(10, 23, 59),
    priority: 'tinggi',
    status: 'belum',
  },
  {
    id: 'sample-5',
    title: 'Latihan Soal Graf',
    course: 'Matematika Diskrit',
    description: 'Kerjakan latihan BFS/DFS dan pohon merentang minimum.',
    deadline: daysFromNow(-2, 23, 59),
    priority: 'sedang',
    status: 'selesai',
  },
]

export default SAMPLE_TASKS
