/* ===== Siberinfo - app.js =====
 * Berisi: penyimpanan (localStorage), utilitas, routing hash, render halaman,
 * dan fitur berbagi (share). Dipakai oleh index.html dan admin.html.
 */

const STORAGE_KEY = 'siberinfo_articles';

const CATEGORIES = [
  { slug: 'teknologi', name: 'Teknologi' },
  { slug: 'ekonomi', name: 'Ekonomi' },
  { slug: 'politik', name: 'Politik' },
  { slug: 'olahraga', name: 'Olahraga' },
  { slug: 'kesehatan', name: 'Kesehatan' },
  { slug: 'hiburan', name: 'Hiburan' },
  { slug: 'lingkungan', name: 'Lingkungan' },
];

// Data contoh, hanya dipakai saat localStorage belum berisi data
const SEED_ARTICLES = [
  {
    id: 'seed-1',
    title: 'Selamat Datang di Siberinfo',
    category: 'teknologi',
    author: 'Redaksi',
    image: '',
    createdAt: Date.now() - 1 * 86400000,
    content:
      'Siberinfo hadir sebagai portal berita yang mengutamakan kenyamanan membaca. Tampilan yang bersih dan tipografi yang lapang membuat setiap artikel lebih mudah dicerna.\n\n' +
      'Mode terang dan gelap akan menyesuaikan secara otomatis dengan pengaturan perangkat Anda. Silakan jelajahi berita berdasarkan kategori atau bagikan artikel favorit Anda ke media sosial.',
  },
  {
    id: 'seed-2',
    title: 'Pasar Ekonomi Digital Terus Bertumbuh di Kawasan Asia Tenggara',
    category: 'ekonomi',
    author: 'Redaksi',
    image: '',
    createdAt: Date.now() - 2 * 86400000,
    content:
      'Nilai ekonomi digital di kawasan Asia Tenggara diperkirakan terus meningkat seiring makin luasnya akses internet dan adopsi layanan pembayaran digital.\n\n' +
      'Para pelaku usaha kecil dan menengah didorong untuk memanfaatkan platform digital agar mampu menjangkau pasar yang lebih luas.',
  },
  {
    id: 'seed-3',
    title: 'Tips Menjaga Kualitas Tidur di Tengah Kesibukan',
    category: 'kesehatan',
    author: 'Redaksi',
    image: '',
    createdAt: Date.now() - 3 * 86400000,
    content:
      'Kualitas tidur berpengaruh besar pada konsentrasi dan daya tahan tubuh. Mulailah dengan menetapkan jam tidur yang konsisten setiap hari.\n\n' +
      'Kurangi paparan layar gawai satu jam sebelum tidur dan pastikan kamar tidur dalam kondisi gelap serta tenang.',
  },
  {
    id: 'seed-fire',
    title: 'Kebakaran Hutan dan Lahan Kembali Selimuti Kalimantan, Kabut Asap Meluas',
    category: 'kesehatan',
    author: 'Redaksi',
    // Foto Wikimedia Commons (CC BY 4.0): "Kalimantan Forest Fires", Agustus 2026
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Kalimantan_Forest_Fires.jpg',
    imageCredit: 'Foto: MWul / Wikimedia Commons, CC BY 4.0. Kebakaran hutan di sekitar kampus Palangka Raya, Kalimantan Tengah.',
    createdAt: Date.now(),
    content:
      'Kebakaran hutan dan lahan kembali terjadi di sejumlah wilayah Kalimantan. Asap tebal menyelimuti kota-kota di sekitarnya dan menurunkan jarak pandang, terutama pada pagi dan sore hari.\n\n' +
      'Kabut asap yang meluas dilaporkan memengaruhi kualitas udara dan kesehatan warga, khususnya kelompok rentan seperti anak-anak, lansia, dan penderita gangguan pernapasan. Warga diimbau mengurangi aktivitas di luar ruangan dan menggunakan masker saat kondisi udara memburuk.\n\n' +
      'Pakar lingkungan menilai praktik pembakaran lahan untuk membuka perkebunan masih menjadi faktor utama, ditambah musim kemarau yang membuat vegetasi mudah terbakar. Pemantauan titik panas melalui satelit dan patroli lapangan terus ditingkatkan oleh pemerintah daerah bersama instansi terkait.\n\n' +
      'Masyarakat diimbau untuk tidak membakar lahan dan segera melaporkan titik api kepada petugas setempat.',
  },
  {
    id: 'seed-fire-2',
    title: 'Titik Panas Meningkat di Kalimantan Saat Musim Kemarau',
    category: 'lingkungan',
    author: 'Redaksi',
    // Foto Wikimedia Commons (domain publik, NASA): "Borneo fires and smoke, 2002"
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Borneo_fires_and_smoke%2C_2002.jpg/1280px-Borneo_fires_and_smoke%2C_2002.jpg',
    imageCredit: 'Foto: Jacques Descloitres, MODIS Land Rapid Response Team, NASA/GSFC / Wikimedia Commons, domain publik.',
    createdAt: Date.now() - 1 * 86400000,
    content:
      'Pemantauan satelit menunjukkan jumlah titik panas di sejumlah wilayah Kalimantan meningkat seiring datangnya musim kemarau. Titik panas menjadi indikator awal kebakaran yang perlu ditindaklanjuti dengan cepat.\n\n' +
      'Asap yang dihasilkan dari pembakaran lahan dapat bergerak mengikuti arah angin dan mencapai wilayah yang jauh dari sumber api. Kondisi ini membuat pemantauan udara perlu dilakukan secara rutin.\n\n' +
      'Pemerintah daerah bersama instansi terkait diminta memperkuat patroli dan menyiapkan personel pemadam di lokasi rawan. Warga juga diingatkan untuk tidak membuka lahan dengan cara membakar.',
  },
  {
    id: 'seed-fire-3',
    title: 'Kabut Asap Menyelimuti Kota di Kalimantan Selatan, Warga Diminta Pakai Masker',
    category: 'kesehatan',
    author: 'Redaksi',
    // Foto Wikimedia Commons (CC0): "Smoke haze cuz forest fire, its all over town"
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Smoke_haze_cuz_forest_fire%2C_its_all_over_town.jpg',
    imageCredit: 'Foto: Zenibas / Wikimedia Commons, CC0 (domain publik).',
    createdAt: Date.now() - 2 * 86400000,
    content:
      'Kabut asap dari kebakaran hutan dan lahan di Kalimantan Selatan dilaporkan menyelimuti kawasan perkotaan. Jarak pandang berkurang dan udara terasa pengap, terutama saat pagi hari.\n\n' +
      'Dinas kesehatan menyarankan warga yang memiliki riwayat asma atau gangguan pernapasan untuk membatasi aktivitas di luar rumah. Penggunaan masker dan menjaga kebersihan saluran napas juga dianjurkan.\n\n' +
      'Sekolah dan instansi diimbau memantau kualitas udara setempat sebelum menyelenggarakan kegiatan di luar ruangan.',
  },
  {
    id: 'seed-fire-4',
    title: 'Matahari Terbenam Tertutup Kabut Asap di Berau, Kalimantan Timur',
    category: 'lingkungan',
    author: 'Redaksi',
    // Foto Wikimedia Commons (CC BY 4.0): "Sunset in haze, Berau, East Kalimantan", Agustus 2026
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Sunset_in_haze%2C_Berau%2C_East_Kalimantan.jpg',
    imageCredit: 'Foto: Mesa Kala / Wikimedia Commons, CC BY 4.0.',
    createdAt: Date.now() - 3 * 86400000,
    content:
      'Kabut asap yang menutupi sebagian besar wilayah Kalimantan pada Agustus lalu membuat langit tampak kekuningan saat senja. Kondisi ini juga menurunkan kualitas udara dan meningkatkan suhu di sejumlah tempat.\n\n' +
      'Paparan asap dalam jangka panjang dikhawatirkan berdampak pada kesehatan masyarakat. Karena itu, pemantauan kualitas udara dan informasi kepada warga menjadi penting.\n\n' +
      'Upaya pencegahan difokuskan pada pengendalian pembakaran lahan dan penegakan aturan bagi pihak yang membuka lahan dengan cara membakar.',
  },
  {
    id: 'seed-fire-5',
    title: 'Deforestasi dan Degradasi Lahan di Kalimantan Dorong Emisi Karbon',
    category: 'lingkungan',
    author: 'Redaksi',
    // Foto Wikimedia Commons (CC BY 2.0): "Kalimantan deforestation and degradation 4"
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Kalimantan_deforestation_and_degradation_4_%2810706228444%29.jpg',
    imageCredit: 'Foto: Josh Estey/AusAID / Wikimedia Commons, CC BY 2.0.',
    createdAt: Date.now() - 4 * 86400000,
    content:
      'Hutan yang rusak akibat pembalakan liar dan kebakaran berulang di Kalimantan melepaskan karbon yang tersimpan dalam pohon dan tanah. Lahan yang terbakar juga sulit kembali menjadi hutan dalam waktu singkat.\n\n' +
      'Pemulihan gambut dan rehabilitasi hutan menjadi bagian dari upaya menurunkan emisi. Para peneliti menekankan pentingnya menjaga hutan yang tersisa sebagai penyimpan karbon.\n\n' +
      'Masyarakat dapat berperan dengan tidak membuka lahan melalui pembakaran serta ikut menjaga kawasan hutan di sekitar tempat tinggal.',
  },
];

/* ---------- Penyimpanan ---------- */

const VIEWS_KEY = 'siberinfo_views';
const SEED_VERSION_KEY = 'siberinfo_seed_version';
const SEED_VERSION = '3';

/* ---------- Sumber data ----------
 * Data diambil dari Supabase (cloud database).
 */

let cache = [];       // daftar berita terbaru dari server
let cacheMode = 'supabase'; // 'supabase' atau 'local'

// Mengambil daftar berita dari Supabase
async function loadArticles() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    
    // Transform snake_case ke camelCase
    cache = (data || []).map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      author: a.author,
      image: a.image,
      imageCredit: a.image_credit,
      content: a.content,
      views: a.views || 0,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));
    cacheMode = 'supabase';
  } catch (e) {
    console.error('Gagal mengambil data dari Supabase:', e);
    cache = localArticles();
    cacheMode = 'local';
  }
}

// Mode cadangan: data contoh + berita di localStorage (perilaku sebelumnya)
function localArticles() {
  let list;
  try {
    list = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    list = null;
  }
  if (!Array.isArray(list)) {
    list = SEED_ARTICLES.map((s) => ({ ...s }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  } else if (localStorage.getItem(SEED_VERSION_KEY) !== SEED_VERSION) {
    const ids = new Set(list.map((a) => a.id));
    SEED_ARTICLES.filter((s) => !ids.has(s.id)).forEach((s) => list.push({ ...s }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
  return [...list].sort((a, b) => b.createdAt - a.createdAt);
}

function getArticles() {
  return [...cache].sort((a, b) => b.createdAt - a.createdAt);
}

function saveArticles(list) {
  // Hanya dipakai dalam mode lokal; mode API menyimpan lewat endpoint save/delete
  if (cacheMode === 'local') localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  cache = list;
}

/* ---------- Trending (jumlah dibaca dihitung di server) ---------- */

function getTrending(limit = 5) {
  return [...cache]
    .sort((a, b) => (b.views || 0) - (a.views || 0) || b.created_at - a.created_at)
    .slice(0, limit);
}

// Mode lokal: menambah penghitung di localStorage. Mode Supabase: penghitung naik di database.
async function addView(id) {
  if (cacheMode === 'local') {
    const a = cache.find((x) => x.id === id);
    if (a) a.views = (a.views || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } else {
    // Increment di Supabase secara atomik via RPC (opsional) atau simple update
    const a = cache.find((x) => x.id === id);
    if (a) {
      await supabase.from('articles').update({ views: (a.views || 0) + 1 }).eq('id', id);
      a.views = (a.views || 0) + 1;
    }
  }
}

// Mengambil satu berita lengkap dari Supabase (dipakai halaman detail)
async function fetchArticle(id) {
  if (cacheMode !== 'supabase') return cache.find((x) => x.id === id) || null;
  try {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (error || !data) return null;

    // Transform snake_case ke camelCase
    const article = {
      id: data.id,
      title: data.title,
      category: data.category,
      author: data.author,
      image: data.image,
      imageCredit: data.image_credit,
      content: data.content,
      views: data.views || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Increment view counter
    await addView(id);

    // Perbarui cache agar data lain (trending, terkait) ikut terbarui
    const i = cache.findIndex((x) => x.id === id);
    if (i >= 0) cache[i] = article; else cache.push(article);
    return article;
  } catch (e) {
    return cache.find((x) => x.id === id) || null;
  }
}

/* ---------- Utilitas ---------- */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const readTime = (text) => Math.max(1, Math.ceil(text.split(/\s+/).length / 200));

const catName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name || slug;

const placeholderImg = (id) => `https://picsum.photos/seed/${encodeURIComponent(id)}/1200/675`;

// Hanya izinkan URL http(s), data URI gambar, atau path relatif upload (hasil upload admin). Selamat itu dipakai placeholder.
const safeUrl = (u) =>
  /^(https?:\/\/|data:image\/(png|jpeg|gif|webp);base64,|uploads\/)/i.test(String(u || '').trim()) ? String(u).trim() : '';

const imgSrc = (a) => safeUrl(a.image) || placeholderImg(a.id);

const excerpt = (text, len = 140) => {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > len ? t.slice(0, len).trimEnd() + '…' : t;
};

/* ---------- Komponen ---------- */

function articleCard(a) {
  return `
    <article class="group min-w-0">
      <a href="#/berita/${esc(a.id)}" class="block overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 aspect-video">
        <img src="${esc(imgSrc(a))}" alt="${esc(a.title)}" width="1200" height="675" loading="lazy" decoding="async"
             class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
      </a>
      <div class="mt-4">
        <span class="text-xs font-semibold uppercase tracking-wider text-red-600">${esc(catName(a.category))}</span>
        <h3 class="mt-1 font-serif text-xl font-bold leading-snug">
          <a href="#/berita/${esc(a.id)}" class="hover:underline underline-offset-4">${esc(a.title)}</a>
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">${esc(excerpt(a.content))}</p>
        <p class="mt-3 text-xs text-neutral-400">${fmtDate(a.createdAt)}</p>
      </div>
    </article>`;
}

function articleGrid(list, cols = 'sm:grid-cols-2 lg:grid-cols-3') {
  return `<div class="grid grid-cols-1 ${cols} gap-x-8 gap-y-12">${list.map(articleCard).join('')}</div>`;
}

const PAGE_SIZE = 6;

// Daftar berita dengan tombol "Muat lebih banyak". Jumlah yang ditampilkan dibawa di URL (?n=)
// sehingga refresh tetap menampilkan jumlah yang sama.
function paginatedGrid(list, basePath, cols) {
  const n = Math.max(PAGE_SIZE, parseInt(currentParams().get('n'), 10) || PAGE_SIZE);
  const visible = list.slice(0, n);
  const hasMore = list.length > n;
  const moreHref = `#${basePath}${basePath.includes('?') ? '&' : '?'}n=${n + PAGE_SIZE}`;

  return `
    ${articleGrid(visible, cols)}
    ${
      hasMore
        ? `<div class="mt-12 text-center"><a href="${moreHref}" class="inline-block rounded-lg border border-neutral-300 dark:border-neutral-700 px-6 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">Muat lebih banyak</a></div>`
        : ''
    }`;
}

function currentParams() {
  return new URLSearchParams(location.hash.split('?')[1] || '');
}

function trendingList() {
  const items = getTrending(5);
  return `
    <ol class="space-y-6">
      ${items
        .map(
          (a, i) => `
        <li class="flex gap-4">
          <span class="font-serif text-3xl font-black leading-none text-neutral-300 dark:text-neutral-700 w-8 shrink-0">${i + 1}</span>
          <div class="min-w-0">
            <span class="text-xs font-semibold uppercase tracking-wider text-red-600">${esc(catName(a.category))}</span>
            <h3 class="mt-1 font-serif font-bold leading-snug">
              <a href="#/berita/${esc(a.id)}" class="hover:underline underline-offset-4">${esc(a.title)}</a>
            </h3>
            <p class="mt-1 text-xs text-neutral-400">${a.views ? `${a.views} kali dibaca` : fmtDate(a.createdAt)}</p>
          </div>
        </li>`
        )
        .join('')}
    </ol>`;
}

function emptyState(text) {
  return `<p class="py-20 text-center text-neutral-500">${esc(text)}</p>`;
}

// Ikon SVG sederhana (stroke/fill mengikuti warna teks)
const svg = (d) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
const svgStroke = (d) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;

const ICONS = {
  WhatsApp: svg('M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'),
  Facebook: svg('M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'),
  X: svg('M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'),
  Telegram: svg('M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'),
  Threads: svg('M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z'),
  LinkedIn: svg('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'),
  Reddit: svg('M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z'),
  Pinterest: svg('M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z'),
  Line: svg('M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314'),
  Email: svgStroke('M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 0l8 7 8-7'),
  Instagram: svg('M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077'),
  Copy: svgStroke('M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1'),
};

// Daftar platform berbagi. URL tujuan dibentuk saat tombol diklik (bukan di HTML),
// sehingga filter pemblokir iklan berbasis URL/domain tidak menghapus tombolnya.
const SHARE_TARGETS = {
  WhatsApp: (t, u) => `https://wa.me/?text=${encodeURIComponent(t + '\n' + u)}`,
  Facebook: (t, u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  X: (t, u) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  Telegram: (t, u) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  Threads: (t, u) => `https://www.threads.net/intent/post?text=${encodeURIComponent(t + '\n' + u)}`,
  LinkedIn: (t, u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
  Reddit: (t, u) => `https://www.reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
  Pinterest: (t, u) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(t)}`,
  Line: (t, u) => `https://line.me/R/share?text=${encodeURIComponent(t + '\n' + u)}`,
  Email: (t, u) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(t + '\n' + u)}`,
};

function shareButtons(a) {
  const link = location.href;
  const btn = 'sbtn';
  const iconBtn = (label) =>
    `<button type="button" data-share="${label}" aria-label="${label}" title="${label}" class="${btn}">${ICONS[label]}</button>`;

  return `
    <div class="flex flex-wrap items-center gap-3" data-title="${esc(a.title)}" data-link="${esc(link)}">
      ${['WhatsApp', 'Facebook', 'X', 'Telegram', 'Threads', 'LinkedIn', 'Reddit', 'Pinterest', 'Line', 'Email']
        .map(iconBtn)
        .join('')}
      <button type="button" data-ig aria-label="Instagram" title="Instagram" class="${btn}">${ICONS.Instagram}</button>
      <button type="button" data-copy="${esc(link)}" aria-label="Salin Tautan" title="Salin Tautan" class="${btn} sbtn-primary">${ICONS.Copy}</button>
    </div>`;
}

// Membuka jendela share. Email memakai tab saat ini, platform lain membuka popup.
function openShare(platform, wrap) {
  const title = wrap.dataset.title;
  const link = wrap.dataset.link;
  const target = SHARE_TARGETS[platform](title, link);
  if (platform === 'Email') {
    window.location.href = target;
    return;
  }
  const w = 640;
  const h = 640;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2;
  window.open(target, `share_${platform}`, `width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`);
}

// Update meta tags untuk artikel spesifik (untuk SEO dan social sharing)
function updateMetaTags(article) {
  const title = article ? `${article.title} - Siberinfo` : 'Siberinfo - Portal Berita Minimalis';
  const description = article ? article.content.substring(0, 150) + '...' : 'Portal berita minimalis dengan informasi terkini, mudah dibaca, dan nyaman dibagikan.';
  const url = article ? `https://siberinfo.com/#/berita/${article.id}` : 'https://siberinfo.com/';
  const image = article && article.image ? imgSrc(article) : 'https://siberinfo.com/og-image.jpg';

  // Update title
  document.title = title;

  // Update atau buat meta tags
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', image);
  updateMetaTag('name', 'twitter:url', url);

  // Update canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.href = url;
  }
}

function updateMetaTag(attr, attrValue, content) {
  let meta = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attr, attrValue);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

/* ---------- Halaman ---------- */

function pageHome() {
  const list = getArticles();
  if (!list.length) return emptyState('Belum ada berita. Silakan tunggu pembaruan berikutnya.');

  const [hero, ...rest] = list;
  return `
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-12 border-b border-neutral-200 dark:border-neutral-800">
      <a href="#/berita/${esc(hero.id)}" class="block min-w-0 overflow-hidden rounded-xl aspect-video bg-neutral-100 dark:bg-neutral-900">
        <img src="${esc(imgSrc(hero))}" alt="${esc(hero.title)}" width="1200" height="675" fetchpriority="high" decoding="async" class="w-full h-full object-cover transition duration-500 hover:scale-105">
      </a>
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-red-600">${esc(catName(hero.category))}</span>
        <h1 class="mt-2 font-serif text-3xl md:text-4xl font-black leading-tight">
          <a href="#/berita/${esc(hero.id)}" class="hover:underline underline-offset-4">${esc(hero.title)}</a>
        </h1>
        <p class="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-400">${esc(excerpt(hero.content, 220))}</p>
        <p class="mt-4 text-xs text-neutral-400">${esc(hero.author || 'Redaksi')} &middot; ${fmtDate(hero.createdAt)}</p>
      </div>
    </section>

    <section class="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 min-w-0">
        ${rest.length ? `
        <div class="flex items-end justify-between mb-8">
          <h2 class="font-serif text-2xl font-bold">Berita Terbaru</h2>
          <a href="#/kategori" class="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition">Lihat kategori &rarr;</a>
        </div>
        ${paginatedGrid(rest, '/', 'sm:grid-cols-2')}` : ''}
      </div>

      <aside class="min-w-0 lg:border-l lg:pl-10 border-neutral-200 dark:border-neutral-800">
        <h2 class="font-serif text-2xl font-bold mb-1">Trending</h2>
        <p class="text-xs text-neutral-500 mb-8">Berita paling banyak dibuka dan dibaca</p>
        ${trendingList()}
      </aside>
    </section>`;
}

function pageKategori(slug) {
  if (slug && !CATEGORIES.some((c) => c.slug === slug)) return pageNotFound();

  const base =
    'px-4 py-1.5 rounded-full text-sm border transition';
  const idle = 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900';
  const active = 'border-transparent bg-neutral-900 text-white dark:bg-white dark:text-neutral-900';

  const chips = [{ slug: '', name: 'Semua' }, ...CATEGORIES]
    .map((c) => {
      const isActive = (slug || '') === c.slug;
      return `<a href="#/kategori${c.slug ? '/' + c.slug : ''}" class="${base} ${isActive ? active : idle}">${esc(c.name)}</a>`;
    })
    .join('');

  const list = getArticles().filter((a) => !slug || a.category === slug);

  return `
    <header class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-wider text-red-600">Kategori</p>
      <h1 class="mt-1 font-serif text-4xl font-black">${slug ? esc(catName(slug)) : 'Semua Berita'}</h1>
    </header>
    <div class="flex flex-wrap gap-2 mb-10">${chips}</div>
    ${list.length ? paginatedGrid(list, slug ? `/kategori/${slug}` : '/kategori') : emptyState('Belum ada berita di kategori ini.')}`;
}

function pageTentang() {
  const block = (title, body) => `
    <section class="mt-10">
      <h2 class="font-serif text-2xl font-bold mb-3">${title}</h2>
      ${body}
    </section>`;

  return `
    <article class="max-w-2xl mx-auto page-enter">
      <p class="text-xs font-semibold uppercase tracking-wider text-red-600">Tentang Kami</p>
      <h1 class="mt-1 font-serif text-4xl md:text-5xl font-black leading-tight">Siberinfo<span class="text-red-600">.</span></h1>
      <p class="mt-6 font-serif text-lg leading-8 text-neutral-700 dark:text-neutral-300">
        Portal Berita Online yang Mengabarkan Informasi A1. Menyajikan Berita Tanpa Unsur Hoax, Sara, dan Ujaran Kebencian.
      </p>

      ${block('Visi', '<p class="leading-relaxed text-neutral-600 dark:text-neutral-400">Menjadi portal berita pilihan masyarakat digital yang mengutamakan kejelasan, kepercayaan, dan kenyamanan membaca.</p>')}

      ${block('Misi', `
        <ol class="list-decimal pl-5 space-y-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>Menyajikan berita yang akurat, berimbang, dan dapat dipertanggungjawabkan.</li>
          <li>Menghadirkan pengalaman membaca yang bersih, nyaman, dan bebas distraksi.</li>
          <li>Mendorong literasi digital dan kemudahan berbagi informasi yang bertanggung jawab.</li>
        </ol>`)}
    </article>`;
}

// `a` sudah diambil oleh route() lewat fetchArticle(), sehingga penghitung baca sudah naik di server
function pageDetail(a) {
  if (!a) return pageNotFound();

  const paragraphs = a.content
    .split(/\n\s*\n/)
    .map((p) => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');

  // Structured Data (JSON-LD) untuk artikel
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": a.title,
    "image": imgSrc(a) || "https://siberinfo.com/og-image.jpg",
    "datePublished": new Date(a.createdAt).toISOString(),
    "dateModified": new Date(a.createdAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": a.author || "Redaksi"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Siberinfo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://siberinfo.com/logo.png"
      }
    },
    "description": a.content.substring(0, 150) + "...",
    "articleSection": catName(a.category),
    "inLanguage": "id-ID",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://siberinfo.com/#/berita/${a.id}`
    }
  };

  // Update meta tags untuk artikel spesifik
  updateMetaTags(a);

  // Breadcrumb navigation
  const breadcrumb = `
    <nav aria-label="Breadcrumb" class="mb-6">
      <ol class="flex items-center gap-2 text-sm text-neutral-500">
        <li><a href="#/" class="hover:text-neutral-900 dark:hover:text-neutral-100 transition">Beranda</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="#/kategori/${esc(a.category)}" class="hover:text-neutral-900 dark:hover:text-neutral-100 transition">${esc(catName(a.category))}</a></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="text-neutral-900 dark:text-neutral-100 font-medium truncate">${esc(a.title.substring(0, 50))}${a.title.length > 50 ? '...' : ''}</li>
      </ol>
    </nav>`;

  return `
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
    <article class="max-w-3xl mx-auto page-enter" data-read>
      ${breadcrumb}
      <a href="#/kategori/${esc(a.category)}" class="text-xs font-semibold uppercase tracking-wider text-red-600 hover:underline">${esc(catName(a.category))}</a>
      <h1 class="mt-3 font-serif text-3xl md:text-5xl font-black leading-tight">${esc(a.title)}</h1>
      <p class="mt-4 text-sm text-neutral-500">
        Oleh ${esc(a.author || 'Redaksi')} &middot; ${fmtDate(a.createdAt)} &middot; ${readTime(a.content)} menit baca
      </p>

      <div class="mt-8 overflow-hidden rounded-xl aspect-video bg-neutral-100 dark:bg-neutral-900">
        <img src="${esc(imgSrc(a))}" alt="${esc(a.title)}" width="1200" height="675" fetchpriority="high" decoding="async" class="w-full h-full object-cover">
      </div>
      ${a.imageCredit ? `<p class="mt-2 text-xs text-neutral-500">${esc(a.imageCredit)}</p>` : ''}

      <div class="article-body mt-10 font-serif text-lg leading-8 text-neutral-800 dark:text-neutral-200">
        ${paragraphs}
      </div>

      <div class="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Bagikan Berita</p>
        ${shareButtons(a)}
      </div>

      ${relatedSection(a)}

      <a href="#/" class="inline-block mt-12 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition">&larr; Kembali ke beranda</a>
    </article>`;
}

// Hingga 3 berita dengan kategori sama, selain artikel yang sedang dibaca.
// Disembunyikan jika tidak ada berita lain di kategori tersebut.
function relatedSection(a) {
  const related = getArticles()
    .filter((x) => x.category === a.category && x.id !== a.id)
    .slice(0, 3);
  if (!related.length) return '';

  return `
    <section class="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <h2 class="font-serif text-2xl font-bold mb-8">Berita Terkait</h2>
      ${articleGrid(related, 'sm:grid-cols-3')}
    </section>`;
}

function pageCari(query) {
  const q = (query || '').trim();
  const norm = q.toLowerCase();
  const results = q
    ? getArticles().filter(
        (a) => a.title.toLowerCase().includes(norm) || a.content.toLowerCase().includes(norm)
      )
    : [];

  return `
    <header class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-wider text-red-600">Pencarian</p>
      <h1 class="mt-1 font-serif text-4xl font-black">Cari Berita</h1>
    </header>
    <form action="#/cari" method="get" role="search" class="flex gap-2 mb-10">
      <input id="search-input" name="q" type="search" value="${esc(q)}" placeholder="Ketik kata kunci..."
             class="flex-1 min-w-0 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600">
      <button type="submit" class="rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">Cari</button>
    </form>
    ${
      !q
        ? emptyState('Masukkan kata kunci untuk mencari berita.')
        : results.length
          ? `<p class="mb-8 text-sm text-neutral-500">${results.length} hasil untuk &ldquo;${esc(q)}&rdquo;</p>${articleGrid(results)}`
          : emptyState(`Tidak ada berita yang cocok dengan "${q}".`)
    }`;
}

function pageNotFound() {
  return `
    <div class="py-24 text-center page-enter">
      <p class="font-serif text-6xl md:text-8xl font-black tracking-tight">SIBERINFO</p>
      <p class="mt-4 text-base md:text-xl text-neutral-400 dark:text-neutral-500 font-medium">MEDIATAMA</p>
      <a href="#/" class="inline-block mt-10 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 text-base font-medium hover:opacity-90 transition">Kembali ke beranda</a>
    </div>`;
}

/* ---------- Routing ---------- */

// Skeleton loading untuk feedback visual saat loading
function showSkeleton() {
  return `
    <div class="max-w-6xl mx-auto">
      <div class="skeleton skeleton-title" style="width: 60%;"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        ${Array(6).fill('').map(() => `
          <div class="skeleton-card">
            <div class="skeleton skeleton-image mb-4"></div>
            <div class="skeleton skeleton-text" style="width: 30%;"></div>
            <div class="skeleton skeleton-title" style="width: 90%;"></div>
            <div class="skeleton skeleton-text" style="width: 100%;"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

async function route() {
  const app = document.getElementById('app');
  if (!app) return;

  // Hash contoh: #/kategori/lingkungan?n=12  ->  path "kategori/lingkungan"
  const path = location.hash.replace(/^#\/?/, '').split('?')[0];
  const parts = path.split('/').filter(Boolean);
  const [section, param] = parts;

  // Show skeleton loading untuk artikel detail
  if (section === 'berita' && param) {
    app.innerHTML = showSkeleton();
  }

  let html;
  if (!section) html = pageHome();
  else if (section === 'kategori') html = pageKategori(param);
  else if (section === 'tentang') html = pageTentang();
  else if (section === 'cari') html = pageCari(new URLSearchParams(location.hash.split('?')[1] || '').get('q'));
  else if (section === 'berita' && param) {
    // Detail: ambil dari server (penghitung baca naik di sana), lalu render
    const id = decodeURIComponent(param);
    const article = await fetchArticle(id);
    html = pageDetail(article);
  } else html = pageNotFound();

  app.innerHTML = html;
  app.classList.remove('page-enter');
  void app.offsetWidth; // restart animasi
  app.classList.add('page-enter');

  // Tandai menu aktif
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === (section || ''));
  });

  window.scrollTo({ top: 0, behavior: 'auto' });
  document.title = titleFor(section, param);
  setMeta(section, param);
  updateReadProgress();
}

// Memperbarui meta description dan og:title sesuai halaman (untuk pratinjau & hasil pencarian)
function setMeta(section, param) {
  const DEFAULT = 'Siberinfo - portal berita minimalis dengan informasi terkini, mudah dibaca, dan nyaman dibagikan.';
  let desc = DEFAULT;
  if (section === 'kategori') {
    const name = param ? catName(param) : 'Semua';
    desc = `Berita terbaru kategori ${name} di Siberinfo.`;
  } else if (section === 'tentang') {
    desc = 'Profil, visi, dan misi Siberinfo, portal berita minimalis yang mengutamakan kenyamanan membaca.';
  } else if (section === 'cari') {
    desc = 'Cari berita di Siberinfo berdasarkan kata kunci.';
  } else if (section === 'berita' && param) {
    const a = getArticles().find((x) => x.id === param);
    if (a) desc = excerpt(a.content, 155);
  }

  const setTag = (selector, attr, value) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = attr;
      el.setAttribute(key, val);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };
  setTag('meta[name="description"]', ['name', 'description'], desc);
  setTag('meta[property="og:title"]', ['property', 'og:title'], document.title);
  setTag('meta[property="og:description"]', ['property', 'og:description'], desc);
}

/* ---------- Reading progress ---------- */

// Hitung persentase artikel yang sudah di-scroll. Bar hanya terlihat di halaman artikel.
function updateReadProgress() {
  const bar = document.getElementById('read-progress');
  if (!bar) return;

  const article = document.querySelector('#app article[data-read]');
  if (!article) {
    bar.style.width = '0';
    return;
  }

  // Mulai dihitung dari tepi atas artikel sampai bagian bawahnya terlihat di layar
  const rect = article.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  const passed = -rect.top;
  let pct = 0;
  if (total > 0) pct = passed / total;
  else pct = passed > 0 ? 1 : 0;
  pct = Math.min(1, Math.max(0, pct));
  bar.style.width = `${(pct * 100).toFixed(2)}%`;
}

let progressRaf = 0;
window.addEventListener(
  'scroll',
  () => {
    if (progressRaf) return;
    progressRaf = requestAnimationFrame(() => {
      progressRaf = 0;
      updateReadProgress();
    });
  },
  { passive: true }
);
window.addEventListener('resize', updateReadProgress);

// Tombol kembali ke atas: muncul setelah scroll lebih dari 600px
const toTopBtn = document.getElementById('to-top');
if (toTopBtn) {
  const toggleToTop = () => toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function titleFor(section, param) {
  if (!section) return 'Siberinfo - Portal Berita Minimalis';
  if (section === 'kategori') return `${param ? catName(param) : 'Kategori'} - Siberinfo`;
  if (section === 'tentang') return 'Tentang Kami - Siberinfo';
  if (section === 'cari') return 'Cari Berita - Siberinfo';
  if (section === 'berita' && param) {
    const a = getArticles().find((x) => x.id === param);
    if (a) return `${a.title} - Siberinfo`;
  }
  return 'Siberinfo';
}

/* ---------- Fitur berbagi ---------- */

let toastTimer;
function toast(message) {
  const el = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!el || !msgEl) return;
  
  msgEl.textContent = message;
  el.classList.remove('opacity-0', 'pointer-events-none');
  el.classList.add('pointer-events-auto');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add('opacity-0', 'pointer-events-none');
    el.classList.remove('pointer-events-auto');
  }, 3000);
}

function hideToast() {
  const el = document.getElementById('toast');
  if (!el) return;
  
  clearTimeout(toastTimer);
  el.classList.add('opacity-0', 'pointer-events-none');
  el.classList.remove('pointer-events-auto');
}


async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // Fallback untuk browser/konteks yang tidak mendukung Clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  toast('Tautan berhasil disalin');
}

function toggleModal(show) {
  const modal = document.getElementById('ig-modal');
  if (!modal) return;
  modal.classList.toggle('hidden', !show);
  modal.classList.toggle('flex', show);
}

// Delegasi event untuk tombol salin & Instagram
document.addEventListener('click', (e) => {
  const shareBtn = e.target.closest('[data-share]');
  if (shareBtn) return openShare(shareBtn.dataset.share, shareBtn.closest('[data-title]'));

  const copyBtn = e.target.closest('[data-copy]');
  if (copyBtn) return copyText(copyBtn.dataset.copy);

  if (e.target.closest('[data-ig]')) return toggleModal(true);
  if (e.target.closest('[data-copy-current]')) return copyText(location.href);
  if (e.target.closest('[data-close-modal]') || e.target.id === 'ig-modal') return toggleModal(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleModal(false);
});

/* ---------- Inisialisasi ---------- */

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      // Simpan preferensi user
      localStorage.setItem('theme', newTheme);
    });
    
    // Load theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Menu hamburger (mobile). Di desktop tombol disembunyikan dan menu tetap tampil biasa.
  const menuBtn = document.getElementById('menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (menuBtn && mainNav) {
    const setOpen = (open) => {
      mainNav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => setOpen(!mainNav.classList.contains('is-open')));
    mainNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  // Toast close button
  const toastClose = document.getElementById('toast-close');
  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }

  if (document.getElementById('app')) {
    window.addEventListener('hashchange', route);
    // Muat daftar berita dari server dulu, baru render halaman pertama
    loadArticles().then(route);
  }
});
