'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperNav,
  StepperPanel,
  StepperContent,
} from '@/components/ui/stepper';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const formSchema = z.object({
  condition: z.enum(['NEW', 'USED']),
  makeId: z.string().min(1, 'Make is required'),
  modelId: z.string().min(1, 'Model is required'),
  variantId: z.string().optional().nullable(),
  modelYear: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  bodyTypeId: z.string().min(1, 'Body type is required'),
  axleConfigId: z.string().min(1, 'Axle configuration is required'),
  title: z.string().optional(),
  coverUrl: z.string().optional().nullable(),
  galleryJson: z.array(z.string()).optional().nullable(),
  
  wheelbaseMm: z.number().int().optional().nullable(),
  gvwT: z.number().optional().nullable(),
  gcwT: z.number().optional().nullable(),
  payloadT: z.number().optional().nullable(),
  
  cabinType: z.string().optional().nullable(),
  hasAc: z.boolean().optional().default(false),
  suspensionFront: z.string().optional().nullable(),
  suspensionRear: z.string().optional().nullable(),
  brakeType: z.string().optional().nullable(),
  tyreSize: z.string().optional().nullable(),
  tyreCount: z.number().int().optional().nullable(),
  
  engineCc: z.number().int().optional().nullable(),
  powerHp: z.number().optional().nullable(),
  powerKw: z.number().optional().nullable(),
  torqueNm: z.number().optional().nullable(),
  fuelTypeId: z.string().optional().nullable(),
  emissionNormId: z.string().optional().nullable(),
  transmissionId: z.string().optional().nullable(),
  gears: z.number().int().optional().nullable(),
  finalDriveRatio: z.string().optional().nullable(),
  
  overallLengthMm: z.number().int().optional().nullable(),
  overallWidthMm: z.number().int().optional().nullable(),
  overallHeightMm: z.number().int().optional().nullable(),
  loadBodyLengthMm: z.number().int().optional().nullable(),
  loadBodyWidthMm: z.number().int().optional().nullable(),
  loadBodyHeightMm: z.number().int().optional().nullable(),
  turningRadiusM: z.number().optional().nullable(),
  
  featureTagIds: z.array(z.string()).optional().nullable(),
  
  askingPriceInr: z.number().optional().nullable(),
  negotiable: z.boolean().optional().default(false),
  financeAvailable: z.boolean().optional().default(false),
  gstSlab: z.string().optional().nullable(),
  vendorPriceInr: z.number().optional().nullable(),
  targetMarginInr: z.number().optional().nullable(),
  
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
  
  videoUrl: z.string().optional().nullable(),
  brochureUrl: z.string().optional().nullable(),
  watermarkEnabled: z.boolean().optional().default(true),
  
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'RESERVED', 'SOLD', 'ARCHIVED']),
  visibility: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: any;
}

interface Options {
  makes: { id: string; name: string }[];
  models: { id: string; name: string; makeId: string }[];
  variants: { id: string; name: string; modelId: string }[];
  bodyTypes: { id: string; name: string }[];
  axleConfigs: { id: string; name: string }[];
  fuelTypes: { id: string; name: string }[];
  emissionNorms: { id: string; name: string }[];
  transmissions: { id: string; name: string }[];
  featureTags: { id: string; name: string }[];
}

export function VehicleForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPublishGuard, setShowPublishGuard] = useState(false);
  const [options, setOptions] = useState<Options>({
    makes: [],
    models: [],
    variants: [],
    bodyTypes: [],
    axleConfigs: [],
    fuelTypes: [],
    emissionNorms: [],
    transmissions: [],
    featureTags: [],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: initialData?.condition || 'NEW',
      makeId: initialData?.makeId || '',
      modelId: initialData?.modelId || '',
      variantId: initialData?.variantId || null,
      modelYear: initialData?.modelYear || new Date().getFullYear(),
      bodyTypeId: initialData?.bodyTypeId || '',
      axleConfigId: initialData?.axleConfigId || '',
      title: initialData?.title || '',
      coverUrl: initialData?.coverUrl || null,
      galleryJson: initialData?.galleryJson || [],
      
      wheelbaseMm: initialData?.wheelbaseMm || null,
      gvwT: initialData?.gvwT || null,
      gcwT: initialData?.gcwT || null,
      payloadT: initialData?.payloadT || null,
      
      cabinType: initialData?.cabinType || null,
      hasAc: initialData?.hasAc || false,
      suspensionFront: initialData?.suspensionFront || null,
      suspensionRear: initialData?.suspensionRear || null,
      brakeType: initialData?.brakeType || null,
      tyreSize: initialData?.tyreSize || null,
      tyreCount: initialData?.tyreCount || null,
      
      engineCc: initialData?.engineCc || null,
      powerHp: initialData?.powerHp || null,
      powerKw: initialData?.powerKw || null,
      torqueNm: initialData?.torqueNm || null,
      fuelTypeId: initialData?.fuelTypeId || null,
      emissionNormId: initialData?.emissionNormId || null,
      transmissionId: initialData?.transmissionId || null,
      gears: initialData?.gears || null,
      finalDriveRatio: initialData?.finalDriveRatio || null,
      
      overallLengthMm: initialData?.overallLengthMm || null,
      overallWidthMm: initialData?.overallWidthMm || null,
      overallHeightMm: initialData?.overallHeightMm || null,
      loadBodyLengthMm: initialData?.loadBodyLengthMm || null,
      loadBodyWidthMm: initialData?.loadBodyWidthMm || null,
      loadBodyHeightMm: initialData?.loadBodyHeightMm || null,
      turningRadiusM: initialData?.turningRadiusM || null,
      
      featureTagIds: initialData?.featureTags?.map((ft: any) => ft.featureTagId) || [],
      
      askingPriceInr: initialData?.askingPriceInr || null,
      negotiable: initialData?.negotiable || false,
      financeAvailable: initialData?.financeAvailable || false,
      gstSlab: initialData?.gstSlab || null,
      vendorPriceInr: initialData?.vendorPriceInr || null,
      targetMarginInr: initialData?.targetMarginInr || null,
      
      city: initialData?.city || null,
      state: initialData?.state || null,
      pincode: initialData?.pincode || null,
      latitude: initialData?.latitude || null,
      longitude: initialData?.longitude || null,
      contactPhone: initialData?.contactPhone || null,
      contactWhatsapp: initialData?.contactWhatsapp || null,
      
      regNo: initialData?.regNo || null,
      regDate: initialData?.regDate || null,
      ownershipCount: initialData?.ownershipCount || null,
      insuranceType: initialData?.insuranceType || null,
      insuranceExpiry: initialData?.insuranceExpiry || null,
      fitnessExpiry: initialData?.fitnessExpiry || null,
      pucExpiry: initialData?.pucExpiry || null,
      permitStatesJson: initialData?.permitStatesJson || [],
      hypothecationBank: initialData?.hypothecationBank || null,
      
      videoUrl: initialData?.videoUrl || null,
      brochureUrl: initialData?.brochureUrl || null,
      watermarkEnabled: initialData?.watermarkEnabled ?? true,
      
      metaTitle: initialData?.metaTitle || null,
      metaDescription: initialData?.metaDescription || null,
      slug: initialData?.slug || null,
      
      status: initialData?.status || 'DRAFT',
      visibility: initialData?.visibility || false,
    },
  });

  const watchedValues = form.watch();
  const condition = form.watch('condition');
  const makeId = form.watch('makeId');
  const modelId = form.watch('modelId');
  const powerHp = form.watch('powerHp');
  const powerKw = form.watch('powerKw');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [makesRes, bodyTypesRes, axleConfigsRes, fuelTypesRes, emissionNormsRes, transmissionsRes, featureTagsRes] = await Promise.all([
          fetch('/api/jammanage/vehicles/makes'),
          fetch('/api/jammanage/vehicles/body-types'),
          fetch('/api/jammanage/vehicles/axle-config'),
          fetch('/api/jammanage/vehicles/fuel-types'),
          fetch('/api/jammanage/vehicles/emission-norms'),
          fetch('/api/jammanage/vehicles/transmissions'),
          fetch('/api/jammanage/vehicles/feature-tags'),
        ]);

        const [makes, bodyTypes, axleConfigs, fuelTypes, emissionNorms, transmissions, featureTags] = await Promise.all([
          makesRes.json(),
          bodyTypesRes.json(),
          axleConfigsRes.json(),
          fuelTypesRes.json(),
          emissionNormsRes.json(),
          transmissionsRes.json(),
          featureTagsRes.json(),
        ]);

        setOptions({
          makes: makes.data || [],
          models: [],
          variants: [],
          bodyTypes: bodyTypes.data || [],
          axleConfigs: axleConfigs.data || [],
          fuelTypes: fuelTypes.data || [],
          emissionNorms: emissionNorms.data || [],
          transmissions: transmissions.data || [],
          featureTags: featureTags.data || [],
        });
      } catch (error) {
        console.error('Failed to fetch options:', error);
        toast.error('Failed to load form options');
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (makeId) {
      fetch(`/api/jammanage/vehicles/models?makeId=${makeId}`)
        .then((res) => res.json())
        .then((data) => {
          setOptions((prev) => ({ ...prev, models: data.data || [] }));
        })
        .catch(console.error);
    } else {
      setOptions((prev) => ({ ...prev, models: [], variants: [] }));
      form.setValue('modelId', '');
      form.setValue('variantId', null);
    }
  }, [makeId, form]);

  useEffect(() => {
    if (modelId) {
      fetch(`/api/jammanage/vehicles/variants?modelId=${modelId}`)
        .then((res) => res.json())
        .then((data) => {
          setOptions((prev) => ({ ...prev, variants: data.data || [] }));
        })
        .catch(console.error);
    } else {
      setOptions((prev) => ({ ...prev, variants: [] }));
      form.setValue('variantId', null);
    }
  }, [modelId, form]);

  useEffect(() => {
    const generateTitle = async () => {
      const { makeId, modelId, variantId, modelYear, bodyTypeId, axleConfigId } = form.getValues();
      
      if (!makeId || !modelId || !bodyTypeId || !axleConfigId) return;

      const make = options.makes.find((m) => m.id === makeId);
      const model = options.models.find((m) => m.id === modelId);
      const variant = variantId ? options.variants.find((v) => v.id === variantId) : null;
      const bodyType = options.bodyTypes.find((b) => b.id === bodyTypeId);
      const axleConfig = options.axleConfigs.find((a) => a.id === axleConfigId);

      const parts = [
        modelYear,
        make?.name,
        model?.name,
        variant?.name,
        axleConfig?.name,
        bodyType?.name,
      ].filter(Boolean);

      const title = parts.join(' ');
      if (title && !form.getValues('title')) {
        form.setValue('title', title);
      }
      
      if (title && !form.getValues('slug') && !isEdit) {
        const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        form.setValue('slug', slug);
      }
    };

    generateTitle();
  }, [watchedValues.makeId, watchedValues.modelId, watchedValues.variantId, watchedValues.modelYear, watchedValues.bodyTypeId, watchedValues.axleConfigId, options, form, isEdit]);

  const handlePowerHpChange = useCallback((value: string) => {
    const hp = parseFloat(value);
    if (!isNaN(hp) && hp > 0) {
      const kw = hp * 0.7457;
      form.setValue('powerKw', parseFloat(kw.toFixed(2)));
    }
  }, [form]);

  const handlePowerKwChange = useCallback((value: string) => {
    const kw = parseFloat(value);
    if (!isNaN(kw) && kw > 0) {
      const hp = kw / 0.7457;
      form.setValue('powerHp', parseFloat(hp.toFixed(2)));
    }
  }, [form]);

  const autoSave = useCallback(async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const data = form.getValues();
      
      const url = isEdit
        ? `/api/jammanage/vehicles/${initialData.id}`
        : '/api/jammanage/vehicles';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      setLastSaved(new Date());
      toast.success('Draft saved', { duration: 1500 });

      if (!isEdit) {
        const result = await response.json();
        router.replace(`/jammanage/vehicles/${result.data.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  }, [form, isEdit, initialData, router, isSaving]);

  const validateForPublish = () => {
    const values = form.getValues();
    const errors: string[] = [];

    if (!values.condition) errors.push('Condition is required');
    if (!values.makeId) errors.push('Make is required');
    if (!values.modelId) errors.push('Model is required');
    if (!values.modelYear) errors.push('Model Year is required');
    if (!values.bodyTypeId) errors.push('Body Type is required');
    if (!values.axleConfigId) errors.push('Axle Configuration is required');
    if (!values.coverUrl) errors.push('Cover Image is required');
    if (!values.askingPriceInr) errors.push('Asking Price is required');
    if (!values.city) errors.push('City is required');
    if (!values.state) errors.push('State is required');
    if (!values.pincode) errors.push('Pincode is required');
    if (!values.contactPhone) errors.push('Contact Phone is required');

    return errors;
  };

  const handlePublish = async () => {
    const errors = validateForPublish();
    
    if (errors.length > 0) {
      setShowPublishGuard(true);
      return;
    }

    try {
      setIsSaving(true);
      const data = { ...form.getValues(), status: 'PUBLISHED', visibility: true };
      
      const url = isEdit
        ? `/api/jammanage/vehicles/${initialData.id}`
        : '/api/jammanage/vehicles';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to publish');

      toast.success('Vehicle published successfully');
      router.push('/jammanage/vehicles');
      router.refresh();
    } catch (error) {
      toast.error('Failed to publish vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    await autoSave();
  };

  const filteredModels = useMemo(() => {
    return options.models.filter((model) => model.makeId === makeId);
  }, [options.models, makeId]);

  const filteredVariants = useMemo(() => {
    return options.variants.filter((variant) => variant.modelId === modelId);
  }, [options.variants, modelId]);

  const summaryData = useMemo(() => {
    const make = options.makes.find((m) => m.id === watchedValues.makeId);
    const model = options.models.find((m) => m.id === watchedValues.modelId);
    const bodyType = options.bodyTypes.find((b) => b.id === watchedValues.bodyTypeId);
    const axleConfig = options.axleConfigs.find((a) => a.id === watchedValues.axleConfigId);

    return {
      title: watchedValues.title || 'Untitled Vehicle',
      price: watchedValues.askingPriceInr,
      make: make?.name,
      model: model?.name,
      bodyType: bodyType?.name,
      axleConfig: axleConfig?.name,
      coverUrl: watchedValues.coverUrl,
    };
  }, [watchedValues, options]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      RESERVED: 'bg-blue-100 text-blue-800',
      SOLD: 'bg-purple-100 text-purple-800',
      ARCHIVED: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.DRAFT;
  };

  const getSavedAgoText = () => {
    if (!lastSaved) return '';
    
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return `Saved ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Saved ${hours}h ago`;
  };

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <div className="sticky top-0 z-10 bg-background py-4 border-b">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/jammanage/vehicles')}>
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">
                {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h1>
              <Badge className={getStatusColor(watchedValues.status)}>
                {watchedValues.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {getSavedAgoText()}
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="size-4 mr-2" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isSaving}
              >
                Publish
              </Button>

              {isEdit && (
                <Button variant="outline" size="sm">
                  <Eye className="size-4 mr-2" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="lg:py-7.5">
                <Form {...form}>
                  <form className="flex flex-col gap-5 lg:gap-7.5">
                    <Stepper value={currentStep} onValueChange={setCurrentStep}>
                      <StepperNav className="mb-8">
                        {[
                          { step: 1, title: 'Basics' },
                          { step: 2, title: 'Specs' },
                          { step: 3, title: 'Commercials' },
                          { step: 4, title: 'Media & SEO' },
                        ].map(({ step, title }) => (
                          <StepperItem key={step} step={step}>
                            <StepperTrigger>
                              <StepperIndicator>{step}</StepperIndicator>
                              <StepperTitle className="hidden sm:block">{title}</StepperTitle>
                            </StepperTrigger>
                            {step < 4 && <StepperSeparator />}
                          </StepperItem>
                        ))}
                      </StepperNav>

                      <StepperPanel>
                        <StepperContent value={1}>
                          <StepBasics form={form} options={options} />
                        </StepperContent>

                        <StepperContent value={2}>
                          <StepSpecs 
                            form={form} 
                            options={options}
                            onPowerHpChange={handlePowerHpChange}
                            onPowerKwChange={handlePowerKwChange}
                          />
                        </StepperContent>

                        <StepperContent value={3}>
                          <StepCommercials form={form} />
                        </StepperContent>

                        <StepperContent value={4}>
                          <StepMediaSeo form={form} condition={condition} />
                        </StepperContent>
                      </StepperPanel>
                    </Stepper>

                    <div className="flex items-center justify-between gap-3 pt-5 border-t">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCurrentStep(currentStep - 1);
                            autoSave();
                          }}
                        >
                          <ChevronLeft className="size-4 mr-2" />
                          Previous
                        </Button>
                      )}

                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={() => {
                            setCurrentStep(currentStep + 1);
                            autoSave();
                          }}
                          className="ml-auto"
                        >
                          Next
                          <ChevronRight className="size-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={isSaving}
                          className="ml-auto"
                        >
                          <Save className="size-4 mr-2" />
                          Save
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card>
                <CardContent className="lg:py-7.5">
                  <h3 className="text-lg font-semibold mb-4">Summary</h3>
                  
                  {summaryData.coverUrl && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                      <img 
                        src={summaryData.coverUrl} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">{summaryData.title}</p>
                    </div>

                    {summaryData.price && (
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-lg font-semibold">
                          ₹{summaryData.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}

                    {summaryData.make && (
                      <div>
                        <p className="text-sm text-muted-foreground">Make</p>
                        <p className="font-medium">{summaryData.make}</p>
                      </div>
                    )}

                    {summaryData.model && (
                      <div>
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-medium">{summaryData.model}</p>
                      </div>
                    )}

                    {summaryData.axleConfig && (
                      <div>
                        <p className="text-sm text-muted-foreground">Axle Config</p>
                        <p className="font-medium">{summaryData.axleConfig}</p>
                      </div>
                    )}

                    {summaryData.bodyType && (
                      <div>
                        <p className="text-sm text-muted-foreground">Body Type</p>
                        <p className="font-medium">{summaryData.bodyType}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showPublishGuard} onOpenChange={setShowPublishGuard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-yellow-500" />
              Cannot Publish
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please complete the following required fields before publishing:
              <ul className="list-disc list-inside mt-2 space-y-1">
                {validateForPublish().map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPublishGuard(false)}>
              Continue Editing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StepBasics({ form, options }: any) {
  const makeId = form.watch('makeId');
  const modelId = form.watch('modelId');

  const filteredModels = useMemo(() => {
    return options.models.filter((model: any) => model.makeId === makeId);
  }, [options.models, makeId]);

  const filteredVariants = useMemo(() => {
    return options.variants.filter((variant: any) => variant.modelId === modelId);
  }, [options.variants, modelId]);

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div className="space-y-5 lg:space-y-7.5">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition *</FormLabel>
                <FormControl>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={field.value === 'NEW' ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => field.onChange('NEW')}
                    >
                      NEW
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'USED' ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => field.onChange('USED')}
                    >
                      USED
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
            <FormField
              control={form.control}
              name="makeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.makes.map((make: any) => (
                        <SelectItem key={make.id} value={make.id}>
                          {make.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!makeId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredModels.map((model: any) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                    disabled={!modelId || filteredVariants.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredVariants.map((variant: any) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Year *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="YYYY"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bodyTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.bodyTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="axleConfigId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Axle Configuration *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select axle config" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.axleConfigs.map((config: any) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated from vehicle details" {...field} />
                </FormControl>
                <FormDescription>
                  Leave empty to auto-generate from vehicle details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image *</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Image URL" {...field} value={field.value || ''} />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="size-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Required for publishing
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function StepSpecs({ form, options, onPowerHpChange, onPowerKwChange }: any) {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="wheelbaseMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wheelbase (mm)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="3500"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gvwT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GVW (t)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="7.5"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      t
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gcwT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GCW (t)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="16.2"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      t
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payloadT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payload (t)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      t
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Chassis & Cabin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="cabinType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cabin Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cabin type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Day Cab">Day Cab</SelectItem>
                    <SelectItem value="Sleeper Cab">Sleeper Cab</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasAc"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Air Conditioning</FormLabel>
                  <FormDescription>Has AC</FormDescription>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suspensionFront"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Front Suspension</FormLabel>
                <FormControl>
                  <Input placeholder="Parabolic leaf spring" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suspensionRear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rear Suspension</FormLabel>
                <FormControl>
                  <Input placeholder="Semi-elliptic leaf spring" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brakeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brake Type</FormLabel>
                <FormControl>
                  <Input placeholder="Air brakes" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tyreSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tyre Size</FormLabel>
                <FormControl>
                  <Input placeholder="9.00 x 20" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tyreCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tyre Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="6"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Engine & Driveline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="engineCc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engine CC</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="5660"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cc
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="powerHp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power (HP)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="140"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value ? parseFloat(e.target.value) : null);
                        onPowerHpChange(e.target.value);
                      }}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      HP
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="powerKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power (kW)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="104"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value ? parseFloat(e.target.value) : null);
                        onPowerKwChange(e.target.value);
                      }}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      kW
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="torqueNm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Torque</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="450"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      Nm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.fuelTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emissionNormId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emission Norm</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emission norm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.emissionNorms.map((norm: any) => (
                      <SelectItem key={norm.id} value={norm.id}>
                        {norm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transmissionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.transmissions.map((transmission: any) => (
                      <SelectItem key={transmission.id} value={transmission.id}>
                        {transmission.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gears</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finalDriveRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Drive Ratio</FormLabel>
                <FormControl>
                  <Input placeholder="6.33:1" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="overallLengthMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Length</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="6200"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overallWidthMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Width</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="2400"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overallHeightMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Height</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="2800"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loadBodyLengthMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Body Length</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="4000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loadBodyWidthMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Body Width</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="2000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loadBodyHeightMm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Body Height</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="1800"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      mm
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="turningRadiusM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turning Radius</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="7.5"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      m
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Features</h3>
        <FormField
          control={form.control}
          name="featureTagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feature Tags</FormLabel>
              <FormDescription>Select features that apply to this vehicle</FormDescription>
              <FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.featureTags.map((tag: any) => {
                    const isSelected = field.value?.includes(tag.id);
                    return (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={isSelected ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const current = field.value || [];
                          if (isSelected) {
                            field.onChange(current.filter((id: string) => id !== tag.id));
                          } else {
                            field.onChange([...current, tag.id]);
                          }
                        }}
                      >
                        {tag.name}
                      </Button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function StepCommercials({ form }: any) {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="askingPriceInr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asking Price *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="1850000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstSlab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Slab</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST slab" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0%">0%</SelectItem>
                    <SelectItem value="5%">5%</SelectItem>
                    <SelectItem value="12%">12%</SelectItem>
                    <SelectItem value="18%">18%</SelectItem>
                    <SelectItem value="28%">28%</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="negotiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Negotiable</FormLabel>
                  <FormDescription>Price is negotiable</FormDescription>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="financeAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Finance Available</FormLabel>
                  <FormDescription>Financing options available</FormDescription>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-5 lg:p-7.5">
        <h3 className="text-lg font-semibold mb-4">Internal Pricing (Hidden from frontend)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="vendorPriceInr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="1700000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetMarginInr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Margin</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="150000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value || ''}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State *</FormLabel>
                <FormControl>
                  <Input placeholder="Maharashtra" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode *</FormLabel>
                <FormControl>
                  <Input placeholder="400001" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="+91 98765 43210" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactWhatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="+91 98765 43210" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="19.0760"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="72.8777"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function StepMediaSeo({ form, condition }: any) {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div>
        <h3 className="text-lg font-semibold mb-4">Media</h3>
        <div className="space-y-5 lg:space-y-7.5">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/..." {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brochureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brochure URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="watermarkEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Watermark Enabled</FormLabel>
                  <FormDescription>Add watermark to images</FormDescription>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {condition === 'USED' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Used Vehicle Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
            <FormField
              control={form.control}
              name="regNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="MH01AB1234" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownershipCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ownership Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="Third Party">Third Party</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Expiry</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fitnessExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Expiry</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pucExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PUC Expiry</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hypothecationBank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hypothecation Bank</FormLabel>
                  <FormControl>
                    <Input placeholder="Bank name" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">SEO</h3>
        <div className="space-y-5 lg:space-y-7.5">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="auto-generated-from-title" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Auto-generated from title, but you can customize it
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Defaults to title" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description for search engines (160-180 characters)"
                    rows={3}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0} / 180 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Visibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7.5">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Visible</FormLabel>
                  <FormDescription>Show on frontend</FormDescription>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
