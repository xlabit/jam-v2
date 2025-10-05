import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { ServiceCenterTypesClient } from './client';

export const metadata = {
  title: 'Service Center Types | Jain Automart Admin',
  description: 'Manage service center types',
};

export default async function ServiceCenterTypesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const page = parseInt(searchParams.page || '1');
  const pageSize = 10;
  const search = searchParams.search || '';
  const statusFilter = searchParams.status;

  const where = {
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
    ...(statusFilter && {
      status: statusFilter as any,
    }),
  };

  const [types, totalCount] = await Promise.all([
    prisma.serviceCenterType.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.serviceCenterType.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <ServiceCenterTypesClient
      types={types}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
