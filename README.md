# Viral Terbaru 2026

Website video statis dengan halaman admin, pengaturan iklan, dan proses publikasi otomatis melalui GitHub Actions ke GitHub Pages.

## Fitur utama

- Kategori video: Indonesia, Papua, dan Barat.
- Slug video dibuat otomatis dari judul dan Part.
- Nomor Part dihitung otomatis per kategori saat video baru dibuat.
- Mengedit video tidak mengubah slug atau Part yang sudah ada.
- Urutan video mengikuti tanggal dan jam publikasi, bukan waktu terakhir diedit.
- Halaman utama menampilkan navigasi nomor halaman di atas dan di bawah daftar video.
- Cover video disimpan di `covers/[slug].jpg`.
- Gambar Open Graph disimpan di `covers/og/[slug].jpg` dengan ukuran 1200 × 630 piksel.
- Player Google Drive tetap didukung; URL embed dapat digunakan jika tersedia.
- `videos.json` adalah sumber data video utama.
- `config.json` menyimpan identitas website dan pengaturan iklan.
- GitHub Actions menjalankan generator halaman dan deployment ke GitHub Pages.

## Panel admin

Panel admin dapat dibuka melalui `/admin/` setelah website ter-deploy.

Panel menggunakan GitHub Personal Access Token (PAT) yang dimasukkan sendiri oleh admin. Token disimpan di `sessionStorage` pada browser, bukan ditulis ke file website. Token perlu memiliki izin **Contents: Read and write** untuk repository yang dipilih di pengaturan website.

Jangan membagikan token kepada siapa pun dan jangan memasukkan token ke file publik atau commit Git.

## Pengaturan website dan iklan

Melalui panel admin, admin dapat mengatur nama dan URL website serta konfigurasi iklan yang tersedia di proyek. Gunakan kode dan URL iklan milik sendiri. Periksa pengaturan iklan sebelum mengaktifkannya di website produksi.

## Pemeriksaan AdBlock dan VPN/proxy

Proyek ini dapat menggunakan `assets/js/access-guard.js` untuk memeriksa pemblokir iklan dan koneksi VPN/proxy yang dikenali.

- Jika AdBlock terdeteksi, pengunjung melihat pesan agar pemblokir iklan dinonaktifkan dan halaman dimuat ulang.
- Pemeriksaan VPN menggunakan layanan pihak ketiga HackMyIP (`https://hackmyip.com/api/score`). Jika respons layanan menandai IP sebagai VPN, proxy, Tor, atau pusat data, akses ditahan dan pengunjung diminta mematikan layanan tersebut.
- Jika layanan pemeriksaan pihak ketiga gagal atau tidak dapat dijangkau, implementasi saat ini mengizinkan akses agar website tidak terkunci karena gangguan layanan.

**Batasan penting:** pemeriksaan ini berjalan di sisi browser, bukan firewall server. Deteksi VPN/proxy dan AdBlock tidak sempurna; VPN baru dapat lolos dan koneksi biasa bisa salah terdeteksi. Karena GitHub Pages adalah hosting statis, pemeriksaan ini bukan pengganti kontrol akses di sisi server. Perilaku pemeriksaan dapat berubah jika layanan pihak ketiga mengubah API, dan penggunaan layanan eksternal tunduk pada ketersediaan serta kebijakan privasinya.

## Data publikasi

Contoh nilai tanggal dan jam publikasi di data video:

```json
{
  "tanggal": "2026-09-19",
  "jam": "21:30"
}
```

## Struktur file penting

- `videos.json` — data video utama.
- `config.json` — konfigurasi website dan iklan.
- `generate.py` — generator halaman HTML.
- `templates/` — template halaman utama dan halaman video.
- `assets/css/style.css` — gaya tampilan website.
- `assets/js/` — JavaScript website, termasuk pemeriksaan akses bila diaktifkan.
- `admin/` — panel administrasi.
- `covers/` — cover dan gambar Open Graph.
- `videos/` — halaman HTML video hasil generator.
- `.github/workflows/deploy.yml` — workflow build/deploy GitHub Actions.

## Deployment ke GitHub Pages

1. Unggah atau commit perubahan ke branch `main`.
2. Di GitHub, buka **Settings → Pages**.
3. Pilih **GitHub Actions** sebagai Source jika belum dipilih.
4. Buka tab **Actions** dan pastikan workflow deploy selesai dengan status berhasil.
5. Buka website dan lakukan hard refresh (`Ctrl+F5`) untuk memuat file terbaru.

Jangan menghapus `videos.json`, `config.json`, atau file konfigurasi repository saat menerapkan pembaruan.

## Menyalin proyek ke repository lain

1. Salin source proyek ke repository GitHub tujuan.
2. Pastikan branch yang dipakai sesuai dengan workflow (umumnya `main`).
3. Buka `/admin/` setelah deployment.
4. Masukkan GitHub Owner, Repository, Branch, dan token untuk repository tujuan.
5. Di **Website Settings**, isi nama dan URL website lalu simpan.
6. Di **Adsterra Settings**, isi kode iklan milik website tersebut jika ingin menggunakan iklan.
7. Periksa pengaturan dan jalankan pengujian sebelum membagikan website.

## Migrasi data lama

Data lama dapat diimpor melalui `scripts/import_legacy.py` setelah URL legacy diisi secara manual bila diperlukan. Script tersebut membaca `videos.json` lama; folder `covers/` lama tidak dibaca secara otomatis.
