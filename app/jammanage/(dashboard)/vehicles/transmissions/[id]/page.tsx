import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleTransmissionForm } from '../form';

export const metadata = {
  title: 'Edit Transmission | Jain Automart Admin',
};

export default async function EditVehicleTransmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const transmission = await prisma.vehicleTransmission.findUnique({
    where: { id },
  });

  if (!transmission) {
    redirect('/jammanage/vehicles/transmissions');
  }

  return <VehicleTransmissionForm transmission={transmission} />;
}
