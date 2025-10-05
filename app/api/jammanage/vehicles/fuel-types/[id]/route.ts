import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const existing = await prisma.vehicleFuelType.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (existing.usageCount > 0 && data.name !== existing.name) {
      return NextResponse.json(
        {
          message:
            'Cannot change the name as this fuel type is being used by vehicles. Please create a new fuel type instead.',
        },
        { status: 400 },
      );
    }

    const existingWithName = await prisma.vehicleFuelType.findUnique({
      where: { name: data.name },
    });

    if (existingWithName && existingWithName.id !== params.id) {
      return NextResponse.json(
        { message: 'A fuel type with this name already exists' },
        { status: 400 },
      );
    }

    const fuelType = await prisma.vehicleFuelType.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status,
      },
    });

    return NextResponse.json(fuelType);
  } catch (error) {
    console.error('Error updating vehicle fuel type:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const fuelType = await prisma.vehicleFuelType.findUnique({
      where: { id: params.id },
    });

    if (!fuelType) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (fuelType.usageCount > 0) {
      await prisma.vehicleFuelType.update({
        where: { id: params.id },
        data: { status: 'INACTIVE' },
      });

      return NextResponse.json({
        message:
          'Fuel type is being used and has been set to Inactive. It will no longer appear in selection lists.',
      });
    }

    await prisma.vehicleFuelType.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle fuel type:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
