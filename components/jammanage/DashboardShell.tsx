'use client';

import { signOut, useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/jammanage' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                Jain Automart Admin
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="text-gray-700 font-medium">
                  {session?.user?.name || 'Site Owner'}
                </p>
                <p className="text-gray-500 text-xs">
                  {session?.user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
