/* ===== Siberinfo - admin.js =====
 * Logika login admin, form pembuatan & edit berita, dan hapus berita.
 * Data menggunakan Supabase. Autentikasi admin sederhana (localStorage).
 */

// Kredensial admin (ubah password ini!)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Panggilan API (Supabase untuk data, localStorage untuk auth)
async function api(action, body) {
  // Autentikasi sederhana via localStorage
  if (action === 'login') {
    if (body.username === ADMIN_CREDENTIALS.username && body.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('siberinfo_admin', 'true');
      return { ok: true };
    }
    throw new Error('Username atau password salah.');
  }
  
  if (action === 'logout') {
    localStorage.removeItem('siberinfo_admin');
    return { ok: true };
  }
  
  if (action === 'me') {
    return { admin: localStorage.getItem('siberinfo_admin') === 'true' };
  }

  // Aksi CRUD database (Supabase)
  if (action === 'articles&limit=100') {
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { items: data };
  }
  
  if (action === 'save') {
    const { id, ...articleData } = body;
    const cleanData = Object.fromEntries(Object.entries(articleData).filter(([_, v]) => v !== undefined));
    if (id) {
      const { error } = await supabase.from('articles').update(cleanData).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('articles').insert({ ...cleanData, id: Math.random().toString(36).substr(2, 9) });
      if (error) throw error;
    }
    return { ok: true };
  }
  
  if (action === 'delete') {
    const { error } = await supabase.from('articles').delete().eq('id', body.id);
    if (error) throw error;
    return { ok: true };
  }

  throw new Error('Aksi tidak dikenal.');
}

// Upload gambar ke Supabase Storage
async function resolveImage() {
  const mode = document.querySelector('input[name="imageMode"]:checked').value;
  if (mode === 'url') return $('image-url').value.trim();

  const file = $('image-file').files[0];
  if (!file) return '';

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substr(2, 12)}.${fileExt}`;
  
  const { error } = await supabase.storage.from('uploads').upload(fileName, file);
  if (error) throw error;
  
  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}


let isAdmin = false;
const MAX_IMAGE_WIDTH = 1200;

const $ = (id) => document.getElementById(id);

// ID berita yang sedang diedit. null berarti mode buat berita baru.
let editingId = null;

/* ---------- Tampilan ---------- */

// Menentukan login atau dashboard berdasarkan sesi di server
async function showView() {
  try {
    isAdmin = !!(await api('me'))?.admin;
  } catch (e) {
    isAdmin = false;
  }
  $('login-view').classList.toggle('hidden', isAdmin);
  $('dashboard-view').classList.toggle('hidden', !isAdmin);
  if (isAdmin) await refreshList();
}

// Memuat ulang daftar berita dari server (untuk panel kelola)
async function refreshList() {
  const data = await api('articles&limit=100');
  adminList = data.items || [];
  renderManage();
}
let adminList = [];

function showMsg(text, isError = true) {
  const el = $('form-msg');
  el.textContent = text;
  el.className = `text-sm ${isError ? 'text-red-600' : 'text-green-600'}`;
  el.classList.toggle('hidden', !text);
}

function syncImageMode() {
  const mode = document.querySelector('input[name="imageMode"]:checked').value;
  $('image-url-wrap').classList.toggle('hidden', mode !== 'url');
  $('image-file-wrap').classList.toggle('hidden', mode !== 'upload');
  updatePreview();
}

function updatePreview() {
  const img = $('image-preview');
  const mode = document.querySelector('input[name="imageMode"]:checked').value;
  if (mode === 'url') {
    const url = $('image-url').value.trim();
    img.src = url;
    img.classList.toggle('hidden', !url);
  } else {
    const file = $('image-file').files[0];
    if (!file) {
      img.classList.add('hidden');
      img.removeAttribute('src');
      return;
    }
    img.src = URL.createObjectURL(file);
    img.classList.remove('hidden');
  }
}

/* ---------- Gambar ---------- */

// Mengubah file gambar menjadi data URL yang sudah diperkecil (hemat localStorage)
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('File gambar tidak valid.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_WIDTH / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Mengembalikan null jika user tidak memilih gambar baru (dipakai saat edit)
async function getImageData() {
  const mode = document.querySelector('input[name="imageMode"]:checked').value;
  if (mode === 'url') return $('image-url').value.trim();

  const file = $('image-file').files[0];
  if (!file) return null;
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
  if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`Ukuran gambar maksimal ${MAX_FILE_MB} MB.`);
  return fileToDataURL(file);
}

/* ---------- Validasi & penghitung ---------- */

const TITLE_MAX = 150;
const CONTENT_MIN = 100;
const CONTENT_MAX = 20000;

// Form dianggap "kotor" jika isinya berbeda dengan keadaan terakhir saat dimuat/disimpan
let formDirty = false;
let formSnapshot = '';

function formState() {
  return JSON.stringify([
    $('title').value,
    $('category').value,
    $('author').value,
    $('content').value,
    $('image-url').value,
    $('image-file').files.length,
  ]);
}

function markClean() {
  formSnapshot = formState();
  formDirty = false;
}

function updateCounters() {
  const t = $('title').value.trim().length;
  const c = $('content').value.trim().length;
  $('title-count').textContent = `${t}/${TITLE_MAX}`;
  $('content-count').textContent =
    c < CONTENT_MIN
      ? `${c} karakter (minimal ${CONTENT_MIN})`
      : `${c} karakter (maksimal ${CONTENT_MAX.toLocaleString('id-ID')})`;
  $('content-count').classList.toggle('text-red-600', c > 0 && c < CONTENT_MIN);
}

// Memastikan URL gambar bisa dimuat sebelum disimpan (mencegah gambar rusak di beranda)
function checkImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(false), 8000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    img.src = url;
  });
}

// Mengembalikan pesan error atau '' jika valid. Validasi gambar URL bersifat async.
async function validateForm() {
  const title = $('title').value.trim();
  const content = $('content').value.trim();

  if (!title) return 'Judul berita wajib diisi.';
  if (title.length > TITLE_MAX) return `Judul maksimal ${TITLE_MAX} karakter.`;
  if (!content) return 'Isi berita wajib diisi.';
  if (content.length < CONTENT_MIN) return `Isi berita minimal ${CONTENT_MIN} karakter.`;
  if (content.length > CONTENT_MAX) return `Isi berita maksimal ${CONTENT_MAX.toLocaleString('id-ID')} karakter.`;

  const mode = document.querySelector('input[name="imageMode"]:checked').value;
  if (mode === 'url') {
    const url = $('image-url').value.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url)) return 'URL gambar harus diawali http:// atau https://.';
      const ok = await checkImageUrl(url);
      if (!ok) return 'Gambar dari URL tersebut tidak bisa dimuat. Periksa kembali tautannya.';
    }
  }
  return '';
}

/* ---------- Mode edit ---------- */

function setFormMode(article) {
  editingId = article ? article.id : null;
  const editing = !!article;

  $('form-title').textContent = editing ? 'Edit Berita' : 'Tulis Berita Baru';
  $('submit-btn').textContent = editing ? 'Simpan Perubahan' : 'Terbitkan Berita';
  $('cancel-edit').classList.toggle('hidden', !editing);
  $('image-hint').textContent = editing
    ? 'Kosongkan jika tidak ingin mengubah gambar. Gambar lama akan dipertahankan.'
    : 'Gambar otomatis diperkecil agar hemat penyimpanan (maks. 5 MB).';

  if (editing) {
    $('title').value = article.title;
    $('category').value = article.category;
    $('author').value = article.author || '';
    $('content').value = article.content;

    // Jika gambar berupa data URL (hasil upload), pilih mode upload agar jelas
    const isDataUrl = (article.image || '').startsWith('data:');
    document.querySelector(`input[name="imageMode"][value="${isDataUrl ? 'upload' : 'url'}"]`).checked = true;
    $('image-url').value = isDataUrl ? '' : article.image || '';
    $('image-file').value = '';
    syncImageMode();
    if (isDataUrl) {
      $('image-preview').src = article.image;
      $('image-preview').classList.remove('hidden');
    }

    $('article-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    $('article-form').reset();
    syncImageMode();
  }

  updateCounters();
  markClean();
}

function startEdit(id) {
  const article = adminList.find((a) => a.id === id);
  if (!article) return;
  showMsg('', true);
  setFormMode(article);
}

function cancelEdit() {
  showMsg('', true);
  setFormMode(null);
}

/* ---------- Simpan berita (buat & edit) ---------- */

// Mengembalikan URL gambar untuk disimpan: hasil upload file, URL dari input, atau '' (tidak diubah)
async function resolveImage() {
  const mode = document.querySelector('input[name="imageMode"]:checked').value;
  if (mode === 'url') return $('image-url').value.trim();

  const file = $('image-file').files[0];
  if (!file) return '';
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
  if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`Ukuran gambar maksimal ${MAX_FILE_MB} MB.`);

  const form = new FormData();
  form.append('file', file);
  const res = await fetch('api/index.php?action=upload', {
    method: 'POST',
    headers: { 'X-Requested-With': 'siberinfo' },
    body: form,
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar.');
  return data.url;
}

async function handleSubmit(e) {
  e.preventDefault();
  showMsg('', true);

  const title = $('title').value.trim();
  const content = $('content').value.trim();
  const category = $('category').value;
  const author = $('author').value.trim() || 'Redaksi';

  const submitBtn = $('submit-btn');
  submitBtn.disabled = true;
  showMsg('Memeriksa data...', false);

  try {
    const error = await validateForm();
    if (error) return showMsg(error);

    // Gambar: upload file ke server (mendapat URL), atau URL yang diketik admin
    const newImage = await resolveImage();

    await api('save', {
      id: editingId || '',
      title,
      category,
      author,
      image: newImage, // kosong = pertahankan gambar lama (saat edit)
      content,
    });

    const wasEditing = !!editingId;
    setFormMode(null);
    await refreshList();
    showMsg(
      wasEditing ? 'Perubahan berita berhasil disimpan.' : 'Berita berhasil diterbitkan dan langsung tampil di beranda.',
      false
    );
  } catch (err) {
    showMsg(err.message || 'Terjadi kesalahan.');
  } finally {
    submitBtn.disabled = false;
  }
}

/* ---------- Kelola berita ---------- */

function renderManage() {
  const list = adminList;
  $('count').textContent = list.length;
  $('manage-list').innerHTML = list.length
    ? list
        .map(
          (a) => `
        <li class="py-4 flex items-center justify-between gap-4 ${a.id === editingId ? 'bg-neutral-50 dark:bg-neutral-900 -mx-3 px-3 rounded-lg' : ''}">
          <div class="min-w-0">
            <p class="font-medium truncate">${esc(a.title)}</p>
            <p class="text-xs text-neutral-500">
              ${esc(catName(a.category))} &middot; ${fmtDate(a.createdAt)}${a.updatedAt ? ` &middot; diedit ${fmtDate(a.updatedAt)}` : ''}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <a href="index.html#/berita/${esc(a.id)}" target="_blank" rel="noopener"
               class="rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">Lihat</a>
            <button type="button" data-edit="${esc(a.id)}"
                    class="rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">Edit</button>
            <button type="button" data-delete="${esc(a.id)}"
                    class="rounded-lg border border-red-200 dark:border-red-900 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition">Hapus</button>
          </div>
        </li>`
        )
        .join('')
    : '<li class="py-4 text-sm text-neutral-500">Belum ada berita.</li>';
}

/* ---------- Inisialisasi & event ---------- */

document.addEventListener('DOMContentLoaded', () => {
  // Isi pilihan kategori
  $('category').innerHTML = CATEGORIES.map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`).join('');

  // Login
  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.submitter || e.target.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      await api('login', { username: $('username').value.trim(), password: $('password').value });
      $('login-error').classList.add('hidden');
      e.target.reset();
      await showView();
    } catch (err) {
      $('password').value = '';
      $('login-error').textContent = err.message || 'Username atau password salah.';
      $('login-error').classList.remove('hidden');
    } finally {
      btn.disabled = false;
    }
  });

  $('logout-btn').addEventListener('click', async () => {
    try { await api('logout', {}); } catch (e) { /* sesi tetap dibersihkan di klien */ }
    isAdmin = false;
    setFormMode(null);
    await showView();
  });

  // Form berita
  $('article-form').addEventListener('submit', handleSubmit);

  // Penghitung karakter & deteksi perubahan (untuk peringatan saat meninggalkan halaman)
  const onFormInput = () => {
    updateCounters();
    formDirty = formState() !== formSnapshot;
  };
  ['title', 'category', 'author', 'content', 'image-url'].forEach((id) =>
    $(id).addEventListener('input', onFormInput)
  );
  $('category').addEventListener('change', onFormInput);
  $('image-file').addEventListener('change', onFormInput);
  document.querySelectorAll('input[name="imageMode"]').forEach((r) => r.addEventListener('change', onFormInput));

  // Peringatan jika meninggalkan halaman dengan perubahan yang belum disimpan
  window.addEventListener('beforeunload', (e) => {
    if (formDirty && !$('dashboard-view').classList.contains('hidden')) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
  updateCounters();
  markClean();
  $('reset-btn').addEventListener('click', () => {
    // Reset saat mengedit berarti kembali ke data berita asli, bukan form kosong
    setTimeout(() => {
      if (editingId) {
        startEdit(editingId);
      } else {
        showMsg('', true);
        syncImageMode();
      }
    }, 0);
  });
  $('cancel-edit').addEventListener('click', cancelEdit);

  document.querySelectorAll('input[name="imageMode"]').forEach((r) => r.addEventListener('change', syncImageMode));
  $('image-url').addEventListener('input', updatePreview);
  $('image-file').addEventListener('change', updatePreview);

  // Aksi edit & hapus berita
  $('manage-list').addEventListener('click', (e) => {
    const editId = e.target.dataset.edit;
    if (editId) return startEdit(editId);

    const delId = e.target.dataset.delete;
    if (!delId || !confirm('Hapus berita ini secara permanen?')) return;
    api('delete', { id: delId })
      .then(() => {
        if (delId === editingId) setFormMode(null);
        return refreshList();
      })
      .catch((err) => showMsg(err.message || 'Gagal menghapus berita.'));
  });

  showView();
});
