'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit } from 'lucide-react';
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

interface ServiceCenter {
  id: string;
  name: string;
  city: string;
  state: string;
  primaryPhone: string;
  status: string;
  updatedAt: Date;
  type: { name: string };
  brands: { brand: { name: string } }[];
  services: { serviceType: { name: string } }[];
}

interface Props {
  centers: ServiceCenter[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function ServiceCentersClient({
  centers,
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
    router.push(`/jammanage/service-centers?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (value && value !== 'all') params.set('status', value);
    router.push(`/jammanage/service-centers?${params.toString()}`);
  };

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <div className="flex flex-wrap items-center gap-5 justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Service Centers
          </h1>
          <Button asChild>
            <Link href="/jammanage/service-centers/new">
              <Plus className="size-4 mr-2" />
              Add Service Center
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-base">
                All Service Centers ({totalCount})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search centers..."
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
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {centers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No service centers found
                </p>
                <Button asChild variant="outline">
                  <Link href="/jammanage/service-centers/new">
                    <Plus className="size-4 mr-2" />
                    Add your first service center
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Brands</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centers.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/jammanage/service-centers/${center.id}`}
                            className="hover:text-primary"
                          >
                            {center.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {center.type.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {center.brands
                            .slice(0, 2)
                            .map((b) => b.brand.name)
                            .join(', ')}
                          {center.brands.length > 2 &&
                            ` +${center.brands.length - 2}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {center.city}, {center.state}
                        </TableCell>
                        <TableCell>{center.primaryPhone}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              center.status === 'ACTIVE'
                                ? 'success'
                                : center.status === 'DRAFT'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {center.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            mode="icon"
                          >
                            <Link
                              href={`/jammanage/service-centers/${center.id}`}
                            >
                              <Edit className="size-4" />
                            </Link>
                          </Button>
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
                        `/jammanage/service-centers?page=${currentPage - 1}`,
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
                        `/jammanage/service-centers?page=${currentPage + 1}`,
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
