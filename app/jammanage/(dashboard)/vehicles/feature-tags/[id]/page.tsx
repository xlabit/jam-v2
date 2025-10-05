import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleFeatureTagForm } from '../form';

export const metadata = {
  title: 'Edit Feature Tag | Jain Automart Admin',
};

export default async function EditVehicleFeatureTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const featureTag = await prisma.vehicleFeatureTag.findUnique({
    where: { id },
  });

  if (!featureTag) {
    redirect('/jammanage/vehicles/feature-tags');
  }

  return <VehicleFeatureTagForm featureTag={featureTag} />;
}
