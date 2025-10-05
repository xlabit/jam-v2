import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleMakesClient } from './client';

export const metadata = {
  title: 'Vehicle Makes | Jain Automart Admin',
  description: 'Manage vehicle makes',
};

export default async function VehicleMakesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 10;
  const search = params.search || '';
  const statusFilter = params.status;

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

  const [makes, totalCount] = await Promise.all([
    prisma.vehicleMake.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vehicleMake.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <VehicleMakesClient
      makes={makes}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
