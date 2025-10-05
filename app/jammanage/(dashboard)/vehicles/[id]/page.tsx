import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { VehicleForm } from '@/components/jammanage/VehicleForm';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Edit Vehicle | Jain Automart Admin',
};

interface Props {
  params: {
    id: string;
  };
}

export default async function EditVehiclePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: {
      make: true,
      model: true,
      variant: true,
      bodyType: true,
      axleConfig: true,
      fuelType: true,
      emissionNorm: true,
      transmission: true,
      featureTags: {
        include: {
          featureTag: true,
        },
      },
    },
  });

  if (!vehicle) {
    notFound();
  }

  return <VehicleForm initialData={vehicle} />;
}
