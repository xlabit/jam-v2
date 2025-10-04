import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import LoginForm from '@/components/jammanage/LoginForm';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Site Owner Login | Jain Automart',
  description: 'Secure login for site administrators',
};

export default async function JamManagePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'owner') {
    redirect('/jammanage/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-[400px] m-5">
        <CardContent className="p-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
