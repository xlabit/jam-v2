import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  modelId: z.string().uuid(),
  name: z.string().min(1).max(120),
  description: z.string().optional(),
  defaultsJson: z.any().optional(),
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

    const existing = await prisma.vehicleVariant.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (existing.usageCount > 0 && data.name !== existing.name) {
      return NextResponse.json(
        {
          message:
            'Cannot change the name as this variant is being used by vehicles. Please create a new variant instead.',
        },
        { status: 400 },
      );
    }

    const existingWithName = await prisma.vehicleVariant.findUnique({
      where: {
        modelId_name: {
          modelId: data.modelId,
          name: data.name,
        },
      },
    });

    if (existingWithName && existingWithName.id !== params.id) {
      return NextResponse.json(
        { message: 'A variant with this name already exists for this model' },
        { status: 400 },
      );
    }

    const variant = await prisma.vehicleVariant.update({
      where: { id: params.id },
      data: {
        modelId: data.modelId,
        name: data.name,
        description: data.description || null,
        defaultsJson: data.defaultsJson || null,
        status: data.status,
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            make: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error updating vehicle variant:', error);
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

    const variant = await prisma.vehicleVariant.findUnique({
      where: { id: params.id },
    });

    if (!variant) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (variant.usageCount > 0) {
      await prisma.vehicleVariant.update({
        where: { id: params.id },
        data: { status: 'INACTIVE' },
      });

      return NextResponse.json({
        message:
          'Variant is being used and has been set to Inactive. It will no longer appear in selection lists.',
      });
    }

    await prisma.vehicleVariant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle variant:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
