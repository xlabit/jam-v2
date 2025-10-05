import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { vehicleCreateSchema } from './validation';
import { Prisma } from '@prisma/client';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function ensureUniqueSlug(baseSlug: string, vehicleId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.vehicle.findFirst({
      where: {
        slug,
        ...(vehicleId && { NOT: { id: vehicleId } }),
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function generateTitle(data: {
  makeId: string;
  modelId: string;
  variantId?: string | null;
  modelYear: number;
  bodyTypeId: string;
  axleConfigId: string;
}): Promise<string> {
  const [make, model, variant, bodyType, axleConfig] = await Promise.all([
    prisma.vehicleMake.findUnique({ where: { id: data.makeId } }),
    prisma.vehicleModel.findUnique({ where: { id: data.modelId } }),
    data.variantId ? prisma.vehicleVariant.findUnique({ where: { id: data.variantId } }) : null,
    prisma.vehicleBodyType.findUnique({ where: { id: data.bodyTypeId } }),
    prisma.vehicleAxleConfig.findUnique({ where: { id: data.axleConfigId } }),
  ]);

  const parts = [
    data.modelYear.toString(),
    make?.name,
    model?.name,
    variant?.name || '',
    axleConfig?.name,
    bodyType?.name,
  ].filter(Boolean);

  return parts.join(' ');
}

function buildKeySpecs(data: any): string {
  const parts: string[] = [];
  
  if (data.engineCc) parts.push(`${data.engineCc}cc`);
  if (data.axleConfig?.name) parts.push(data.axleConfig.name);
  if (data.gvwT) parts.push(`${data.gvwT}t GVW`);
  if (data.emissionNorm?.name) parts.push(data.emissionNorm.name);
  
  return parts.join(' • ');
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const condition = searchParams.get('condition');
    const makeId = searchParams.get('makeId');
    const modelId = searchParams.get('modelId');
    const bodyTypeId = searchParams.get('bodyTypeId');
    const axleConfigId = searchParams.get('axleConfigId');
    const fuelTypeId = searchParams.get('fuelTypeId');
    const emissionNormId = searchParams.get('emissionNormId');
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const yearMin = searchParams.get('yearMin');
    const yearMax = searchParams.get('yearMax');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = searchParams.get('limit') || '10';
    const validLimits = ['10', '25', '50', '100'];
    const limit = validLimits.includes(limitParam) ? parseInt(limitParam, 10) : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.VehicleWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { regNo: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { make: { name: { contains: search, mode: 'insensitive' } } },
        { model: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (condition) where.condition = condition as any;
    if (makeId) where.makeId = makeId;
    if (modelId) where.modelId = modelId;
    if (bodyTypeId) where.bodyTypeId = bodyTypeId;
    if (axleConfigId) where.axleConfigId = axleConfigId;
    if (fuelTypeId) where.fuelTypeId = fuelTypeId;
    if (emissionNormId) where.emissionNormId = emissionNormId;
    if (status) where.status = status as any;
    if (city) where.city = city;
    if (state) where.state = state;

    if (yearMin || yearMax) {
      where.modelYear = {};
      if (yearMin) where.modelYear.gte = parseInt(yearMin, 10);
      if (yearMax) where.modelYear.lte = parseInt(yearMax, 10);
    }

    if (priceMin || priceMax) {
      where.askingPriceInr = {};
      if (priceMin) where.askingPriceInr.gte = parseFloat(priceMin);
      if (priceMax) where.askingPriceInr.lte = parseFloat(priceMax);
    }

    const orderByMap: Record<string, Prisma.VehicleOrderByWithRelationInput> = {
      updatedAt: { updatedAt: sortOrder as any },
      modelYear: { modelYear: sortOrder as any },
      askingPriceInr: { askingPriceInr: sortOrder as any },
      title: { title: sortOrder as any },
    };

    const orderBy = orderByMap[sortBy] || { updatedAt: 'desc' as any };

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          make: true,
          model: true,
          variant: true,
          bodyType: true,
          axleConfig: true,
          fuelType: true,
          emissionNorm: true,
          transmission: true,
        },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return NextResponse.json({
      data: vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = vehicleCreateSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.errors },
        { status: 400 },
      );
    }

    const data = parsedData.data;

    let title = data.title;
    if (!title) {
      title = await generateTitle({
        makeId: data.makeId,
        modelId: data.modelId,
        variantId: data.variantId || null,
        modelYear: data.modelYear,
        bodyTypeId: data.bodyTypeId,
        axleConfigId: data.axleConfigId,
      });
    }

    let slug = data.slug;
    if (!slug) {
      slug = generateSlug(title);
    } else {
      slug = generateSlug(slug);
    }
    slug = await ensureUniqueSlug(slug);

    if (data.condition === 'USED' && data.status === 'PUBLISHED' && data.regNo && data.state) {
      const existing = await prisma.vehicle.findFirst({
        where: {
          regNo: data.regNo,
          state: data.state,
          condition: 'USED',
          status: 'PUBLISHED',
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A published used vehicle with this registration number and state already exists' },
          { status: 400 },
        );
      }
    }

    const vehicleData: Prisma.VehicleCreateInput = {
      title,
      slug,
      condition: data.condition,
      make: { connect: { id: data.makeId } },
      model: { connect: { id: data.modelId } },
      ...(data.variantId && { variant: { connect: { id: data.variantId } } }),
      bodyType: { connect: { id: data.bodyTypeId } },
      axleConfig: { connect: { id: data.axleConfigId } },
      modelYear: data.modelYear,
      
      wheelbaseMm: data.wheelbaseMm,
      gvwT: data.gvwT,
      gcwT: data.gcwT,
      payloadT: data.payloadT,
      
      engineCc: data.engineCc,
      powerHp: data.powerHp,
      powerKw: data.powerKw,
      torqueNm: data.torqueNm,
      ...(data.fuelTypeId && { fuelType: { connect: { id: data.fuelTypeId } } }),
      ...(data.emissionNormId && { emissionNorm: { connect: { id: data.emissionNormId } } }),
      ...(data.transmissionId && { transmission: { connect: { id: data.transmissionId } } }),
      gears: data.gears,
      finalDriveRatio: data.finalDriveRatio,
      
      cabinType: data.cabinType,
      hasAc: data.hasAc,
      suspensionFront: data.suspensionFront,
      suspensionRear: data.suspensionRear,
      brakeType: data.brakeType,
      tyreSize: data.tyreSize,
      tyreCount: data.tyreCount,
      
      overallLengthMm: data.overallLengthMm,
      overallWidthMm: data.overallWidthMm,
      overallHeightMm: data.overallHeightMm,
      loadBodyLengthMm: data.loadBodyLengthMm,
      loadBodyWidthMm: data.loadBodyWidthMm,
      loadBodyHeightMm: data.loadBodyHeightMm,
      turningRadiusM: data.turningRadiusM,
      
      askingPriceInr: data.askingPriceInr || 0,
      negotiable: data.negotiable,
      financeAvailable: data.financeAvailable,
      gstSlab: data.gstSlab,
      
      vendorPriceInr: data.vendorPriceInr,
      targetMarginInr: data.targetMarginInr,
      
      sellerId: data.sellerId,
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      latitude: data.latitude,
      longitude: data.longitude,
      contactPhone: data.contactPhone || '',
      contactWhatsapp: data.contactWhatsapp,
      
      regNo: data.regNo,
      regDate: data.regDate ? new Date(data.regDate) : null,
      ownershipCount: data.ownershipCount,
      insuranceType: data.insuranceType,
      insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null,
      fitnessExpiry: data.fitnessExpiry ? new Date(data.fitnessExpiry) : null,
      pucExpiry: data.pucExpiry ? new Date(data.pucExpiry) : null,
      permitStatesJson: data.permitStatesJson || [],
      hypothecationBank: data.hypothecationBank,
      
      coverUrl: data.coverUrl,
      galleryJson: data.galleryJson || [],
      videoUrl: data.videoUrl,
      brochureUrl: data.brochureUrl,
      watermarkEnabled: data.watermarkEnabled,
      
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      
      status: data.status,
      visibility: data.visibility,
      reservedUntil: data.reservedUntil ? new Date(data.reservedUntil) : null,
      
      createdBy: session.user.id,
      updatedBy: session.user.id,
    };

    const vehicle = await prisma.vehicle.create({
      data: vehicleData,
      include: {
        make: true,
        model: true,
        variant: true,
        bodyType: true,
        axleConfig: true,
        fuelType: true,
        emissionNorm: true,
        transmission: true,
      },
    });

    const keySpecs = buildKeySpecs(vehicle);
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { keySpecs },
    });

    if (data.featureTagIds && data.featureTagIds.length > 0) {
      await prisma.vehicleFeatureMap.createMany({
        data: data.featureTagIds.map((featureTagId) => ({
          vehicleId: vehicle.id,
          featureTagId,
        })),
      });
    }

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
      include: {
        make: true,
        model: true,
        variant: true,
        bodyType: true,
        axleConfig: true,
        fuelType: true,
        emissionNorm: true,
        transmission: true,
        features: { include: { featureTag: true } },
      },
    });

    return NextResponse.json(updatedVehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 },
    );
  }
}
