import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [types, brands, serviceTypes] = await Promise.all([
      prisma.serviceCenterType.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { name: 'asc' },
      }),
      prisma.vehicleBrand.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { name: 'asc' },
      }),
      prisma.serviceType.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({ types, brands, serviceTypes });
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 },
    );
  }
}
