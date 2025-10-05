import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleTransmissionForm } from '../form';

export const metadata = {
  title: 'New Transmission | Jain Automart Admin',
};

export default async function NewVehicleTransmissionPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return <VehicleTransmissionForm />;
}
