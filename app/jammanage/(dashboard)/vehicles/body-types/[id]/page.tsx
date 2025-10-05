import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleBodyTypeForm } from '../form';

export const metadata = {
  title: 'Edit Vehicle Body Type | Jain Automart Admin',
};

export default async function EditVehicleBodyTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const bodyType = await prisma.vehicleBodyType.findUnique({
    where: { id },
  });

  if (!bodyType) {
    redirect('/jammanage/vehicles/body-types');
  }

  return <VehicleBodyTypeForm bodyType={bodyType} />;
}
