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

    const serviceType = await prisma.serviceType.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status || 'ACTIVE',
      },
    });

    return NextResponse.json(serviceType);
  } catch (error) {
    console.error('Error creating service type:', error);
    return NextResponse.json(
      { error: 'Failed to create service type' },
      { status: 500 },
    );
  }
}
