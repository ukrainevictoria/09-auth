import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api/api';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const response = await api.get('/users/me', {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    return NextResponse.json(
      { message: err.response?.data?.message || 'Server error' },
      { status: err.response?.status || 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const body = await request.json();
    const response = await api.patch('/users/me', body, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    return NextResponse.json(
      { message: err.response?.data?.message || 'Server error' },
      { status: err.response?.status || 500 },
    );
  }
}
