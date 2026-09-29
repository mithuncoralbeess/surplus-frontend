import type { Metadata } from 'next';
import UserProfileWidget from '../../widgets/UserProfile';

export const metadata: Metadata = {
  title: 'My Profile & Business Account | Surplus Market',
  description: 'Manage your verified business profile, active RFQs, quotes, saved deals, and surplus inventory listings on Surplus Market.',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50/60">
      <UserProfileWidget />
    </main>
  );
}
