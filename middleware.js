import { NextResponse } from 'next/server'

// Basic list of common bots
const BOT_UA_PARTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'applebot',
  'petalbot',
]

export function middleware(request) {
  const { pathname } = request.nextUrl
  const ua = (request.headers.get('user-agent') || '').toLowerCase()

  if (pathname.startsWith('/dashboard')) {
    const isBot = BOT_UA_PARTS.some(part => ua.includes(part))
    if (isBot) {
      return new NextResponse('Not Found', { status: 404 })
    }
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
    res.headers.set('Cache-Control', 'no-store')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
