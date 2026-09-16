import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/api/api';
import { AxiosError } from 'axios';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await api.get('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Server error' },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const body = await request.json();

    const response = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Server error' },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
