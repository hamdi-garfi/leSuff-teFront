import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { ProfileForm } from '@/components/ProfileForm';
import { PasswordChangeForm } from '@/components/PasswordChangeForm';

export const metadata = { title: 'Mon profil — Le Suffète Classic' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte/profil');
  }

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <p className="text-xs text-foreground/40 mb-8">
        <Link href="/compte" className="hover:text-gold">
          Mon compte
        </Link>{' '}
        / <span className="text-foreground/70">Mon profil</span>
      </p>
      <h1 className="section-title">MON PROFIL</h1>
      <div className="section-title-underline" />
      <div className="space-y-8">
        <ProfileForm user={user} />
        <PasswordChangeForm />
      </div>
    </div>
  );
}
