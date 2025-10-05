import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleFuelTypeForm } from '../form';

export const metadata = {
  title: 'Edit Fuel Type | Jain Automart Admin',
};

export default async function EditVehicleFuelTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const fuelType = await prisma.vehicleFuelType.findUnique({
    where: { id },
  });

  if (!fuelType) {
    redirect('/jammanage/vehicles/fuel-types');
  }

  return <VehicleFuelTypeForm fuelType={fuelType} />;
}
