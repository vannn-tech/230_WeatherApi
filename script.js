const $ = (id) => document.getElementById(id);
const API = "https://api.maptiler.com";
const POPULAR = ["Kebayoran Baru", "Sleman", "Coblong (Bandung)", "Yogyakarta", "Surabaya", "Denpasar", "Tokyo", "London"];
let apiKey = localStorage.getItem("maptiler_key") || "";
let current = null; // {lon, lat}

const WX = {0:"Cerah",1:"Cerah berawan",2:"Berawan sebagian",3:"Mendung",45:"Berkabut",48:"Berkabut",51:"Gerimis",53:"Gerimis",55:"Gerimis lebat",61:"Hujan ringan",63:"Hujan",65:"Hujan lebat",80:"Hujan lokal",81:"Hujan lokal",82:"Hujan deras",95:"Badai petir",96:"Badai petir",99:"Badai petir"};

function status(msg, err = false) { $("status").textContent = msg; $("status").className = err ? "err" : ""; }

// Ambil negara / provinsi / kecamatan dari feature + context
function parse(f) {
  const items = [{ id: f.id, text: f.text }, ...(f.context || [])];
  const find = (...types) => {
    for (const t of types) { const h = items.find((i) => i.id && i.id.startsWith(t + ".")); if (h) return h; }
    return null;
  };
  const c = find("country"), p = find("region"), d = find("municipality", "county", "subregion", "joint_municipality", "locality");
  return { country: c?.text || "-", code: (c?.short_code || c?.country_code || "").toUpperCase(), province: p?.text || "-", district: d?.text || "-" };
}
const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(6)}° ${v >= 0 ? pos : neg}`;

function render(f, override) {
  const d = parse(f);
  const [lon, lat] = override || f.center;
  current = { lon, lat };
  $("rInput").textContent = f.text;
  $("rFull").textContent = f.place_name;
  $("rCountry").textContent = d.country;
  $("rCode").textContent = d.code ? `Kode ${d.code}` : "";
  $("rProv").textContent = d.province;
  $("rDist").textContent = d.district;
  $("rLon").textContent = fmt(lon, "E", "W");
  $("rLat").textContent = fmt(lat, "N", "S");
  const dx = 0.03, dy = 0.02;
  $("rMap").src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - dx},${lat - dy},${lon + dx},${lat + dy}&layer=mapnik&marker=${lat},${lon}`;
  $("result").hidden = false;
  loadWeather(lat, lon);
}

async function loadWeather(lat, lon) {
  $("rWx").textContent = "Memuat…"; $("rWxSub").textContent = "";
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`);
    const c = (await r.json()).current;
    $("rWx").textContent = `${c.temperature_2m}°C · ${WX[c.weather_code] || "Cuaca"}`;
    $("rWxSub").textContent = `Kelembapan ${c.relative_humidity_2m}% · Angin ${c.wind_speed_10m} km/j`;
  } catch { $("rWx").textContent = "Data cuaca tidak tersedia"; }
}

async function call(path, limit = 5) {
  if (!apiKey) { $("keyDialog").showModal(); throw new Error("Isi API key MapTiler dulu."); }
  const url = `${API}${path}${path.includes("?") ? "&" : "?"}key=${encodeURIComponent(apiKey)}&language=id${limit ? `&limit=${limit}` : ""}`;
  $("reqUrl").textContent = "GET " + url.replace(apiKey, "••••••••");
  const res = await fetch(url);
  if (res.status === 401 || res.status === 403) throw new Error("API key ditolak. Periksa key dan Allowed HTTP origins di dashboard MapTiler.");
  if (!res.ok) {
    let m = ""; try { m = (await res.json()).message || ""; } catch {}
    throw new Error(`Permintaan gagal (HTTP ${res.status}). ${m}`.trim());
  }
  const data = await res.json();
  $("raw").textContent = JSON.stringify(data, null, 2);
  return data;
}

function showOthers(features) {
  const box = $("others"); box.innerHTML = "";
  box.hidden = features.length < 2;
  features.forEach((f, i) => {
    const b = document.createElement("button");
    b.textContent = f.place_name.split(",").slice(0, 2).join(",");
    if (i === 0) b.className = "on";
    b.onclick = () => { box.querySelectorAll("button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); render(f); };
    box.appendChild(b);
  });
}

async function search(q = $("q").value.trim()) {
  if (!q) return status("Isi nama lokasi dulu.", true);
  $("q").value = q; $("clear").hidden = false;
  $("go").disabled = true; status("Mencari lokasi…");
  try {
    const data = await call(`/geocoding/${encodeURIComponent(q)}.json`);
    if (!data.features.length) { $("result").hidden = true; return status("Lokasi tidak ditemukan. Coba nama yang lebih spesifik.", true); }
    status(`${data.features.length} hasil ditemukan.`);
    showOthers(data.features); render(data.features[0]);
  } catch (e) { status(e.message, true); }
  finally { $("go").disabled = false; }
}

function useGps() {
  if (!navigator.geolocation) return status("Browser tidak mendukung GPS.", true);
  status("Mengambil posisi GPS…");
  navigator.geolocation.getCurrentPosition(async (p) => {
    const { longitude: lon, latitude: lat } = p.coords;
    try {
      const data = await call(`/geocoding/${lon},${lat}.json`, 0);
      if (!data.features.length) return status("Posisi tidak dikenali.", true);
      status("Lokasi GPS ditemukan."); showOthers([]); render(data.features[0], [lon, lat]);
    } catch (e) { status(e.message, true); }
  }, (err) => status(err.code === 1 ? "Izin lokasi ditolak. Klik ikon gembok/lokasi di address bar, izinkan, lalu coba lagi." : "Posisi GPS tidak tersedia. Coba lagi.", true), { timeout: 10000 });
}

// UI wiring
POPULAR.forEach((n) => { const b = document.createElement("button"); b.textContent = n; b.onclick = () => search(n.replace(/\s*\(.*\)/, "")); $("popular").appendChild(b); });
$("go").onclick = () => search();
$("gps").onclick = useGps;
$("q").addEventListener("keydown", (e) => e.key === "Enter" && search());
$("q").addEventListener("input", () => ($("clear").hidden = !$("q").value));
$("clear").onclick = () => { $("q").value = ""; $("clear").hidden = true; $("q").focus(); };
$("btnInspect").onclick = () => ($("inspector").hidden = !$("inspector").hidden);
$("btnKey").onclick = () => { $("keyInput").value = apiKey; $("keyDialog").showModal(); };
$("keyCancel").onclick = () => $("keyDialog").close();
$("keySave").onclick = () => { apiKey = $("keyInput").value.trim(); localStorage.setItem("maptiler_key", apiKey); $("keyDialog").close(); status(apiKey ? "API key tersimpan." : "API key dikosongkan."); };
document.querySelectorAll(".copy").forEach((b) => (b.onclick = () => { if (current) { navigator.clipboard.writeText(String(current[b.dataset.c])); status(`${b.dataset.c === "lon" ? "Longitude" : "Latitude"} disalin.`); } }));
if (!apiKey) status("Klik “API Key” dan tempel key MapTiler untuk mulai.");
