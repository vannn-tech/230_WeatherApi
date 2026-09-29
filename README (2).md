# 230_WeatherApi

Aplikasi web (HTML, CSS, JavaScript) untuk mencari lokasi menggunakan **MapTiler Geocoding API**.
Cukup ketik satu nama lokasi, lalu aplikasi menampilkan negara, provinsi, kecamatan, longitude, dan latitude.

## Data yang ditampilkan
| Data | Sumber |
|------|--------|
| Lokasi (input) | Input pengguna |
| Negara | `context` → `country` |
| Provinsi | `context` → `region` |
| Kecamatan | `context` → `municipality` / `county` / `subregion` |
| Longitude & Latitude | `center` pada respons GeoJSON |

## Fitur
- Pencarian lokasi berdasarkan nama, dengan pilihan hasil lain bila ada lebih dari satu kecocokan
- Tombol **GPS** untuk mendeteksi lokasi perangkat (reverse geocoding)
- Chip lokasi populer untuk pencarian cepat
- Peta lokasi dengan penanda (OpenStreetMap)
- Cuaca saat ini (Open-Meteo, tanpa API key)
- Tombol salin untuk latitude dan longitude
- **API Inspector** untuk melihat URL request dan respons JSON
- API key disimpan di browser (localStorage), tidak ada di kode
- Responsif dan mengikuti mode terang/gelap perangkat

## Teknologi
- HTML5, CSS3, JavaScript (tanpa framework)
- [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/)
- [Open-Meteo API](https://open-meteo.com/) (cuaca)
- [OpenStreetMap](https://www.openstreetmap.org/) (peta embed)

## Endpoint yang digunakan
```
GET https://api.maptiler.com/geocoding/{lokasi}.json?key=API_KEY&language=id&limit=5
GET https://api.maptiler.com/geocoding/{longitude},{latitude}.json?key=API_KEY&language=id
```

## Cara menjalankan
1. Daftar gratis di [cloud.maptiler.com](https://cloud.maptiler.com), lalu salin API key dari menu **API Keys**.
2. Clone repo ini:
   ```bash
   git clone https://github.com/vannn-tech/230_WeatherApi.git
   cd 230_WeatherApi
   ```
3. Jalankan server lokal:
   ```bash
   python -m http.server 3000
   ```
4. Buka `http://localhost:3000`, klik **API key**, tempel key, lalu cari lokasi (contoh: `Sleman`).

> Jika muncul error 403, cek **Allowed HTTP origins** pada key di dashboard MapTiler.

## Screenshot

### Tampilan aplikasi
![Hasil pencarian di aplikasi](screenshots/hasil.png)

### Respons GET di Postman
![Respons GET di Postman](screenshots/postman.png)

> Request di Postman memakai `limit=1` agar respons lebih ringkas. API key disamarkan.

## Struktur proyek
```
230_WeatherApi/
├── index.html      # kerangka halaman
├── style.css       # tampilan
├── script.js       # pemanggilan API dan logika tampilan
├── screenshots/    # bukti hasil GET data
└── README.md
```
