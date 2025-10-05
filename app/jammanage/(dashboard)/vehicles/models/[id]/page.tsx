import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleModelForm } from '../form';

export const metadata = {
  title: 'Edit Vehicle Model | Jain Automart Admin',
};

export default async function EditVehicleModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const model = await prisma.vehicleModel.findUnique({
    where: { id },
  });

  if (!model) {
    redirect('/jammanage/vehicles/models');
  }

  return <VehicleModelForm model={model} />;
}
