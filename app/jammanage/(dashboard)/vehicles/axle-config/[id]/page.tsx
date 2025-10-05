import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleAxleConfigForm } from '../form';

export const metadata = {
  title: 'Edit Axle Configuration | Jain Automart Admin',
};

export default async function EditVehicleAxleConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const axleConfig = await prisma.vehicleAxleConfig.findUnique({
    where: { id },
  });

  if (!axleConfig) {
    redirect('/jammanage/vehicles/axle-config');
  }

  return <VehicleAxleConfigForm axleConfig={axleConfig} />;
}
