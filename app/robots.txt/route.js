export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin/dashboard pages
Disallow: /dashboard
Disallow: /api/

# Allow specific API endpoints for indexing
Allow: /api/catalogues
Allow: /api/banners

# Sitemap location
Sitemap: https://katalog.undagicorp.com/sitemap.xml

# Crawl delay
Crawl-delay: 10

# Popular search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 5

User-agent: Bingbot
Allow: /
Crawl-delay: 10

User-agent: Slurp
Allow: /
Crawl-delay: 10`

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
