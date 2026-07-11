import { RegisterForm } from '@/components/RegisterForm';

export const metadata = { title: 'Créer un compte — Le Suffète Classic' };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">CRÉER UN COMPTE</h1>
      <div className="section-title-underline" />
      <RegisterForm />
    </div>
  );
}
