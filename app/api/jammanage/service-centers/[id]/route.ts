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

    const center = await prisma.serviceCenter.findUnique({
      where: { id },
      include: {
        type: true,
        brands: { include: { brand: true } },
        services: { include: { serviceType: true } },
      },
    });

    if (!center) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(center);
  } catch (error) {
    console.error('Error fetching service center:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service center' },
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

    await prisma.serviceCenterBrand.deleteMany({
      where: { serviceCenterId: id },
    });
    await prisma.serviceCenterService.deleteMany({
      where: { serviceCenterId: id },
    });

    const serviceCenter = await prisma.serviceCenter.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        typeId: data.typeId,
        primaryContactName: data.primaryContactName,
        address1: data.address1,
        address2: data.address2 || null,
        landmark: data.landmark || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country || 'India',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        primaryPhone: data.primaryPhone,
        secondaryPhone: data.secondaryPhone || null,
        email: data.email || null,
        website: data.website || null,
        whatsapp: data.whatsapp || null,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        specializations: data.specializations || [],
        facilities: data.facilities || [],
        status: data.status,
        brands: {
          create: (data.brandIds || []).map((brandId: string) => ({
            brandId,
          })),
        },
        services: {
          create: (data.serviceTypeIds || []).map((serviceTypeId: string) => ({
            serviceTypeId,
          })),
        },
      },
    });

    return NextResponse.json(serviceCenter);
  } catch (error) {
    console.error('Error updating service center:', error);
    return NextResponse.json(
      { error: 'Failed to update service center' },
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

    await prisma.serviceCenter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service center:', error);
    return NextResponse.json(
      { error: 'Failed to delete service center' },
      { status: 500 },
    );
  }
}
