'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from 'sonner';
import Link from 'next/link';

const formSchema = z.object({
  modelId: z.string().min(1, 'Model is required'),
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  description: z.string().optional(),
  defaultsJson: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type FormValues = z.infer<typeof formSchema>;

interface VehicleVariant {
  id: string;
  modelId: string;
  name: string;
  description: string | null;
  defaultsJson: any;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  variant?: VehicleVariant;
}

export function VehicleVariantForm({ variant }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [models, setModels] = useState<{ id: string; name: string; make: { name: string } }[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelId: variant?.modelId || '',
      name: variant?.name || '',
      description: variant?.description || '',
      defaultsJson: variant?.defaultsJson ? JSON.stringify(variant.defaultsJson, null, 2) : '',
      status: variant?.status || 'ACTIVE',
    },
  });

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/jammanage/vehicles/models?pageSize=1000&status=ACTIVE');
        const data = await response.json();
        setModels(data.data || []);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    }
    fetchModels();
  }, []);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      let defaultsJson = null;
      if (values.defaultsJson) {
        try {
          defaultsJson = JSON.parse(values.defaultsJson);
        } catch (e) {
          toast.error('Invalid JSON in defaults field');
          setIsSubmitting(false);
          return;
        }
      }

      const url = variant
        ? `/api/jammanage/vehicles/variants/${variant.id}`
        : '/api/jammanage/vehicles/variants';

      const response = await fetch(url, {
        method: variant ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          defaultsJson,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save');
      }

      toast.success(
        variant
          ? 'Vehicle variant updated successfully'
          : 'Vehicle variant created successfully',
      );

      router.push('/jammanage/vehicles/variants');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-fixed">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 lg:gap-7.5">
          <Card>
            <CardContent className="lg:py-7.5">
              <div className="flex flex-col gap-5 lg:gap-7.5">
                <div className="flex items-center gap-4">
                  <Button asChild variant="ghost" size="sm" mode="icon">
                    <Link href="/jammanage/vehicles/variants">
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-mono">
                      {variant ? 'Edit' : 'New'} Vehicle Variant
                    </h2>
                    <p className="text-sm text-secondary-foreground">
                      Complete the form below to {variant ? 'update' : 'add a new'} vehicle variant
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="modelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Model <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.make.name} {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the vehicle model for this variant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter variant name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique name for this vehicle variant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description (optional)"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultsJson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Defaults JSON</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{"engineCc": 2500, "powerHp": 150}'
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional JSON object with default values for vehicles of this variant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Inactive variants will be hidden from selection
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2.5">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="size-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Variant'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/jammanage/vehicles/variants')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
