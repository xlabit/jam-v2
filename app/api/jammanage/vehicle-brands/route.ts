import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const brand = await prisma.vehicleBrand.create({
      data: {
        name: data.name,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        status: data.status || 'ACTIVE',
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error creating vehicle brand:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle brand' },
      { status: 500 },
    );
  }
}
