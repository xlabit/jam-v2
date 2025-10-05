import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

export const metadata = {
  title: 'New Vehicle Brand | Jain Automart Admin',
};

export default async function NewVehicleBrandPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold">New Vehicle Brand</h1>
        <p className="text-muted-foreground">Vehicle Brand form coming soon...</p>
      </div>
    </div>
  );
}
