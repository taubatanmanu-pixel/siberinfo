/**
 * Sitemap Generator for Siberinfo
 * Generates dynamic sitemap.xml from Supabase articles
 * Usage: node generate-sitemap.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase config - gunakan environment variables atau config lokal
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nabxsudnyefznejzmaiu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ SUPABASE_ANON_KEY environment variable diperlukan');
  console.log('Usage: SUPABASE_ANON_KEY=your_key node generate-sitemap.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://siberinfo.id';
const OUTPUT_FILE = path.join(__dirname, 'sitemap.xml');

const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/#/kategori', changefreq: 'daily', priority: '0.8' },
  { url: '/#/tentang', changefreq: 'monthly', priority: '0.4' },
  { url: '/#/kontak', changefreq: 'monthly', priority: '0.4' },
  { url: '/#/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { url: '/#/terms-of-service', changefreq: 'yearly', priority: '0.3' },
  { url: '/#/sitemap', changefreq: 'weekly', priority: '0.5' },
];

async function generateSitemap() {
  console.log('🔄 Mengambil artikel dari Supabase...');
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('slug, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(2000);

  if (error) {
    console.error('❌ Error fetching articles:', error.message);
    process.exit(1);
  }

  console.log(`✅ Ditemukan ${articles.length} artikel`);

  const today = new Date().toISOString().split('T')[0];
  const staticUrls = STATIC_PAGES.map(p => ({
    loc: `https://siberinfo.id${p.url}`,
    lastmod: today,
    changefreq: p.changefreq,
    priority: p.priority
  }));

  const articleUrls = articles.map(a => ({
    loc: `https://siberinfo.id/berita/${a.slug}`,
    lastmod: (a.updated_at || a.created_at).split('T')[0],
    changefreq: 'weekly',
    priority: '0.9'
  }));

  const allUrls = [...staticUrls, ...articleUrls];

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  const xmlFooter = '</urlset>';

  const urlEntries = allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  const xml = `${xmlHeader}
${urlEntries}
${xmlFooter}`;

  fs.writeFileSync(OUTPUT_FILE, xml);
  console.log(`✅ Sitemap berhasil dibuat: ${OUTPUT_FILE}`);
  console.log(`📊 Total URL: ${allUrls.length} (${STATIC_PAGES.length} statis + ${articles.length} artikel)`);
}

generateSitemap().catch(console.error);