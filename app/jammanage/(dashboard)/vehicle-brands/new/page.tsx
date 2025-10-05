import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleBrandForm } from '@/components/jammanage/VehicleBrandForm';

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
      <VehicleBrandForm />
    </div>
  );
}
