import { z } from 'zod';
import { VehicleCondition, VehicleStatus } from '@prisma/client';

export const vehicleCreateSchema = z.object({
  condition: z.nativeEnum(VehicleCondition),
  makeId: z.string().uuid(),
  modelId: z.string().uuid(),
  variantId: z.string().uuid().optional().nullable(),
  modelYear: z.number().int().min(1900).max(2100),
  bodyTypeId: z.string().uuid(),
  axleConfigId: z.string().uuid(),
  
  title: z.string().optional(),
  slug: z.string().optional(),
  
  wheelbaseMm: z.number().int().optional().nullable(),
  gvwT: z.number().optional().nullable(),
  gcwT: z.number().optional().nullable(),
  payloadT: z.number().optional().nullable(),
  
  engineCc: z.number().int().optional().nullable(),
  powerHp: z.number().optional().nullable(),
  powerKw: z.number().optional().nullable(),
  torqueNm: z.number().optional().nullable(),
  fuelTypeId: z.string().uuid().optional().nullable(),
  emissionNormId: z.string().uuid().optional().nullable(),
  transmissionId: z.string().uuid().optional().nullable(),
  gears: z.number().int().optional().nullable(),
  finalDriveRatio: z.string().optional().nullable(),
  
  cabinType: z.string().optional().nullable(),
  hasAc: z.boolean().default(false),
  suspensionFront: z.string().optional().nullable(),
  suspensionRear: z.string().optional().nullable(),
  brakeType: z.string().optional().nullable(),
  tyreSize: z.string().optional().nullable(),
  tyreCount: z.number().int().optional().nullable(),
  
  overallLengthMm: z.number().int().optional().nullable(),
  overallWidthMm: z.number().int().optional().nullable(),
  overallHeightMm: z.number().int().optional().nullable(),
  loadBodyLengthMm: z.number().int().optional().nullable(),
  loadBodyWidthMm: z.number().int().optional().nullable(),
  loadBodyHeightMm: z.number().int().optional().nullable(),
  turningRadiusM: z.number().optional().nullable(),
  
  askingPriceInr: z.number().optional().nullable(),
  negotiable: z.boolean().default(false),
  financeAvailable: z.boolean().default(false),
  gstSlab: z.string().optional().nullable(),
  
  vendorPriceInr: z.number().optional().nullable(),
  targetMarginInr: z.number().optional().nullable(),
  
  sellerId: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactWhatsapp: z.string().optional().nullable(),
  
  regNo: z.string().optional().nullable(),
  regDate: z.string().optional().nullable(),
  ownershipCount: z.number().int().optional().nullable(),
  insuranceType: z.string().optional().nullable(),
  insuranceExpiry: z.string().optional().nullable(),
  fitnessExpiry: z.string().optional().nullable(),
  pucExpiry: z.string().optional().nullable(),
  permitStatesJson: z.array(z.string()).optional().nullable(),
  hypothecationBank: z.string().optional().nullable(),
  
  coverUrl: z.string().optional().nullable(),
  galleryJson: z.array(z.string()).optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  brochureUrl: z.string().optional().nullable(),
  watermarkEnabled: z.boolean().default(true),
  
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  
  status: z.nativeEnum(VehicleStatus).default('DRAFT'),
  visibility: z.boolean().default(false),
  reservedUntil: z.string().optional().nullable(),
  
  featureTagIds: z.array(z.string().uuid()).optional().nullable(),
});

export const vehicleUpdateSchema = z.object({
  condition: z.nativeEnum(VehicleCondition).optional(),
  makeId: z.string().uuid().optional(),
  modelId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional().nullable(),
  modelYear: z.number().int().min(1900).max(2100).optional(),
  bodyTypeId: z.string().uuid().optional(),
  axleConfigId: z.string().uuid().optional(),
  
  title: z.string().optional(),
  slug: z.string().optional(),
  
  wheelbaseMm: z.number().int().optional().nullable(),
  gvwT: z.number().optional().nullable(),
  gcwT: z.number().optional().nullable(),
  payloadT: z.number().optional().nullable(),
  
  engineCc: z.number().int().optional().nullable(),
  powerHp: z.number().optional().nullable(),
  powerKw: z.number().optional().nullable(),
  torqueNm: z.number().optional().nullable(),
  fuelTypeId: z.string().uuid().optional().nullable(),
  emissionNormId: z.string().uuid().optional().nullable(),
  transmissionId: z.string().uuid().optional().nullable(),
  gears: z.number().int().optional().nullable(),
  finalDriveRatio: z.string().optional().nullable(),
  
  cabinType: z.string().optional().nullable(),
  hasAc: z.boolean().optional(),
  suspensionFront: z.string().optional().nullable(),
  suspensionRear: z.string().optional().nullable(),
  brakeType: z.string().optional().nullable(),
  tyreSize: z.string().optional().nullable(),
  tyreCount: z.number().int().optional().nullable(),
  
  overallLengthMm: z.number().int().optional().nullable(),
  overallWidthMm: z.number().int().optional().nullable(),
  overallHeightMm: z.number().int().optional().nullable(),
  loadBodyLengthMm: z.number().int().optional().nullable(),
  loadBodyWidthMm: z.number().int().optional().nullable(),
  loadBodyHeightMm: z.number().int().optional().nullable(),
  turningRadiusM: z.number().optional().nullable(),
  
  askingPriceInr: z.number().optional().nullable(),
  negotiable: z.boolean().optional(),
  financeAvailable: z.boolean().optional(),
  gstSlab: z.string().optional().nullable(),
  
  vendorPriceInr: z.number().optional().nullable(),
  targetMarginInr: z.number().optional().nullable(),
  
  sellerId: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactWhatsapp: z.string().optional().nullable(),
  
  regNo: z.string().optional().nullable(),
  regDate: z.string().optional().nullable(),
  ownershipCount: z.number().int().optional().nullable(),
  insuranceType: z.string().optional().nullable(),
  insuranceExpiry: z.string().optional().nullable(),
  fitnessExpiry: z.string().optional().nullable(),
  pucExpiry: z.string().optional().nullable(),
  permitStatesJson: z.array(z.string()).optional().nullable(),
  hypothecationBank: z.string().optional().nullable(),
  
  coverUrl: z.string().optional().nullable(),
  galleryJson: z.array(z.string()).optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  brochureUrl: z.string().optional().nullable(),
  watermarkEnabled: z.boolean().optional(),
  
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  
  status: z.nativeEnum(VehicleStatus).optional(),
  visibility: z.boolean().optional(),
  reservedUntil: z.string().optional().nullable(),
  
  featureTagIds: z.array(z.string().uuid()).optional().nullable(),
});

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;
