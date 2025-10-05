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

    const existingWithName = await prisma.serviceCenterType.findUnique({
      where: { name: data.name },
    });

    if (existingWithName && existingWithName.id !== params.id) {
      return NextResponse.json(
        { message: 'A type with this name already exists' },
        { status: 400 },
      );
    }

    const type = await prisma.serviceCenterType.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(type);
  } catch (error) {
    console.error('Error updating service center type:', error);
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

    const type = await prisma.serviceCenterType.findUnique({
      where: { id: params.id },
    });

    if (!type) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (type.usageCount > 0) {
      return NextResponse.json(
        {
          message:
            'Cannot delete this type as it is being used by service centers. Please set it to Inactive instead.',
        },
        { status: 400 },
      );
    }

    await prisma.serviceCenterType.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting service center type:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
