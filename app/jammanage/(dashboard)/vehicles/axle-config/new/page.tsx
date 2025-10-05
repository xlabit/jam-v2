import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleAxleConfigForm } from '../form';

export const metadata = {
  title: 'New Axle Configuration | Jain Automart Admin',
};

export default async function NewVehicleAxleConfigPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehicleAxleConfigForm />;
}
