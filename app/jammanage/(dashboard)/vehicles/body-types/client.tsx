'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface VehicleBodyType {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  usageCount: number;
  updatedAt: Date;
}

interface Props {
  bodyTypes: VehicleBodyType[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function VehicleBodyTypesClient({
  bodyTypes,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    if (statusFilter) params.set('status', statusFilter);
    router.push(`/jammanage/vehicles/body-types?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (value && value !== 'all') params.set('status', value);
    router.push(`/jammanage/vehicles/body-types?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/jammanage/vehicles/body-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Body type deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete body type');
    }
  };

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <div className="flex flex-wrap items-center gap-5 justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Vehicle Body Types
          </h1>
          <Button asChild>
            <Link href="/jammanage/vehicles/body-types/new">
              <Plus className="size-4 mr-2" />
              Add Body Type
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-base">
                All Body Types ({totalCount})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search body types..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {bodyTypes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No body types found
                </p>
                <Button asChild variant="outline">
                  <Link href="/jammanage/vehicles/body-types/new">
                    <Plus className="size-4 mr-2" />
                    Add your first body type
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bodyTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/jammanage/vehicles/body-types/${type.id}`}
                            className="hover:text-primary"
                          >
                            {type.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {type.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              type.status === 'ACTIVE' ? 'success' : 'secondary'
                            }
                          >
                            {type.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{type.usageCount}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(type.updatedAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              mode="icon"
                            >
                              <Link href={`/jammanage/vehicles/body-types/${type.id}`}>
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                            {type.usageCount === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                mode="icon"
                                onClick={() => handleDelete(type.id, type.name)}
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      router.push(
                        `/jammanage/vehicles/body-types?page=${currentPage - 1}`,
                      )
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      router.push(
                        `/jammanage/vehicles/body-types?page=${currentPage + 1}`,
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
