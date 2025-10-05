import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { ServiceCentersClient } from './client';

export const metadata = {
  title: 'Service Centers | Jain Automart Admin',
};

export default async function ServiceCentersPage({
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
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { city: { contains: search, mode: 'insensitive' as const } },
        { state: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(statusFilter && {
      status: statusFilter as any,
    }),
  };

  const [centers, totalCount] = await Promise.all([
    prisma.serviceCenter.findMany({
      where,
      include: {
        type: true,
        brands: { include: { brand: true } },
        services: { include: { serviceType: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.serviceCenter.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <ServiceCentersClient
      centers={centers}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
