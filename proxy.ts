import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token')?.value;

  const isPrivateKey = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicKey = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateKey && !sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && sessionToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
