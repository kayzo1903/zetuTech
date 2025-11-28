'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientHeader({ session, isAdmin }: any) {
  const pathname = usePathname();

  // ✅ Hide header on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <Header session={session} isAdmin={isAdmin} />;
}
