/**
 * Cloudflare Worker - Dynamic Sitemap Generator for Siberinfo
 * Deploy ke Cloudflare Workers untuk generate sitemap.xml on-the-fly
 * 
 * Setup:
 * 1. Buat Worker di Cloudflare Dashboard
 * 2. Set environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
 * 3. Route: siberinfo.id/sitemap.xml -> Worker ini
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Hanya handle /sitemap.xml
    if (url.pathname !== '/sitemap.xml') {
      return new Response('Not Found', { status: 404 });
    }

    try {
      // Fetch articles dari Supabase
      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/articles?select=slug,created_at,updated_at&order=created_at.desc&limit=2000`,
        {
          headers: {
            'apikey': env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }

      const articles = await response.json();
      const today = new Date().toISOString().split('T')[0];

      // Static pages
      const staticPages = [
        { url: 'https://siberinfo.id/', changefreq: 'daily', priority: '1.0' },
        { url: 'https://siberinfo.id/#/kategori', changefreq: 'daily', priority: '0.8' },
        { url: 'https://siberinfo.id/#/tentang', changefreq: 'monthly', priority: '0.4' },
        { url: 'https://siberinfo.id/#/kontak', changefreq: 'monthly', priority: '0.4' },
        { url: 'https://siberinfo.id/#/privacy-policy', changefreq: 'yearly', priority: '0.3' },
        { url: 'https://siberinfo.id/#/terms-of-service', changefreq: 'yearly', priority: '0.3' },
        { url: 'https://siberinfo.id/#/sitemap', changefreq: 'weekly', priority: '0.5' },
      ];

      const articleUrls = articles.map(a => ({
        loc: `https://siberinfo.id/berita/${a.slug}`,
        lastmod: (a.updated_at || a.created_at).split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      }));

      const staticUrls = staticPages.map(p => ({
        loc: p.url,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: p.changefreq,
        priority: p.priority
      }));

      const allUrls = [...staticUrls, ...articleUrls];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${[...staticUrls, ...articleUrls].map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Robots-Tag': 'index, follow'
        }
      });

    } catch (error) {
      console.error('Sitemap generation error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};