import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehiclesClient } from './client';

export const metadata = {
  title: 'Vehicles | Jain Automart Admin',
};

export default async function VehiclesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehiclesClient />;
}
