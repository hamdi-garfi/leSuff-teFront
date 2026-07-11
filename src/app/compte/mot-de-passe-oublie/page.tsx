import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';

export const metadata = { title: 'Mot de passe oublié — Le Suffète Classic' };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">MOT DE PASSE OUBLIÉ</h1>
      <div className="section-title-underline" />
      <ForgotPasswordForm />
    </div>
  );
}
