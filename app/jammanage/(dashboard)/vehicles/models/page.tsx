import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { VehicleModelsClient } from './client';

export const metadata = {
  title: 'Vehicle Models | Jain Automart Admin',
  description: 'Manage vehicle models',
};

export default async function VehicleModelsPage({
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

  const [models, totalCount] = await Promise.all([
    prisma.vehicleModel.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        make: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.vehicleModel.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <VehicleModelsClient
      models={models}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
