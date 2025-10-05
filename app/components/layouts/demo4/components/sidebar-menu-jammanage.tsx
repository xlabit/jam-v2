'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Shield,
  UserCircle,
  Truck,
  Tag,
  Layers,
  Grid3x3,
  Fuel,
  Wind,
  Cog,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItemType {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItemType[];
}

const menuItems: MenuItemType[] = [
  {
    label: 'Dashboard',
    path: '/jammanage/dashboard',
    icon: BarChart3,
  },
];

const menuSections = [
  {
    title: 'VEHICLES',
    items: [
      {
        label: 'Vehicles',
        path: '/jammanage/vehicles',
        icon: Truck,
      },
      {
        label: 'Makes',
        path: '/jammanage/vehicles/makes',
        icon: Tag,
      },
      {
        label: 'Models',
        path: '/jammanage/vehicles/models',
        icon: Layers,
      },
      {
        label: 'Variants',
        path: '/jammanage/vehicles/variants',
        icon: Grid3x3,
      },
      {
        label: 'Body Types',
        path: '/jammanage/vehicles/body-types',
        icon: Package,
      },
      {
        label: 'Axle Configurations',
        path: '/jammanage/vehicles/axle-config',
        icon: Cog,
      },
      {
        label: 'Fuel Types',
        path: '/jammanage/vehicles/fuel-types',
        icon: Fuel,
      },
      {
        label: 'Emission Norms',
        path: '/jammanage/vehicles/emission-norms',
        icon: Wind,
      },
      {
        label: 'Transmissions',
        path: '/jammanage/vehicles/transmissions',
        icon: Settings,
      },
      {
        label: 'Feature Tags',
        path: '/jammanage/vehicles/feature-tags',
        icon: Zap,
      },
    ],
  },
  {
    title: 'SERVICE CENTERS',
    items: [
      {
        label: 'Service Centers',
        path: '/jammanage/service-centers',
        icon: Package,
      },
      {
        label: 'Service Center Types',
        path: '/jammanage/service-center-types',
        icon: Settings,
      },
      {
        label: 'Vehicle Brands',
        path: '/jammanage/vehicle-brands',
        icon: Shield,
      },
      {
        label: 'Service Types',
        path: '/jammanage/service-types',
        icon: FileText,
      },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      {
        label: 'Inventory',
        path: '/jammanage/inventory',
        icon: Package,
      },
      {
        label: 'Orders',
        path: '/jammanage/orders',
        icon: ShoppingCart,
      },
      {
        label: 'Customers',
        path: '/jammanage/customers',
        icon: Users,
      },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        label: 'General Settings',
        path: '/jammanage/settings',
        icon: Settings,
      },
      {
        label: 'Security',
        path: '/jammanage/security',
        icon: Shield,
      },
      {
        label: 'Profile',
        path: '/jammanage/profile',
        icon: UserCircle,
      },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      {
        label: 'Analytics',
        path: '/jammanage/analytics',
        icon: BarChart3,
      },
      {
        label: 'Documents',
        path: '/jammanage/documents',
        icon: FileText,
      },
    ],
  },
];

export function SidebarMenuJammanage() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col gap-5 pb-3">
      <div className="flex flex-col gap-0.5">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.path}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-background text-primary border border-input'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground',
              )}
            >
              {Icon && <Icon className="size-4.5" />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-1">
          <div className="text-2xs font-semibold text-muted-foreground uppercase px-2.5 py-1.5">
            {section.title}
          </div>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Link
                  key={itemIndex}
                  href={item.path}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-background text-primary border border-input'
                      : 'text-muted-foreground hover:bg-background hover:text-foreground',
                  )}
                >
                  {Icon && <Icon className="size-4.5" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
