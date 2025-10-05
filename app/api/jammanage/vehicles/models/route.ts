import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  makeId: z.string().uuid(),
  name: z.string().min(1).max(120),
  description: z.string().optional(),
  defaultsJson: z.any().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const makeId = searchParams.get('makeId');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    if (makeId) {
      where.makeId = makeId;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [models, totalCount] = await Promise.all([
      prisma.vehicleModel.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          make: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.vehicleModel.count({ where }),
    ]);

    return NextResponse.json({
      data: models,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const makeExists = await prisma.vehicleMake.findUnique({
      where: { id: data.makeId },
    });

    if (!makeExists) {
      return NextResponse.json(
        { message: 'The specified make does not exist' },
        { status: 400 },
      );
    }

    const existing = await prisma.vehicleModel.findUnique({
      where: { 
        makeId_name: {
          makeId: data.makeId,
          name: data.name,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'A model with this name already exists for this make' },
        { status: 400 },
      );
    }

    const model = await prisma.vehicleModel.create({
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

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle model:', error);
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
