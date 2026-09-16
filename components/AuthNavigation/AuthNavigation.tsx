'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      router.push('/sign-in'); // або '/login', залежно від назви вашого роуту
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Logout error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected logout error:', error);
      }
    }
  };

  return (
    <nav className={css.nav}>
      {isAuthenticated ? (
        <>
          <Link href="/profile" className={css.link}>
            Profile
          </Link>
          <button type="button" onClick={handleLogout} className={css.button}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/sign-up" className={css.link}>
            Register
          </Link>
          <Link href="/sign-in" className={css.link}>
            Login
          </Link>
        </>
      )}
    </nav>
  );
}
