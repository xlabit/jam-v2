import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleAxleConfigsClient } from './client';

export const metadata = {
  title: 'Vehicle Axle Configurations | Jain Automart Admin',
  description: 'Manage vehicle axle configurations',
};

export default async function VehicleAxleConfigsPage({
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

  const [axleConfigs, totalCount] = await Promise.all([
    prisma.vehicleAxleConfig.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vehicleAxleConfig.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <VehicleAxleConfigsClient
      axleConfigs={axleConfigs}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
