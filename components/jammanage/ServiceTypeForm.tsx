'use client';

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
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    status: string;
  };
}

export function ServiceTypeForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: (initialData?.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const url = isEdit
        ? `/api/jammanage/service-types/${initialData.id}`
        : '/api/jammanage/service-types';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast.success(
        isEdit
          ? 'Service type updated successfully'
          : 'Service type created successfully',
      );
      router.push('/jammanage/service-types');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async () => {
    if (!isEdit || !confirm('Are you sure you want to delete this service type?'))
      return;

    try {
      const response = await fetch(
        `/api/jammanage/service-types/${initialData.id}`,
        { method: 'DELETE' },
      );

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Service type deleted successfully');
      router.push('/jammanage/service-types');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete service type');
    }
  };

  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 lg:gap-7.5">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold text-mono">
                {isEdit ? 'Edit Service Type' : 'New Service Type'}
              </h2>
              <p className="text-sm text-secondary-foreground">
                Complete the form below to {isEdit ? 'update' : 'add a new'} service type
              </p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Oil Change, Tire Rotation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the service type"
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
                  <FormLabel>Status</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2.5">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Service Type'
                    : 'Create Service Type'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              {isEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="ml-auto"
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
