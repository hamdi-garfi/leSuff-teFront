import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/ResetPasswordForm';

export const metadata = { title: 'Réinitialiser le mot de passe — Le Suffète Classic' };

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">NOUVEAU MOT DE PASSE</h1>
      <div className="section-title-underline" />
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
