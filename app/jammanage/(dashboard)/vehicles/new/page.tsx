import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleForm } from '@/components/jammanage/VehicleForm';

export const metadata = {
  title: 'Add New Vehicle | Jain Automart Admin',
};

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehicleForm />;
}
