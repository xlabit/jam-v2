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
  makeId: z.string().min(1, 'Make is required'),
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  description: z.string().optional(),
  defaultsJson: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type FormValues = z.infer<typeof formSchema>;

interface VehicleModel {
  id: string;
  makeId: string;
  name: string;
  description: string | null;
  defaultsJson: any;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  model?: VehicleModel;
}

export function VehicleModelForm({ model }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makes, setMakes] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      makeId: model?.makeId || '',
      name: model?.name || '',
      description: model?.description || '',
      defaultsJson: model?.defaultsJson ? JSON.stringify(model.defaultsJson, null, 2) : '',
      status: model?.status || 'ACTIVE',
    },
  });

  useEffect(() => {
    async function fetchMakes() {
      try {
        const response = await fetch('/api/jammanage/vehicles/makes?pageSize=1000&status=ACTIVE');
        const data = await response.json();
        setMakes(data.data || []);
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    }
    fetchMakes();
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

      const url = model
        ? `/api/jammanage/vehicles/models/${model.id}`
        : '/api/jammanage/vehicles/models';

      const response = await fetch(url, {
        method: model ? 'PATCH' : 'POST',
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
        model
          ? 'Vehicle model updated successfully'
          : 'Vehicle model created successfully',
      );

      router.push('/jammanage/vehicles/models');
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
                    <Link href="/jammanage/vehicles/models">
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-mono">
                      {model ? 'Edit' : 'New'} Vehicle Model
                    </h2>
                    <p className="text-sm text-secondary-foreground">
                      Complete the form below to {model ? 'update' : 'add a new'} vehicle model
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="makeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Make <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {makes.map((make) => (
                            <SelectItem key={make.id} value={make.id}>
                              {make.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the vehicle make for this model
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
                        <Input placeholder="Enter model name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique name for this vehicle model
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
                        Optional JSON object with default values for vehicles of this model
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
                        Inactive models will be hidden from selection
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2.5">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="size-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Model'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/jammanage/vehicles/models')}
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
