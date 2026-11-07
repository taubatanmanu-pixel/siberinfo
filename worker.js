addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const SUPABASE_URL = 'https://nabxsudnyefznejzmaiu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_E2CgsuqhLsrT6pjPIyz_Ng_8XTFzoh9';
const ORIGIN = 'https://taubatanmanu-pixel.github.io/siberinfo';

// Ekstensi file asset: selalu diambil dari root origin, apa pun path halamannya.
// (Pada URL artikel /berita/<slug>, CSS relatif diminta sebagai /berita/tailwind.css
//  — kalau diteruskan apa adanya, GitHub Pages mengembalikan HTML homepage dan
//  browser menolak stylesheet-nya. Maka diekstrak nama filenya saja.)
const ASSET_RE = /\/([^/?#]+\.(?:css|js|mjs|png|jpe?g|webp|gif|svg|json|ico|txt|xml|woff2?|ttf))$/i;

async function handleRequest(request) {
  const url = new URL(request.url);
  const ua = (request.headers.get('User-Agent') || '').toLowerCase();
  const isBot = /whatsapp|telegram|facebookexternalhit|twitterbot|linkedinbot|pinterest|slack|discord|line-poker|skypeuripreview/.test(ua);

  // ─── 1. STATIC ASSET ───
  // Contoh: /berita/tailwind.css -> ORIGIN/tailwind.css
  const assetMatch = url.pathname.match(ASSET_RE);
  if (assetMatch) {
    const assetUrl = ORIGIN + '/' + assetMatch[1] + url.search;
    return fetch(assetUrl);
  }

  // ─── 2. SITEMAP / ROBOTS / MANIFEST dari root ───
  if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt' || url.pathname === '/manifest.json') {
    return fetch(ORIGIN + url.pathname);
  }

  // Ambil kunci artikel: /berita/<slug>  atau  ?slug=  atau  ?id= (lama)
  const pathMatch = url.pathname.match(/^\/berita\/([^/]+)\/?$/);
  let key = pathMatch ? decodeURIComponent(pathMatch[1]) : (url.searchParams.get('slug') || url.searchParams.get('id'));
  const isUuid = key ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key) : false;

  // BOT + ada kunci artikel -> kirim HTML dengan OG tags
  if (isBot && key) {
    try {
      const filter = isUuid ? 'id=eq.' + key : 'slug=eq.' + encodeURIComponent(key);
      const res = await fetch(SUPABASE_URL + '/rest/v1/articles?' + filter + '&select=title,image,content,slug&limit=1', {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY
        }
      });
      const data = await res.json();
      if (data && data[0]) {
        const art = data[0];
        const imageUrl = art.image || 'https://siberinfo.id/og-image.png';
        const title = art.title || 'Siberinfo';
        const raw = (art.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const desc = raw ? raw.substring(0, 160) + '...' : 'Baca berita terbaru di Siberinfo.id';
        const canonical = 'https://siberinfo.id/berita/' + (art.slug || key);

        const html = '<!DOCTYPE html>\n' +
          '<html lang="id">\n' +
          '<head>\n' +
          '<meta charset="UTF-8">\n' +
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
          '<title>' + title + ' - Siberinfo</title>\n' +
          '<link rel="canonical" href="' + canonical + '">\n' +
          '<meta name="description" content="' + desc + '">\n' +
          '<meta property="og:type" content="article">\n' +
          '<meta property="og:title" content="' + title + '">\n' +
          '<meta property="og:description" content="' + desc + '">\n' +
          '<meta property="og:image" content="' + imageUrl + '">\n' +
          '<meta property="og:image:width" content="1200">\n' +
          '<meta property="og:image:height" content="630">\n' +
          '<meta property="og:url" content="' + canonical + '">\n' +
          '<meta property="og:site_name" content="Siberinfo">\n' +
          '<meta property="og:locale" content="id_ID">\n' +
          '<meta name="twitter:card" content="summary_large_image">\n' +
          '<meta name="twitter:title" content="' + title + '">\n' +
          '<meta name="twitter:description" content="' + desc + '">\n' +
          '<meta name="twitter:image" content="' + imageUrl + '">\n' +
          '<meta name="twitter:url" content="' + canonical + '">\n' +
          '</head>\n' +
          '<body>\n' +
          '<h1>' + title + '</h1>\n' +
          '</body>\n' +
          '</html>';

        return new Response(html, {
          headers: { 'content-type': 'text/html; charset=utf-8' }
        });
      }
    } catch (e) {
      console.error('Worker error:', e);
    }
  }

  // MANUSIA -> teruskan ke GitHub Pages (URL tetap bersih, index.html dimuat, SPA baca path/slug)
  return fetch(ORIGIN + url.search);
}
