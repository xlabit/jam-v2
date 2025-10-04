'use client';

import { ReactNode } from 'react';
import { Demo4Layout } from '@/app/components/layouts/demo4/layout';

export default function JammanageLayout({ children }: { children: ReactNode }) {
  return <Demo4Layout>{children}</Demo4Layout>;
}
