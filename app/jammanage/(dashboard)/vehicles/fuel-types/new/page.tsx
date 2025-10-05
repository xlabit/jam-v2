import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleFuelTypeForm } from '../form';

export const metadata = {
  title: 'New Fuel Type | Jain Automart Admin',
};

export default async function NewVehicleFuelTypePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehicleFuelTypeForm />;
}
