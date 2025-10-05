import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const serviceType = await prisma.serviceType.findUnique({
      where: { id },
    });

    if (!serviceType) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(serviceType);
  } catch (error) {
    console.error('Error fetching service type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service type' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const serviceType = await prisma.serviceType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status,
      },
    });

    return NextResponse.json(serviceType);
  } catch (error) {
    console.error('Error updating service type:', error);
    return NextResponse.json(
      { error: 'Failed to update service type' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.serviceType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service type:', error);
    return NextResponse.json(
      { error: 'Failed to delete service type' },
      { status: 500 },
    );
  }
}
