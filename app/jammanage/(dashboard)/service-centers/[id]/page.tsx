import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { ServiceCenterForm } from '@/components/jammanage/ServiceCenterForm';

export const metadata = {
  title: 'Edit Service Center | Jain Automart Admin',
};

export default async function EditServiceCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const center = await prisma.serviceCenter.findUnique({
    where: { id },
    include: {
      brands: true,
      services: true,
    },
  });

  if (!center) {
    redirect('/jammanage/service-centers');
  }

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <h1 className="text-xl font-semibold text-foreground">
          Edit Service Center
        </h1>
        <ServiceCenterForm initialData={center} />
      </div>
    </div>
  );
}
