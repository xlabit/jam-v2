import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { vehicleUpdateSchema } from '../validation';
import { Prisma } from '@prisma/client';

function buildKeySpecs(data: any): string {
  const parts: string[] = [];
  
  if (data.engineCc) parts.push(`${data.engineCc}cc`);
  if (data.axleConfig?.name) parts.push(data.axleConfig.name);
  if (data.gvwT) parts.push(`${data.gvwT}t GVW`);
  if (data.emissionNorm?.name) parts.push(data.emissionNorm.name);
  
  return parts.join(' • ');
}

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

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
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

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        make: true,
        model: true,
        variant: true,
        bodyType: true,
        axleConfig: true,
      },
    });

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsedData = vehicleUpdateSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.errors },
        { status: 400 },
      );
    }

    const data = parsedData.data;

    const newStatus = data.status || existingVehicle.status;
    const newCondition = data.condition || existingVehicle.condition;

    if (newStatus === 'PUBLISHED' && existingVehicle.status !== 'PUBLISHED') {
      const requiredFields = {
        condition: data.condition || existingVehicle.condition,
        makeId: data.makeId || existingVehicle.makeId,
        modelId: data.modelId || existingVehicle.modelId,
        modelYear: data.modelYear || existingVehicle.modelYear,
        bodyTypeId: data.bodyTypeId || existingVehicle.bodyTypeId,
        axleConfigId: data.axleConfigId || existingVehicle.axleConfigId,
        city: data.city || existingVehicle.city,
        state: data.state || existingVehicle.state,
        pincode: data.pincode || existingVehicle.pincode,
        askingPriceInr: data.askingPriceInr || existingVehicle.askingPriceInr,
        coverUrl: data.coverUrl || existingVehicle.coverUrl,
        slug: data.slug || existingVehicle.slug,
      };

      const missingFields: string[] = [];
      Object.entries(requiredFields).forEach(([key, value]) => {
        if (!value) {
          missingFields.push(key);
        }
      });

      if (newCondition === 'USED') {
        const regNo = data.regNo || existingVehicle.regNo;
        if (!regNo) {
          missingFields.push('regNo');
        }
      }

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: 'Cannot publish vehicle. Missing required fields', missingFields },
          { status: 400 },
        );
      }
    }

    if (newCondition === 'USED' && newStatus === 'PUBLISHED') {
      const regNo = data.regNo || existingVehicle.regNo;
      const state = data.state || existingVehicle.state;

      if (regNo && state) {
        const existing = await prisma.vehicle.findFirst({
          where: {
            regNo,
            state,
            condition: 'USED',
            status: 'PUBLISHED',
            NOT: { id },
          },
        });

        if (existing) {
          return NextResponse.json(
            { error: 'A published used vehicle with this registration number and state already exists' },
            { status: 400 },
          );
        }
      }
    }

    let slug = existingVehicle.slug;
    if (data.slug && data.slug !== existingVehicle.slug) {
      slug = generateSlug(data.slug);
      slug = await ensureUniqueSlug(slug, id);
    }

    const updateData: Prisma.VehicleUpdateInput = {
      ...(data.title && { title: data.title }),
      slug,
      ...(data.condition && { condition: data.condition }),
      ...(data.makeId && { make: { connect: { id: data.makeId } } }),
      ...(data.modelId && { model: { connect: { id: data.modelId } } }),
      ...(data.variantId !== undefined && (data.variantId ? { variant: { connect: { id: data.variantId } } } : { variant: { disconnect: true } })),
      ...(data.bodyTypeId && { bodyType: { connect: { id: data.bodyTypeId } } }),
      ...(data.axleConfigId && { axleConfig: { connect: { id: data.axleConfigId } } }),
      ...(data.modelYear && { modelYear: data.modelYear }),
      
      ...(data.wheelbaseMm !== undefined && { wheelbaseMm: data.wheelbaseMm }),
      ...(data.gvwT !== undefined && { gvwT: data.gvwT }),
      ...(data.gcwT !== undefined && { gcwT: data.gcwT }),
      ...(data.payloadT !== undefined && { payloadT: data.payloadT }),
      
      ...(data.engineCc !== undefined && { engineCc: data.engineCc }),
      ...(data.powerHp !== undefined && { powerHp: data.powerHp }),
      ...(data.powerKw !== undefined && { powerKw: data.powerKw }),
      ...(data.torqueNm !== undefined && { torqueNm: data.torqueNm }),
      ...(data.fuelTypeId !== undefined && (data.fuelTypeId ? { fuelType: { connect: { id: data.fuelTypeId } } } : { fuelType: { disconnect: true } })),
      ...(data.emissionNormId !== undefined && (data.emissionNormId ? { emissionNorm: { connect: { id: data.emissionNormId } } } : { emissionNorm: { disconnect: true } })),
      ...(data.transmissionId !== undefined && (data.transmissionId ? { transmission: { connect: { id: data.transmissionId } } } : { transmission: { disconnect: true } })),
      ...(data.gears !== undefined && { gears: data.gears }),
      ...(data.finalDriveRatio !== undefined && { finalDriveRatio: data.finalDriveRatio }),
      
      ...(data.cabinType !== undefined && { cabinType: data.cabinType }),
      ...(data.hasAc !== undefined && { hasAc: data.hasAc }),
      ...(data.suspensionFront !== undefined && { suspensionFront: data.suspensionFront }),
      ...(data.suspensionRear !== undefined && { suspensionRear: data.suspensionRear }),
      ...(data.brakeType !== undefined && { brakeType: data.brakeType }),
      ...(data.tyreSize !== undefined && { tyreSize: data.tyreSize }),
      ...(data.tyreCount !== undefined && { tyreCount: data.tyreCount }),
      
      ...(data.overallLengthMm !== undefined && { overallLengthMm: data.overallLengthMm }),
      ...(data.overallWidthMm !== undefined && { overallWidthMm: data.overallWidthMm }),
      ...(data.overallHeightMm !== undefined && { overallHeightMm: data.overallHeightMm }),
      ...(data.loadBodyLengthMm !== undefined && { loadBodyLengthMm: data.loadBodyLengthMm }),
      ...(data.loadBodyWidthMm !== undefined && { loadBodyWidthMm: data.loadBodyWidthMm }),
      ...(data.loadBodyHeightMm !== undefined && { loadBodyHeightMm: data.loadBodyHeightMm }),
      ...(data.turningRadiusM !== undefined && { turningRadiusM: data.turningRadiusM }),
      
      ...(data.askingPriceInr !== undefined && { askingPriceInr: data.askingPriceInr }),
      ...(data.negotiable !== undefined && { negotiable: data.negotiable }),
      ...(data.financeAvailable !== undefined && { financeAvailable: data.financeAvailable }),
      ...(data.gstSlab !== undefined && { gstSlab: data.gstSlab }),
      
      ...(data.vendorPriceInr !== undefined && { vendorPriceInr: data.vendorPriceInr }),
      ...(data.targetMarginInr !== undefined && { targetMarginInr: data.targetMarginInr }),
      
      ...(data.sellerId !== undefined && { sellerId: data.sellerId }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.pincode !== undefined && { pincode: data.pincode }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
      ...(data.contactWhatsapp !== undefined && { contactWhatsapp: data.contactWhatsapp }),
      
      ...(data.regNo !== undefined && { regNo: data.regNo }),
      ...(data.regDate !== undefined && { regDate: data.regDate ? new Date(data.regDate) : null }),
      ...(data.ownershipCount !== undefined && { ownershipCount: data.ownershipCount }),
      ...(data.insuranceType !== undefined && { insuranceType: data.insuranceType }),
      ...(data.insuranceExpiry !== undefined && { insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null }),
      ...(data.fitnessExpiry !== undefined && { fitnessExpiry: data.fitnessExpiry ? new Date(data.fitnessExpiry) : null }),
      ...(data.pucExpiry !== undefined && { pucExpiry: data.pucExpiry ? new Date(data.pucExpiry) : null }),
      ...(data.permitStatesJson !== undefined && { permitStatesJson: data.permitStatesJson }),
      ...(data.hypothecationBank !== undefined && { hypothecationBank: data.hypothecationBank }),
      
      ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
      ...(data.galleryJson !== undefined && { galleryJson: data.galleryJson }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.brochureUrl !== undefined && { brochureUrl: data.brochureUrl }),
      ...(data.watermarkEnabled !== undefined && { watermarkEnabled: data.watermarkEnabled }),
      
      ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
      ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
      
      ...(data.status && { status: data.status }),
      ...(data.visibility !== undefined && { visibility: data.visibility }),
      ...(data.reservedUntil !== undefined && { reservedUntil: data.reservedUntil ? new Date(data.reservedUntil) : null }),
      
      updatedBy: session.user.id,
    };

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
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

    if (data.featureTagIds !== undefined) {
      await prisma.vehicleFeatureMap.deleteMany({
        where: { vehicleId: id },
      });

      if (data.featureTagIds && data.featureTagIds.length > 0) {
        await prisma.vehicleFeatureMap.createMany({
          data: data.featureTagIds.map((featureTagId) => ({
            vehicleId: id,
            featureTagId,
          })),
        });
      }
    }

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id },
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

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
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

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    await prisma.vehicle.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Vehicle archived successfully' });
  } catch (error) {
    console.error('Error archiving vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to archive vehicle' },
      { status: 500 },
    );
  }
}
