'use client';

import { useState } from 'react';
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
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type FormValues = z.infer<typeof formSchema>;

interface VehicleEmissionNorm {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  emissionNorm?: VehicleEmissionNorm;
}

export function VehicleEmissionNormForm({ emissionNorm }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: emissionNorm?.name || '',
      description: emissionNorm?.description || '',
      status: emissionNorm?.status || 'ACTIVE',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const url = emissionNorm
        ? `/api/jammanage/vehicles/emission-norms/${emissionNorm.id}`
        : '/api/jammanage/vehicles/emission-norms';

      const response = await fetch(url, {
        method: emissionNorm ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save');
      }

      toast.success(
        emissionNorm
          ? 'Emission norm updated successfully'
          : 'Emission norm created successfully',
      );

      router.push('/jammanage/vehicles/emission-norms');
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
                    <Link href="/jammanage/vehicles/emission-norms">
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-mono">
                      {emissionNorm ? 'Edit' : 'New'} Emission Norm
                    </h2>
                    <p className="text-sm text-secondary-foreground">
                      Complete the form below to {emissionNorm ? 'update' : 'add a new'} emission norm
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter emission norm name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique name for this emission norm
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
                        Inactive emission norms will be hidden from selection
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2.5">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="size-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Emission Norm'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/jammanage/vehicles/emission-norms')}
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
