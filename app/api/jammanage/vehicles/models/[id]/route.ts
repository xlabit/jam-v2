import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  makeId: z.string().uuid(),
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

    const existing = await prisma.vehicleModel.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (existing.usageCount > 0 && data.name !== existing.name) {
      return NextResponse.json(
        {
          message:
            'Cannot change the name as this model is being used by vehicles. Please create a new model instead.',
        },
        { status: 400 },
      );
    }

    const existingWithName = await prisma.vehicleModel.findUnique({
      where: {
        makeId_name: {
          makeId: data.makeId,
          name: data.name,
        },
      },
    });

    if (existingWithName && existingWithName.id !== params.id) {
      return NextResponse.json(
        { message: 'A model with this name already exists for this make' },
        { status: 400 },
      );
    }

    const model = await prisma.vehicleModel.update({
      where: { id: params.id },
      data: {
        makeId: data.makeId,
        name: data.name,
        description: data.description || null,
        defaultsJson: data.defaultsJson || null,
        status: data.status,
      },
      include: {
        make: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error updating vehicle model:', error);
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

    const model = await prisma.vehicleModel.findUnique({
      where: { id: params.id },
    });

    if (!model) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (model.usageCount > 0) {
      await prisma.vehicleModel.update({
        where: { id: params.id },
        data: { status: 'INACTIVE' },
      });

      return NextResponse.json({
        message:
          'Model is being used and has been set to Inactive. It will no longer appear in selection lists.',
      });
    }

    await prisma.vehicleModel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle model:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
