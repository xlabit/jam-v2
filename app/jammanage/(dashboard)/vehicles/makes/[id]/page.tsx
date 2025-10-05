import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleMakeForm } from '../form';

export const metadata = {
  title: 'Edit Vehicle Make | Jain Automart Admin',
};

export default async function EditVehicleMakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const make = await prisma.vehicleMake.findUnique({
    where: { id },
  });

  if (!make) {
    redirect('/jammanage/vehicles/makes');
  }

  return <VehicleMakeForm make={make} />;
}
