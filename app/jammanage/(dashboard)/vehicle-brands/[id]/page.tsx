import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleBrandForm } from '@/components/jammanage/VehicleBrandForm';

export const metadata = {
  title: 'Edit Vehicle Brand | Jain Automart Admin',
};

export default async function EditVehicleBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const brand = await prisma.vehicleBrand.findUnique({
    where: { id },
  });

  if (!brand) {
    redirect('/jammanage/vehicle-brands');
  }

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <h1 className="text-xl font-semibold text-foreground">
          Edit Vehicle Brand
        </h1>
        <VehicleBrandForm initialData={brand} />
      </div>
    </div>
  );
}
