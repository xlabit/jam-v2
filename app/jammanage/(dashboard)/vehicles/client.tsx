'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Archive,
  CheckCircle2,
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Vehicle {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  condition: 'NEW' | 'USED';
  modelYear: number;
  askingPriceInr: number;
  city: string;
  state: string;
  status: string;
  updatedAt: string;
  make: { id: string; name: string };
  model: { id: string; name: string };
  bodyType: { id: string; name: string };
  axleConfig: { id: string; name: string };
}

interface FilterOption {
  id: string;
  name: string;
}

export function VehiclesClient() {
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [makeId, setMakeId] = useState('');
  const [modelId, setModelId] = useState('');
  const [bodyTypeId, setBodyTypeId] = useState('');
  const [axleConfigId, setAxleConfigId] = useState('');
  const [fuelTypeId, setFuelTypeId] = useState('');
  const [emissionNormId, setEmissionNormId] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (condition) params.set('condition', condition);
    if (makeId) params.set('makeId', makeId);
    if (modelId) params.set('modelId', modelId);
    if (bodyTypeId) params.set('bodyTypeId', bodyTypeId);
    if (axleConfigId) params.set('axleConfigId', axleConfigId);
    if (fuelTypeId) params.set('fuelTypeId', fuelTypeId);
    if (emissionNormId) params.set('emissionNormId', emissionNormId);
    if (status) params.set('status', status);
    if (city) params.set('city', city);
    if (state) params.set('state', state);
    if (yearMin) params.set('yearMin', yearMin);
    if (yearMax) params.set('yearMax', yearMax);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    return params.toString();
  };

  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ['vehicles', search, condition, makeId, modelId, bodyTypeId, axleConfigId, fuelTypeId, emissionNormId, status, city, state, yearMin, yearMax, priceMin, priceMax, sortBy, sortOrder, page, limit],
    queryFn: async () => {
      const res = await fetch(`/api/jammanage/vehicles?${buildQueryParams()}`);
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      return res.json();
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  const { data: makesData } = useQuery({
    queryKey: ['vehicle-makes'],
    queryFn: async () => {
      const res = await fetch('/api/jammanage/vehicles/makes?pageSize=1000&status=ACTIVE');
      if (!res.ok) throw new Error('Failed to fetch makes');
      return res.json();
    },
    staleTime: Infinity,
  });

  const { data: modelsData } = useQuery({
    queryKey: ['vehicle-models', makeId],
    queryFn: async () => {
      const params = new URLSearchParams({ pageSize: '1000', status: 'ACTIVE' });
      if (makeId) params.set('makeId', makeId);
      const res = await fetch(`/api/jammanage/vehicles/models?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch models');
      return res.json();
    },
    enabled: !!makeId,
    staleTime: Infinity,
  });

  const { data: bodyTypesData } = useQuery({
    queryKey: ['vehicle-body-types'],
    queryFn: async () => {
      const res = await fetch('/api/jammanage/vehicles/body-types?pageSize=1000&status=ACTIVE');
      if (!res.ok) throw new Error('Failed to fetch body types');
      return res.json();
    },
    staleTime: Infinity,
  });

  const { data: axleConfigsData } = useQuery({
    queryKey: ['vehicle-axle-configs'],
    queryFn: async () => {
      const res = await fetch('/api/jammanage/vehicles/axle-config?pageSize=1000&status=ACTIVE');
      if (!res.ok) throw new Error('Failed to fetch axle configs');
      return res.json();
    },
    staleTime: Infinity,
  });

  const { data: fuelTypesData } = useQuery({
    queryKey: ['vehicle-fuel-types'],
    queryFn: async () => {
      const res = await fetch('/api/jammanage/vehicles/fuel-types?pageSize=1000&status=ACTIVE');
      if (!res.ok) throw new Error('Failed to fetch fuel types');
      return res.json();
    },
    staleTime: Infinity,
  });

  const { data: emissionNormsData } = useQuery({
    queryKey: ['vehicle-emission-norms'],
    queryFn: async () => {
      const res = await fetch('/api/jammanage/vehicles/emission-norms?pageSize=1000&status=ACTIVE');
      if (!res.ok) throw new Error('Failed to fetch emission norms');
      return res.json();
    },
    staleTime: Infinity,
  });

  const vehicles = vehiclesData?.data || [];
  const totalCount = vehiclesData?.pagination?.total || 0;
  const totalPages = vehiclesData?.pagination?.totalPages || 1;

  const makes = makesData?.data || [];
  const models = modelsData?.data || [];
  const bodyTypes = bodyTypesData?.data || [];
  const axleConfigs = axleConfigsData?.data || [];
  const fuelTypes = fuelTypesData?.data || [];
  const emissionNorms = emissionNormsData?.data || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(vehicles.map((v: Vehicle) => v.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleClearFilters = () => {
    setCondition('');
    setMakeId('');
    setModelId('');
    setBodyTypeId('');
    setAxleConfigId('');
    setFuelTypeId('');
    setEmissionNormId('');
    setStatus('');
    setCity('');
    setState('');
    setYearMin('');
    setYearMax('');
    setPriceMin('');
    setPriceMax('');
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setShowFilters(false);
  };

  const handleBulkAction = (action: string, value?: string) => {
    if (selectedIds.size === 0) {
      toast.error('No vehicles selected');
      return;
    }
    toast.info(`Bulk ${action} feature coming soon for ${selectedIds.size} vehicle(s)`);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="size-3.5 ml-1" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="size-3.5 ml-1" /> : 
      <ArrowDown className="size-3.5 ml-1" />;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'secondary';
      case 'PENDING_REVIEW': return 'warning';
      case 'PUBLISHED': return 'success';
      case 'RESERVED': return 'info';
      case 'SOLD': return 'primary';
      case 'ARCHIVED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'Pending Review';
      default: return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <div className="flex flex-wrap items-center gap-5 justify-between">
          <h1 className="text-xl font-semibold text-foreground">Vehicles</h1>
          <Button asChild>
            <Link href="/jammanage/vehicles/new">
              <Plus className="size-4 mr-2" />
              Add Vehicle
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="lg:py-7.5 gap-5 lg:gap-7.5">
            <div className="flex flex-col gap-5 lg:gap-7.5">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vehicles..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="size-4" />
                        Filters
                        {(condition || makeId || modelId || bodyTypeId || axleConfigId || fuelTypeId || emissionNormId || status || city || state || yearMin || yearMax || priceMin || priceMax) && (
                          <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0.5 text-xs">
                            Active
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] p-4" align="start">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Filter Vehicles</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Condition</label>
                            <Select value={condition} onValueChange={setCondition}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value="NEW">New</SelectItem>
                                <SelectItem value="USED">Used</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                                <SelectItem value="PUBLISHED">Published</SelectItem>
                                <SelectItem value="RESERVED">Reserved</SelectItem>
                                <SelectItem value="SOLD">Sold</SelectItem>
                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Make</label>
                            <Select value={makeId} onValueChange={(val) => {
                              setMakeId(val);
                              setModelId('');
                            }}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {makes.map((make: FilterOption) => (
                                  <SelectItem key={make.id} value={make.id}>{make.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Model</label>
                            <Select value={modelId} onValueChange={setModelId} disabled={!makeId}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {models.map((model: FilterOption) => (
                                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Body Type</label>
                            <Select value={bodyTypeId} onValueChange={setBodyTypeId}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {bodyTypes.map((type: FilterOption) => (
                                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Axle Config</label>
                            <Select value={axleConfigId} onValueChange={setAxleConfigId}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {axleConfigs.map((config: FilterOption) => (
                                  <SelectItem key={config.id} value={config.id}>{config.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Fuel Type</label>
                            <Select value={fuelTypeId} onValueChange={setFuelTypeId}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {fuelTypes.map((fuel: FilterOption) => (
                                  <SelectItem key={fuel.id} value={fuel.id}>{fuel.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Emission Norm</label>
                            <Select value={emissionNormId} onValueChange={setEmissionNormId}>
                              <SelectTrigger size="sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {emissionNorms.map((norm: FilterOption) => (
                                  <SelectItem key={norm.id} value={norm.id}>{norm.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Year Range</label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={yearMin}
                                onChange={(e) => setYearMin(e.target.value)}
                                className="h-8"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={yearMax}
                                onChange={(e) => setYearMax(e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium">Price Range (₹)</label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                className="h-8"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t">
                          <Button variant="outline" size="sm" onClick={handleClearFilters}>
                            Clear
                          </Button>
                          <Button size="sm" onClick={handleApplyFilters}>
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 items-center">
                  <Select value={limit.toString()} onValueChange={(val) => {
                    setLimit(parseInt(val));
                    setPage(1);
                  }}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">{selectedIds.size} selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('reserve')}>
                      Mark Reserved
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('sold')}>
                      Mark Sold
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                      Archive
                    </Button>
                    <Select onValueChange={(val) => handleBulkAction('status', val)}>
                      <SelectTrigger asChild>
                        <Button size="sm" variant="outline">Change Status</Button>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="RESERVED">Reserved</SelectItem>
                        <SelectItem value="SOLD">Sold</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No vehicles found</p>
                  <Button asChild variant="outline">
                    <Link href="/jammanage/vehicles/new">
                      <Plus className="size-4 mr-2" />
                      Add your first vehicle
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={vehicles.length > 0 && selectedIds.size === vehicles.length}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="w-16">Image</TableHead>
                          <TableHead>
                            <button
                              onClick={() => handleSort('title')}
                              className="flex items-center hover:text-foreground"
                            >
                              Title
                              <SortIcon field="title" />
                            </button>
                          </TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Make/Model</TableHead>
                          <TableHead>Body Type</TableHead>
                          <TableHead>Axle Config</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>
                            <button
                              onClick={() => handleSort('askingPriceInr')}
                              className="flex items-center hover:text-foreground"
                            >
                              Price
                              <SortIcon field="askingPriceInr" />
                            </button>
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <button
                              onClick={() => handleSort('updatedAt')}
                              className="flex items-center hover:text-foreground"
                            >
                              Updated
                              <SortIcon field="updatedAt" />
                            </button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicles.map((vehicle: Vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.has(vehicle.id)}
                                onCheckedChange={(checked) => handleSelectOne(vehicle.id, !!checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="size-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                                {vehicle.coverUrl ? (
                                  <img
                                    src={vehicle.coverUrl}
                                    alt={vehicle.title}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="text-xs text-muted-foreground">No image</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/jammanage/vehicles/${vehicle.id}`}
                                className="font-semibold hover:text-primary"
                              >
                                {vehicle.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant={vehicle.condition === 'NEW' ? 'success' : 'warning'}>
                                {vehicle.condition}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {vehicle.make.name} {vehicle.model.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {vehicle.bodyType.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {vehicle.axleConfig.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {vehicle.city}, {vehicle.state}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatPrice(vehicle.askingPriceInr)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                                {getStatusLabel(vehicle.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {format(new Date(vehicle.updatedAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" mode="icon">
                                    <MoreVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/jammanage/vehicles/${vehicle.id}`}>
                                      <Edit className="size-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/vehicles/${vehicle.slug}`} target="_blank">
                                      <Eye className="size-4 mr-2" />
                                      View
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    toast.info('Duplicate feature coming soon');
                                  }}>
                                    <Copy className="size-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleBulkAction('reserve')}>
                                    <CheckCircle2 className="size-4 mr-2" />
                                    Mark Reserved
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBulkAction('sold')}>
                                    <DollarSign className="size-4 mr-2" />
                                    Mark Sold
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                                    <Archive className="size-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} vehicles
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (page <= 3) {
                              pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = page - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={page === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
