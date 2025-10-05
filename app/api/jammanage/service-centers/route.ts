import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const serviceCenter = await prisma.serviceCenter.create({
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
        status: data.status || 'DRAFT',
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
    console.error('Error creating service center:', error);
    return NextResponse.json(
      { error: 'Failed to create service center' },
      { status: 500 },
    );
  }
}
