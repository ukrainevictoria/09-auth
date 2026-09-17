import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/app/api/api';
import { logErrorResponse } from '@/app/api/_utils/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      return NextResponse.json(
        { message: error.response?.data?.message || 'Server error' },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const response = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      return NextResponse.json(
        { message: error.response?.data?.message || 'Server error' },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
