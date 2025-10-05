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

    const brand = await prisma.vehicleBrand.findUnique({
      where: { id },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching vehicle brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle brand' },
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

    const brand = await prisma.vehicleBrand.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        status: data.status,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error updating vehicle brand:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle brand' },
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

    await prisma.vehicleBrand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle brand' },
      { status: 500 },
    );
  }
}
