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

interface VehicleFeatureTag {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  usageCount: number;
  updatedAt: Date;
}

interface Props {
  featureTags: VehicleFeatureTag[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function VehicleFeatureTagsClient({
  featureTags,
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
    router.push(`/jammanage/vehicles/feature-tags?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (value && value !== 'all') params.set('status', value);
    router.push(`/jammanage/vehicles/feature-tags?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/jammanage/vehicles/feature-tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Feature tag deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete feature tag');
    }
  };

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <div className="flex flex-wrap items-center gap-5 justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Vehicle Feature Tags
          </h1>
          <Button asChild>
            <Link href="/jammanage/vehicles/feature-tags/new">
              <Plus className="size-4 mr-2" />
              Add Feature Tag
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-base">
                All Feature Tags ({totalCount})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feature tags..."
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
            {featureTags.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No feature tags found
                </p>
                <Button asChild variant="outline">
                  <Link href="/jammanage/vehicles/feature-tags/new">
                    <Plus className="size-4 mr-2" />
                    Add your first feature tag
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
                    {featureTags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/jammanage/vehicles/feature-tags/${tag.id}`}
                            className="hover:text-primary"
                          >
                            {tag.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {tag.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tag.status === 'ACTIVE' ? 'success' : 'secondary'
                            }
                          >
                            {tag.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{tag.usageCount}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(tag.updatedAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              mode="icon"
                            >
                              <Link href={`/jammanage/vehicles/feature-tags/${tag.id}`}>
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                            {tag.usageCount === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                mode="icon"
                                onClick={() => handleDelete(tag.id, tag.name)}
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
                        `/jammanage/vehicles/feature-tags?page=${currentPage - 1}`,
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
                        `/jammanage/vehicles/feature-tags?page=${currentPage + 1}`,
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
