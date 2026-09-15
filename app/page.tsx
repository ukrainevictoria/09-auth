import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Welcome to NoteHub App</h1>
          <p>Manage your personal notes securely and effectively.</p>
        </div>

        <div className={styles.ctas}>
          <Link className={styles.primary} href="/sign-in">
            Sign In
          </Link>
          <Link className={styles.secondary} href="/sign-up">
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
