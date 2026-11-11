import type { Metadata } from 'next';
import UserProfileWidget from '../../widgets/UserProfile';

export const metadata: Metadata = {
  title: 'My Profile & Business Account',
  description: 'Manage your verified business profile, active RFQs, quotes, saved deals, and surplus inventory listings on Surplus Market.',
  alternates: {
    canonical: 'https://www.surplusmarket.com/profile',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50/60">
      <UserProfileWidget />
    </main>
  );
}
