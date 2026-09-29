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
   git clone https://github.com/USERNAME/230_WeatherApi.git
   cd 230_WeatherApi
```
3. Jalankan server lokal:
```bash
   python -m http.server 3000
```
4. Buka `http://localhost:3000`, klik **API key**, tempel key, lalu cari lokasi (contoh: `Sleman`).

> Jika muncul error 403, cek **Allowed HTTP origins** pada key di dashboard MapTiler.

## Screenshot dan penjelasan

### 1. Pencarian lokasi di Indonesia (Bantul)
![Hasil pencarian Bantul](<img width="1918" height="1079" alt="Screenshot 2026-09-29 103310" src="https://github.com/user-attachments/assets/a62de344-82e2-4410-b7b7-464dbad4ac32" />
)

Input **Bantul** dikirim ke MapTiler Geocoding API dan menghasilkan 5 kandidat lokasi. Kandidat pertama ditampilkan dengan data berikut:

| Data | Hasil |
|------|-------|
| Lokasi | Bantul |
| Negara | Indonesia (kode ID) |
| Provinsi | Daerah Istimewa Yogyakarta |
| Kecamatan | Bantul |
| Latitude | 7.887745° S |
| Longitude | 110.327414° E |

Aplikasi juga menampilkan peta dengan penanda lokasi (OpenStreetMap) dan cuaca saat ini dari Open-Meteo.

### 2. Pencarian lokasi di luar negeri (Tokyo)
![Hasil pencarian Tokyo](<img width="1919" height="1079" alt="Screenshot 2026-09-29 104726" src="https://github.com/user-attachments/assets/a360a2f1-ce61-4b9c-b082-dfe556800806" />
)

Input **Tokyo** menghasilkan negara **Jepang (kode JP)**, provinsi **Tokyo**, latitude **35.676860° N**, dan longitude **139.763895° E**. Kolom kecamatan bernilai `-` karena respons API untuk lokasi ini tidak memiliki tingkat administratif yang setara kecamatan. Screenshot ini menunjukkan bahwa data berubah sesuai input dan aplikasi bekerja untuk lokasi di luar Indonesia.

### 3. API Inspector
![API Inspector](<img width="1919" height="1079" alt="Screenshot 2026-09-29 104926" src="https://github.com/user-attachments/assets/a3f8cb74-66f7-4f3c-83ed-16f300977b33" />
)

<img width="1919" height="1079" alt="Screenshot 2026-09-29 104726" src="https://github.com/user-attachments/assets/a59d4afb-8d77-45b3-85b4-265f70cec4fc" />

Panel **API Inspector** menampilkan request yang dikirim aplikasi, yaitu `GET https://api.maptiler.com/geocoding/mekah.json?key=...&language=id&limit=5` (API key disamarkan), beserta respons JSON bertipe `FeatureCollection`. Data `geometry.coordinates` berisi longitude dan latitude, sedangkan `context` berisi negara dan provinsi.

### 4. Respons GET di Postman
![Postman bagian atas](<img width="1919" height="1036" alt="Screenshot 2026-09-29 104345" src="https://github.com/user-attachments/assets/8fdd44b7-18f4-41af-9bee-133313761f86" />
)

Request `GET https://api.maptiler.com/geocoding/Sleman.json` dengan parameter `key`, `language=id`, dan `limit=1` menghasilkan status **200 OK**. Bagian atas respons berisi:
- `properties`: `kind: admin_area` dan `place_type_name: Kecamatan`
- `geometry.coordinates` dan `center`: longitude `110.3419...` dan latitude `-7.6902...`
- `place_name`: "Sleman, Indonesia"
- awal `context`: kabupaten Sleman dan provinsi Daerah Istimewa Yogyakarta

![Postman bagian bawah](<img width="1919" height="1079" alt="Screenshot 2026-09-29 104406" src="https://github.com/user-attachments/assets/58c8107c-50b0-445b-bd7a-f00ad2f03dad" />
)

Bagian bawah respons melanjutkan `context` (Pulau Jawa, negara Indonesia, benua Asia), lalu `query` ("sleman") dan `attribution` dari MapTiler dan OpenStreetMap.

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
