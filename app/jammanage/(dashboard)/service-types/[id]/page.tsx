import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { ServiceTypeForm } from '@/components/jammanage/ServiceTypeForm';

export const metadata = {
  title: 'Edit Service Type | Jain Automart Admin',
};

export default async function EditServiceTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const { id } = await params;

  const serviceType = await prisma.serviceType.findUnique({
    where: { id },
  });

  if (!serviceType) {
    redirect('/jammanage/service-types');
  }

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <h1 className="text-xl font-semibold text-foreground">
          Edit Service Type
        </h1>
        <ServiceTypeForm initialData={serviceType} />
      </div>
    </div>
  );
}
