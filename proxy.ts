import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const pathname = request.nextUrl.pathname;
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = false;
  let newCookiesToSet: string[] = [];

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    try {
      const sessionRes = await checkSession();
      if (sessionRes && sessionRes.status === 200) {
        isAuthenticated = true;
        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          newCookiesToSet = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Перенаправлення неаутентифікованих з приватних маршрутів
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Перенаправлення аутентифікованих з публічних маршрутів на головну '/'
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  // Оновлюємо куки, якщо вони були повернуті з підтвердження сесії
  if (newCookiesToSet.length > 0) {
    newCookiesToSet.forEach((cookieStr) => {
      response.headers.append('Set-Cookie', cookieStr);
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
