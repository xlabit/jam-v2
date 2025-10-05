import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleEmissionNormForm } from '../form';

export const metadata = {
  title: 'Edit Emission Norm | Jain Automart Admin',
};

export default async function EditVehicleEmissionNormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const emissionNorm = await prisma.vehicleEmissionNorm.findUnique({
    where: { id },
  });

  if (!emissionNorm) {
    redirect('/jammanage/vehicles/emission-norms');
  }

  return <VehicleEmissionNormForm emissionNorm={emissionNorm} />;
}
