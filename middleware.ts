import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/jammanage')) {
    const publicPaths = ['/jammanage'];
    const isPublicPath = publicPaths.includes(pathname);
    const isAuthRoute = pathname.startsWith('/api/auth');

    if (isPublicPath || isAuthRoute) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== 'owner') {
      const url = new URL('/jammanage', request.url);
      url.searchParams.set('error', 'Session expired, please sign in again.');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/jammanage/:path*'],
};
