import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const existing = await prisma.serviceCenterType.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'A type with this name already exists' },
        { status: 400 },
      );
    }

    const type = await prisma.serviceCenterType.create({
      data,
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error) {
    console.error('Error creating service center type:', error);
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
