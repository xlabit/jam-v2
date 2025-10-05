import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { ServiceCenterTypeForm } from '../form';

export const metadata = {
  title: 'Edit Service Center Type | Jain Automart Admin',
};

export default async function EditServiceCenterTypePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const type = await prisma.serviceCenterType.findUnique({
    where: { id: params.id },
  });

  if (!type) {
    redirect('/jammanage/service-center-types');
  }

  return <ServiceCenterTypeForm type={type} />;
}
