import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleEmissionNormForm } from '../form';

export const metadata = {
  title: 'New Emission Norm | Jain Automart Admin',
};

export default async function NewVehicleEmissionNormPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehicleEmissionNormForm />;
}
