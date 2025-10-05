import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleModelForm } from '../form';

export const metadata = {
  title: 'New Vehicle Model | Jain Automart Admin',
};

export default async function NewVehicleModelPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehicleModelForm />;
}
