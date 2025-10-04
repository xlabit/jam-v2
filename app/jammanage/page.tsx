import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import LoginForm from '@/components/jammanage/LoginForm';

export const metadata = {
  title: 'Site Owner Login | Jain Automart',
  description: 'Secure login for site administrators',
};

export default async function JamManagePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'owner') {
    redirect('/jammanage/dashboard');
  }

  return <LoginForm />;
}
