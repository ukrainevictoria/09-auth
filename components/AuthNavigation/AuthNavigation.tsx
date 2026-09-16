'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

export default function AuthNavigation() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (isAuthenticated) {
    return (
      <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <span>{user?.email || user?.username}</span>
        <Link href="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    );
  }

  return (
    <nav style={{ display: 'flex', gap: '15px' }}>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
    </nav>
  );
}
