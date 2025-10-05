import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleVariantForm } from '../form';

export const metadata = {
  title: 'Edit Vehicle Variant | Jain Automart Admin',
};

export default async function EditVehicleVariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const variant = await prisma.vehicleVariant.findUnique({
    where: { id },
  });

  if (!variant) {
    redirect('/jammanage/vehicles/variants');
  }

  return <VehicleVariantForm variant={variant} />;
}
