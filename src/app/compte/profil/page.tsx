import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { ProfileForm } from '@/components/ProfileForm';
import { PasswordChangeForm } from '@/components/PasswordChangeForm';
import { AccountTabs } from '@/components/AccountTabs';

export const metadata = { title: 'Mon profil — Le Suffète Classic' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte/profil');
  }

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON COMPTE</h1>
      <div className="section-title-underline" />
      <AccountTabs />
      <h2 className="text-xs tracking-widest2 text-foreground/60 mb-6">MON PROFIL</h2>
      <div className="space-y-8">
        <ProfileForm user={user} />
        <PasswordChangeForm />
      </div>
    </div>
  );
}
