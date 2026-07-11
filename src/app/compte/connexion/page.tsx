import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';

export const metadata = { title: 'Connexion — Le Suffète Classic' };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">CONNEXION</h1>
      <div className="section-title-underline" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
