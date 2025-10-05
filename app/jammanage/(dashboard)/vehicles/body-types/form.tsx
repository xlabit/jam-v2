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

interface VehicleBodyType {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  bodyType?: VehicleBodyType;
}

export function VehicleBodyTypeForm({ bodyType }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bodyType?.name || '',
      description: bodyType?.description || '',
      status: bodyType?.status || 'ACTIVE',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const url = bodyType
        ? `/api/jammanage/vehicles/body-types/${bodyType.id}`
        : '/api/jammanage/vehicles/body-types';

      const response = await fetch(url, {
        method: bodyType ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save');
      }

      toast.success(
        bodyType
          ? 'Body type updated successfully'
          : 'Body type created successfully',
      );

      router.push('/jammanage/vehicles/body-types');
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
                    <Link href="/jammanage/vehicles/body-types">
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-mono">
                      {bodyType ? 'Edit' : 'New'} Vehicle Body Type
                    </h2>
                    <p className="text-sm text-secondary-foreground">
                      Complete the form below to {bodyType ? 'update' : 'add a new'} body type
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
                        <Input placeholder="Enter body type name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique name for this body type
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
                        Inactive body types will be hidden from selection
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2.5">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="size-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Body Type'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/jammanage/vehicles/body-types')}
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
