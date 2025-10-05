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

    const existing = await prisma.vehicleEmissionNorm.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (existing.usageCount > 0 && data.name !== existing.name) {
      return NextResponse.json(
        {
          message:
            'Cannot change the name as this emission norm is being used by vehicles. Please create a new emission norm instead.',
        },
        { status: 400 },
      );
    }

    const existingWithName = await prisma.vehicleEmissionNorm.findUnique({
      where: { name: data.name },
    });

    if (existingWithName && existingWithName.id !== params.id) {
      return NextResponse.json(
        { message: 'An emission norm with this name already exists' },
        { status: 400 },
      );
    }

    const emissionNorm = await prisma.vehicleEmissionNorm.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status,
      },
    });

    return NextResponse.json(emissionNorm);
  } catch (error) {
    console.error('Error updating vehicle emission norm:', error);
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

    const emissionNorm = await prisma.vehicleEmissionNorm.findUnique({
      where: { id: params.id },
    });

    if (!emissionNorm) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (emissionNorm.usageCount > 0) {
      await prisma.vehicleEmissionNorm.update({
        where: { id: params.id },
        data: { status: 'INACTIVE' },
      });

      return NextResponse.json({
        message:
          'Emission norm is being used and has been set to Inactive. It will no longer appear in selection lists.',
      });
    }

    await prisma.vehicleEmissionNorm.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle emission norm:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
