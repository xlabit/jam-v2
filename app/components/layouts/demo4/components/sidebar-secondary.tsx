'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenuDashboard } from './sidebar-menu-dashboard';
import { SidebarMenuDefault } from './sidebar-menu-default';
import { SidebarMenuJammanage } from './sidebar-menu-jammanage';

export function SidebarSecondary() {
  const pathname = usePathname();

  return (
    <div className="grow shrink-0 ps-3.5 kt-scrollable-y-hover max-h-[calc(100vh-2rem)] pe-1 my-5">
      {pathname.startsWith('/jammanage') ? (
        <SidebarMenuJammanage />
      ) : pathname === '/' ? (
        <SidebarMenuDashboard />
      ) : (
        <SidebarMenuDefault />
      )}
    </div>
  );
}
