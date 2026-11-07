import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('horologe_session')?.value;

  // Protect account routes
  if (pathname.startsWith('/account')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and visiting auth pages, send to /account
  if (
    pathname === '/login' ||
    pathname === '/signin' ||
    pathname === '/register' ||
    pathname === '/signup'
  ) {
    if (session) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/login', '/signin', '/register', '/signup'],
};

